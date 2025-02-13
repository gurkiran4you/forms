// fetch from https://pspcl.in/download-forms.aspx
import * as cheerio from "https://esm.sh/cheerio@1.0.0-rc.12";
import { STATUS_CODE } from 'jsr:@oak/commons/status';
import { PbPspclArr } from "../../model_json/pb/pspcl.ts";
import { FormJson, NestedGroupJson } from "../../model_json/common.ts";
import * as path from "jsr:@std/path";
import { PbPspcl, PbPspclForm, PbPspclNestedGroup} from "../../../schemas/pb/pspcl.ts";
import { Types, startSession } from 'npm:mongoose@^6.7';
import { normalizeFilename } from "../../utils/file-normalizer.ts";
import { normalize } from "https://deno.land/std@0.224.0/url/normalize.ts";
import { uploadFile } from "../../../gcloud/upload-file.ts";
import { Bucket } from "@google-cloud/storage";
import { Form_m } from "../../../models/common.ts";
import { getBucket } from "../../../gcloud/get-bucket.ts";


const BASE_URL = 'https://pspcl.in/';

export const initiatePspclPb = async () => {


    await initiatePspclPbFetchData();
    await initiatePspclPbStoreFiles();
}


const initiatePspclPbFetchData = async () => {
    const response = await fetch('https://pspcl.in/download-forms.aspx');
    
    if (response.status !== STATUS_CODE.OK) {
        console.error('unable to fetch pb pspcl forms');
    }

    const $ = cheerio.load(await response.text());

    const allCategories = $('div#content > div:nth-child(2) table');

    const pbPspcl: PbPspclArr = []; 

    await PbPspcl.collection.drop();
    await PbPspclForm.collection.drop();
    await PbPspclNestedGroup.collection.drop();

    const session = await startSession();
    session.startTransaction();
    for(let i = 0; i < allCategories.length; i++) {
        let title = '';
        const forms: FormJson[] = []
        const nestedGroups: NestedGroupJson[] = [];
        const category = allCategories[i];
        const h2 = $(category).find('tr:nth-child(1) td:nth-child(2)');
        if (h2 != null) {
            title = h2.text();
        }
        await PbPspcl.create({
            title, 
            forms,
            nestedGroups,
        })

        pbPspcl.push({
            title,
            forms,
            nestedGroups,
        })
    }
    await session.commitTransaction();
    session.endSession();

    const sessionForm = await startSession();
    sessionForm.startTransaction();
    for(let i = 0; i < allCategories.length; i++) {
        const forms: FormJson[] = []
        let nestedForms: FormJson[] = []
        const nestedGroups: NestedGroupJson[] = []; 
        const category = allCategories[i];
        const h2 = $(category).find('tr:nth-child(1) td:nth-child(2)').text();
        const categoryDocument = await PbPspcl.findOne({ title: h2}).exec();
        if (categoryDocument == null) {
            session.abortTransaction();
            session.endSession();
            continue;
        }

        const allForms = $(category).find('tr');
        if (allForms == null) { 
            continue;
        }

        const formIds: Types.ObjectId[] = [];
        for(let i = 1; i < allForms.length; i++) {
            const nestedGroupformIds: Types.ObjectId[] = [];
            const nestedGroupIds: Types.ObjectId[] = [];
            let name: string;
            // skip the first as it is the title

            // some td:nth-child(2) also contains a tags 
            const nameLinks = $(allForms[i]).find('td:nth-child(2)');
            const nestedLinks = $(nameLinks).find('a') as cheerio.Cheerio<cheerio.Element>;
            const onlyNestedPdflinks = Array.from(nestedLinks).filter(link => $(link).attr('href')?.includes('pdf'));
            if($(onlyNestedPdflinks).length > 0) {
                // sub category 
                const subCategory = $(nameLinks).find('strong:first-child');
                for(let i = 0; i < onlyNestedPdflinks.length; i++) {
                    nestedForms.push({
                        name: $(onlyNestedPdflinks[i]).text() ?? '',
                        link: normalize(`${BASE_URL}${$(onlyNestedPdflinks[i]).attr('href')}`).toString() ?? '',
                    })

                    const createdForm = await PbPspclForm.create({
                        name: $(onlyNestedPdflinks[i]).text() ?? '',
                        link: normalize(`${BASE_URL}${$(onlyNestedPdflinks[i]).attr('href')}`).toString() ?? '',
                    })
                    if (createdForm != null) {
                        nestedGroupformIds.push(createdForm.id);
                    }
                }

                const createdNestedgroup = await PbPspclNestedGroup.create({
                    subCategory: $(subCategory).text() ?? '',
                    forms: nestedGroupformIds,
                })
                nestedGroupIds.push(createdNestedgroup.id);
                categoryDocument.nestedGroups.push(...nestedGroupIds);


                // json
                nestedGroups.push({
                    subCategory: $(subCategory).text() ?? '',
                    forms: nestedForms,
                })

                nestedForms = [];
            } else {
                name = $(nameLinks).text();
                const linkElem = $(allForms[i]).find('td:nth-child(3) > a');
                const link = normalize(`${(BASE_URL)}${linkElem.attr('href')}`).toString();
                // json
                forms.push({
                    name,
                    link,
                })

                // db
                const createdForm = await PbPspclForm.create({
                    name,
                    link,
                })
                if (createdForm != null) {
                    formIds.push(createdForm.id);
                }
            }
        }
        // json
        const foundCategory = pbPspcl.find(doc => doc.title === h2);
        if(foundCategory !=  null) {
            foundCategory.forms = forms;
            foundCategory.nestedGroups = nestedGroups;
        }

        // db
        categoryDocument.forms.push(...formIds);
        categoryDocument.save();
    }

    await session.commitTransaction();
    session.endSession();

    const __dirname = path.dirname(path.fromFileUrl(import.meta.url));
    const storeDir = path.join(__dirname, '../../storeFormsData/');

    try{
        await Deno.mkdir(path.join(storeDir, 'pb'));
    } catch(err) {
        if (err instanceof Deno.errors.AlreadyExists) {
            Deno.removeSync(path.join(storeDir, 'pb', 'pspclPb.json'));
            Deno.writeTextFileSync(path.join(storeDir, 'pb', 'pspclPb.json'), JSON.stringify(pbPspcl));
        }
    }
}

const initiatePspclPbStoreFiles = async () => {
    // we should now have the data, start fetching the files

    const allforms = await PbPspclForm.find();

    if (allforms == null || !Array.isArray(allforms) || (Array.isArray(allforms) && allforms.length === 0)) {
        return;
    }
    const bucket  = getBucket();
    for(let i = 0; i < allforms.length; i++) {
        if (allforms[i].link) {
            let filename = allforms[i].link;
            if (filename == null || filename === '') {
               continue;
            }
            filename = `pb/pspcl/${normalizeFilename(filename)}`;
            await downloadAndStorePdf((allforms[i] as Form_m).link, filename, bucket);
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
            console.error(`Unable to fetch the file: ${link}`);
            return;
        }
        await uploadFile(bucket, fileName, response);
    } catch(e) {
        console.error(`Unable to safe pdf file for Punjab pspcl forms. Link:${link}. Error is: ${e}`)
    }
}