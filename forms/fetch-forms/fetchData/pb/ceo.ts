// fetch from https://www.ceopunjab.gov.in/forms
import * as cheerio from "https://esm.sh/cheerio@1.0.0-rc.12";
import { STATUS_CODE } from 'jsr:@oak/commons/status';
import { pbCeoArr } from "../../model_json/pb/ceo.ts";
import { FormJson, NestedGroupJson } from "../../model_json/common.ts";
import { normalize } from "https://deno.land/std@0.224.0/url/normalize.ts";
import * as path from "jsr:@std/path";
import { Types, startSession } from "npm:mongoose@^6.7";
import { uploadFile } from "../../../gcloud/upload-file.ts";
import { Bucket } from "npm:@google-cloud/storage";
import { PbCeo, PbCeoForm } from "../../../schemas/pb/ceo.ts";
import { getBucket } from "../../../gcloud/get-bucket.ts";

const BASE_URL = 'https://www.ceopunjab.gov.in/';

export const initiateCeoPb = async () => {

    await initiateCeoPbFetchData();
    await initiateGeneralPbStoreFiles();
}

const initiateCeoPbFetchData = async() => {

    const response = await fetch('https://www.ceopunjab.gov.in/forms');
    if (response.status !== STATUS_CODE.OK) {
        console.error('unable to fetch pb ceo forms')
    }
    const $ = cheerio.load(await response.text());

    const allCategories = $('section.inner_page').find('.row');
    const pbCeo: pbCeoArr = []; 

    await PbCeoForm.collection.drop();
    await PbCeo.collection.drop();

    const session = await startSession();
    session.startTransaction();
    for(let i = 1; i < allCategories.length; i++) {
        // ignore the first 
        const forms: FormJson[] = []
        const nestedGroups: NestedGroupJson[] = [];
        const category = allCategories[i];
        const title = $(category).find('div:first-child strong').text() ?? '';
        
        await PbCeo.create({
            title,
            forms,
            nestedGroups,
        })
        pbCeo.push({
            title,
            forms,
            nestedGroups,
        })
    }
    await session.commitTransaction();
    session.endSession();

    const sessionForm = await startSession();
    sessionForm.startTransaction();
    for(let i = 1; i < allCategories.length; i++) {
        // ignore the first 
        const forms: FormJson[] = []
        const category = allCategories[i];
        const title = $(category).find('div:first-child strong').text() ?? '';

        const categoryDocument = await PbCeo.findOne({ title }).exec();
        if (categoryDocument == null) {
            session.abortTransaction();
            session.endSession();
            continue;
        }
    
        const allForms = $(category).find('div:nth-child(2) li')
        if (allForms == null) {
            continue;
        }
        const formIds: Types.ObjectId[] = [];
        for(let i = 0; i < allForms.length; i++) {
            const name = $(allForms[i]).find('div:nth-child(2)').text() ?? '';
            const link = $(allForms[i]).find('div:first-child a').attr('href') ?? '';
            forms.push({
                name,
                link: normalize(`${BASE_URL}${link}`).toString(),
            })
            const createdForm = await PbCeoForm.create({
                name,
                link: normalize(`${BASE_URL}${link}`).toString(),
            })
            if (createdForm != null) {
                formIds.push(createdForm.id);
            }
        }
        const foundCategory = pbCeo.find(doc => doc.title === title);
        if(foundCategory !=  null) {
            foundCategory.forms = forms;
        }


        categoryDocument.forms.push(...formIds);
        categoryDocument.save();
    }

    const __dirname = path.dirname(path.fromFileUrl(import.meta.url));
    const storeDir = path.join(__dirname, '../../storeFormsData/');

    try{
        await Deno.mkdir(path.join(storeDir, 'pb'));
    } catch(err) {
        if (err instanceof Deno.errors.AlreadyExists) {
            Deno.writeTextFileSync(path.join(storeDir, 'pb', 'ceo.json'), JSON.stringify(pbCeo));
        }
    }
}

const initiateGeneralPbStoreFiles = async() => {
         // we should now have the data, start fetching the files

         const allforms = await PbCeoForm.find();

         if (allforms == null || !Array.isArray(allforms) || (Array.isArray(allforms) && allforms.length === 0)) {
             return;
         }
         // get bucket 
         const bucket = getBucket();
         for(let i = 0; i < allforms.length; i++) {
             console.log(allforms[i].link)
             if (allforms[i].link) {
                const delimited = (allforms[i] as any).link.split('/');
                let fileName = delimited[delimited.length-1];
                fileName = ceoFileName.encode(fileName);
                 await downloadAndStorePdf((allforms[i] as any).link, fileName, bucket);
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

        if (!response || (response.status != STATUS_CODE.OK)) {
            console.error(`Unable to fetch the file: ${link}`);
            return;
        }
        await uploadFile(bucket, fileName, response);
    
    } catch(e) {
        console.error(`Unable to safe pdf file for Punjab ceo forms. Link:${link}. Error is: ${e}`)
    }
}


export const ceoFileName = {
    encode: (name: string) => {
        // eg: name = DownLoadDocument?t=4&l=En&q=form'
        let encoded: string = '';
        const params = name.split('?')[1];
        const searchParams = new URLSearchParams(params);
        for (const value of searchParams.values()) {
            encoded = encoded + value + '_';
          }
        encoded = encoded.substring(0, encoded.length - 1);
        encoded = encoded + '.pdf';
        return `pb/ceo/${encoded}`;
    },
}