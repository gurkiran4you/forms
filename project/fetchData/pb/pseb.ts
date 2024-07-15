import * as cheerio from "https://esm.sh/cheerio@1.0.0-rc.12";
import { STATUS_CODE } from "jsr:@oak/commons/status";
import { logger } from "../../logs/log.ts";
import { PbPseb, PbPsebForm } from "../../schemas/pb/pseb.ts";
import { Types, startSession } from "npm:mongoose@^6.7";
import * as path from "jsr:@std/path";
import { copy, readerFromStreamReader } from "https://deno.land/std@0.152.0/streams/conversion.ts";
import { PbPseb_m } from "../../models/pb/pseb.ts";



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

    await PbPsebForm.collection.drop();
    for(let i = 0; i < pbPseb.length; i++) {
    // fetch the url of syllabusUrl
        const url = pbPseb[i].syllabusUrl; // fetch url
        if (url == null || url == '') {
            continue;
        }
        const response = await fetchHTML(url);
        // At this point , we have the html text of first link
        // we need to extract out Class and subjects
        const $ = cheerio.load(response);
        const classNameTitles = $('.acc__title');
        const subjects  = $('.acc__panel');// give us all subjects
        for(let y = 0; y < classNameTitles.length; y++) {
            const formIDs: Types.ObjectId[] = [];
            const className = $(classNameTitles[y]).text();
            // The data list is inconsistent
            // Can contain only li , only p tag or a combination of both
            // const subjectForms = $(subjects[y]).find('li');
            // const subjectFormsStandAlone = $(subjects[y]).find('> p');
            // const subjectFormsLinks =Array.from(subjectForms.map((i, form) =>  $(form).find('a')));
            // const subjectFormsLinksStandAlone = Array.from(subjectFormsStandAlone.map((i, form) => $(form).find('a')))

            // const totalLinks = subjectFormsLinks.concat(subjectFormsLinksStandAlone);
            const totalLinks = Array.from($(subjects[y]).find('a'));
            //console.log(totalLinks.length);

            //console.log(subjectFormsLinks.length, subjectFormsLinksStandAlone.length);

           // console.log(subjectForms.length, subjectFormsStandAlone.length);
             const allSubjects = totalLinks.map((link) => ({ name: $(link).text(), link: $(link).attr('href') ?? ''  }));
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

            // search record by title
            const savedTitle = pbPseb[i].title.trim();
            const foundRecord = await PbPseb.findOne({ title: savedTitle }).exec();
            if (foundRecord == null) {
                console.log('record not found');
                continue;
            }

            foundRecord?.syllabus.push({
                class: className,
                subject: formIDs,
            })

            foundRecord.save();
        }
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
                syllabus: [],
            });
        }

        await session.commitTransaction();
        session.endSession();
    } catch (error) {
        console.error('Error saving titles to DB:', error);
    }
}

export async function initiatePsebPb() {
    //await initiatePsebPbFetchData();
    await initiatePsebPbStoreFiles();
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
            console.log('here?');
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
    console.log(allforms.length);
    for(let i = 0; i < allforms.length; i++) {
        console.log(allforms[i].link)
        if (allforms[i].link) {
            const delimited = (allforms[i] as any).link.split('/');
            const fileName = delimited[delimited.length-1];
            await downloadAndStorePdf((allforms[i] as any).link, fileName
            );
        }
    }
    // await downloadAndStorePdf('https://pspcl.in/media/pdf/10007/family-pension-instructions.docx', 
    //     'test.docx'
    // );
}

const downloadAndStorePdf = async (link: string, fileName: string) => {

   const response = await fetch(link,{
       headers: { 
         "Accept": "application/pdf,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
       }
     });

   if (response.status != STATUS_CODE.OK) {
       logger.error(`Unable to fetch the file: ${link}`);
       return;
   }
   const __dirname = path.dirname(path.fromFileUrl(import.meta.url));
   const storeDir = path.join(__dirname, '../../storeFiles/pb/pseb');

   await Deno.create(`${storeDir}/${fileName}`);
   const file = await Deno.open(`${path.join(__dirname, '../../storeFiles/pb/pseb')}/${fileName}`, { create: true, write: true, read: true })
   if (response.body) {
       const reader = readerFromStreamReader(response.body.getReader());
       await copy(reader, file);
    }
   file.close();
}

