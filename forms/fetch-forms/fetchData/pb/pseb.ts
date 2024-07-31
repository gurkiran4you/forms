import * as cheerio from "https://esm.sh/cheerio@1.0.0-rc.12";
import { STATUS_CODE } from "jsr:@oak/commons/status";
import { PbPseb, PbPsebForm, PbPsebSyllabus } from "../../../schemas/pb/pseb.ts";
import { Types, startSession } from "npm:mongoose@^6.7";
import * as path from "jsr:@std/path";
import { copy, readerFromStreamReader } from "https://deno.land/std@0.152.0/streams/conversion.ts";
import { PbPseb_m } from "../../../models/pb/pseb.ts";
import logger from "../../../logs/log.ts";
import { normalizeFilename } from "../../utils/file-normalizer.ts";
import { getBucket, uploadFile } from "../../gcloud/upload-file.ts";
import { Bucket } from "npm:@google-cloud/storage";



const url = 'https://www.pseb.ac.in/syllabus';

const pbPseb: PbPseb_m[] = [];

// Function to fetch HTML content from URL
async function fetchHTML(url: string): Promise<string> {
    const response = await fetch(url);
    if (response.status !== STATUS_CODE.OK) {
        logger.error('Unable to fetch HTML from URL');
        return '';
    }
    return await response.text();
}

// Function to extract PDF links from HTML using Cheerio
function extractTitles(html: string) {
    const $ = cheerio.load(html);

    const sidebarMenu = $('#sidebar-first .menu'); // gives us container

    const links = $(sidebarMenu).find('li a');

    for(let i = 0; i < links.length; i++) {
        const href = $(links[i]).attr('href');
        const title = $(links[i]).text().trim();
        pbPseb.push({
            title,
            syllabus: [],
            syllabusUrl: href ?? '' // assuming href contains syllabus URL
        });
    }
}

// Function to extract syllabus content from HTML
async function extractSyllabus(html: string) {

    const sessionForm = await startSession();
    sessionForm.startTransaction();

    await PbPsebSyllabus.collection.drop();
    await PbPsebForm.collection.drop();
    for(let i = 0; i < pbPseb.length; i++) {
        const url = pbPseb[i].syllabusUrl; // fetch url
        if (url == null || url == '') {
            continue;
        }
        const response = await fetchHTML(url);
        const $ = cheerio.load(response);
        const classNameTitles = $('.acc__title');
        const subjects  = $('.acc__panel');

        const syllabusIDs: Types.ObjectId[] = [];
        for(let y = 0; y < classNameTitles.length; y++) {
            const formIDs: Types.ObjectId[] = [];
            const className = $(classNameTitles[y]).text();
            const totalLinks = $(classNameTitles[y]).next('.acc__panel').find('a');
            const allSubjects = totalLinks.map(function() { return ({ name: $(this).text(), link: $(this).attr('href') ?? ''  }) }).get();
            pbPseb[i].syllabus.push({
                className,
                subjects: allSubjects,
            })
            // db start
            for(let k = 0; k < allSubjects.length; k++) {
                const createdForm = await PbPsebForm.create({
                    name: allSubjects[k].name,
                    link: allSubjects[k].link,
                })
                formIDs.push(createdForm.id);
            }
            // create syllabi
            const createdSyllabus = await PbPsebSyllabus.create({
                class: className,
                subject: formIDs,
            })

            syllabusIDs.push(createdSyllabus.id);
        }
        // search record by title
        const savedTitle = pbPseb[i].title.trim();
        const foundRecord = await PbPseb.findOne({ title: savedTitle }).exec();
        if (foundRecord == null) {
            console.log('record not found');
            continue;
        }
        foundRecord.syllabus.push(...syllabusIDs);

        foundRecord.save();
    }
    await sessionForm.commitTransaction();
    sessionForm.endSession();
}

async function saveTitlesToDB() {
    try {
        const session = await startSession();
        session.startTransaction();
        await PbPseb.collection.drop();

        for (const entry of pbPseb) {
            const { title } = entry;

            // Save title and syllabus content to database
            await PbPseb.create({
                title: title.trim(),
                syllabus: []
            });
        }

        await session.commitTransaction();
        session.endSession();
    } catch (error) {
        console.error('Error saving titles to DB:', error);
    }
}

export async function initiatePsebPb() {
    // await initiatePsebPbFetchData();
    // await initiatePsebPbStoreFiles();
}

// Main function to orchestrate the process
export async function initiatePsebPbFetchData() {
    try {
        const htmlText = await fetchHTML(url);
        if (htmlText === '') {
            return;
        }
        // FOr each page, extract the titles
        extractTitles(htmlText);
        // save those titles to the Db
        // we will use these to find record by title later
        await saveTitlesToDB();

        // We are extracting remaining data as well as saving them to db in this function
        await extractSyllabus(htmlText);

        const __dirname = path.dirname(path.fromFileUrl(import.meta.url));
        const storeDir = path.join(__dirname, '../../storeFormsData/');
    
        try{
            await Deno.mkdir(path.join(storeDir, 'pb'));
        } catch(err) {
            if (err instanceof Deno.errors.AlreadyExists) {
                Deno.writeTextFileSync(path.join(storeDir, 'pb', 'psebPb.json'), JSON.stringify(pbPseb));
            }
        }

        // Sore to pdf

    } catch (error) {
        console.error('Error:', error);
    }
}


// Function to save forms data to individual files
const initiatePsebPbStoreFiles = async() => {
    // we should now have the data, start fetching the files

    const allforms = await PbPsebForm.find();

    if (allforms == null || !Array.isArray(allforms) || (Array.isArray(allforms) && allforms.length === 0)) {
        return;
    }
    const bucket = getBucket();
    for(let i = 0; i < allforms.length; i++) {
        if (allforms[i].link) {
            let filename = allforms[i].link;
            if (filename == null || filename === '') {
               continue;
            }
            filename = `pb/pseb/${normalizeFilename(filename)}`;
            await downloadAndStorePdf((allforms[i] as any).link, filename, bucket);
        }
    }
}

const downloadAndStorePdf = async (link: string, fileName: string, bucket: Bucket) => {
    try {
        const response = await fetch(link,{
            headers: { 
                "Accept": "application/pdf,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            }
            });

        if (response.status != STATUS_CODE.OK) {
            logger.error(`Unable to fetch the file: ${link}`);
            return;
        }
        await uploadFile(bucket, fileName, response);
   } catch(e) {
    logger.error(`Unable to safe pdf file for Punjab pseb forms. Link:${link}. Error is: ${e}`)
   }
}

