// fetch from https://punjab.gov.in/forms/
import * as cheerio from "https://esm.sh/cheerio@1.0.0-rc.12";
import { STATUS_CODE } from 'jsr:@oak/commons/status';
import { PbGeneralArr } from "../../model_json/pb/general.ts";
import { FormJson, NestedGroupJson } from "../../model_json/common.ts";
import * as path from "jsr:@std/path";
import { Types, startSession } from "npm:mongoose@^6.7";
import { PbGeneral, PbGeneralForm } from "../../schemas/pb/general.ts";
import { copy, readerFromStreamReader } from "https://deno.land/std@0.152.0/streams/conversion.ts";
import logger from "../../logs/log.ts";
import { normalizeFilename } from "../../utils/file-normalizer.ts";



export const initiateGeneralPb = async () => {

    // await initiateGeneralPbFetchData();
    await initiateGeneralPbStoreFiles();
}

const initiateGeneralPbFetchData = async() => {

    const response = await fetch('https://punjab.gov.in/forms/');
    if (response.status !== STATUS_CODE.OK) {
        logger.error('unable to fetch pb general forms');
        return;
    }
    const $ = cheerio.load(await response.text());

    const allCategories = $('div.wpb_wrapper > div.bwl_acc_container > section');

    const pbGeneral: PbGeneralArr = []; 

    await PbGeneral.collection.drop();
    await PbGeneralForm.collection.drop();

    const session = await startSession();
    session.startTransaction();
    for(let i = 0; i < allCategories.length; i++) {
        let title = '';
        const forms: FormJson[] = []
        const nestedGroups: NestedGroupJson[] = [];
        const category = allCategories[i];
        const h2 = $(category).find('h2');
        if (h2 != null) {
            title = h2.text();
        }
        await PbGeneral.create({
            title,
            forms,
            nestedGroups,
        })

        pbGeneral.push({
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
        let title = '';
        const forms: FormJson[] = []
        const category = allCategories[i];
        const h2 = $(category).find('h2');
        if (h2 != null) {
            title = h2.text();
        }

        const categoryDocument = await PbGeneral.findOne({ title }).exec();
        if (categoryDocument == null) {
            session.abortTransaction();
            session.endSession();
            continue;
        }

        const tableOfForms = $(category).find('table');
        if (tableOfForms == null) { 
            continue;
        }
        const allForms = tableOfForms.find('tr');
        const formIds: Types.ObjectId[] = [];
        for(let i = 1; i < allForms.length; i++) {
            // skip the first as it is just a heading
            const name = $(allForms[i]).find('td:nth-child(2)').text();
            const linkElem = $(allForms[i]).find('td:nth-child(3) > a');
            const link = linkElem.attr('href') ?? '';
            forms.push({
                name,
                link,
            })
            const createdForm = await PbGeneralForm.create({
                name,
                link,
            })
            if (createdForm != null) {
                formIds.push(createdForm.id);
            }
        }
        const foundCategory = pbGeneral.find(doc => doc.title === title);
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
            Deno.writeTextFileSync(path.join(storeDir, 'pb', 'generalPb.json'), JSON.stringify(pbGeneral));
        }
    }
}

const initiateGeneralPbStoreFiles = async() => {
     // we should now have the data, start fetching the files

     const allforms = await PbGeneralForm.find();

     if (allforms == null || !Array.isArray(allforms) || (Array.isArray(allforms) && allforms.length === 0)) {
         return;
     }
     for(let i = 0; i < allforms.length; i++) {
         if (allforms[i].link) {
             let filename = allforms[i].link;
             if (filename == null || filename === '') {
                continue;
             }
             filename = normalizeFilename(filename);
             await downloadAndStorePdf((allforms[i] as any).link, filename);
         }
     }
}

const downloadAndStorePdf = async (link: string, fileName: string) => {
    // In some scenarios, the link is concatenated twice accidently,have to account for that and fix
    const linkArr = link.split('https');
    if (link.startsWith('https') && linkArr.length > 2) {
        link = `https${linkArr[linkArr.length - 1]}`;
    }

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

        const __dirname = path.dirname(path.fromFileUrl(import.meta.url));
        const storeDir = path.join(__dirname, '../../storeFiles/pb/general');
    
        await Deno.create(`${storeDir}/${fileName}`);
        const file = await Deno.open(`${path.join(__dirname, '../../storeFiles/pb/general')}/${fileName}`, { create: true, write: true, read: true })
        if (response.body) {
            const reader = readerFromStreamReader(response.body.getReader());
            await copy(reader, file);
         }
        file.close();
    } catch(e) {
        console.log('error: ', e);
        const __dirname = path.dirname(path.fromFileUrl(import.meta.url));
        const storeDir = path.join(__dirname, '../../logs/logs/error.log');
        const perms = await Deno.permissions.request({ name: 'write', path: storeDir});
        if (perms.state === "granted") {
            console.log('granted');
        }
        logger.error(`Unable to safe pdf file for Punjab General forms. Link:${link}. Error is: ${e}`)
    }
}
