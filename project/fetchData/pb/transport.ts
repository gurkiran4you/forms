// fetch from https://punjabtransport.org/forms.aspx
import * as cheerio from "https://esm.sh/cheerio@1.0.0-rc.12";
import { STATUS_CODE } from 'jsr:@oak/commons/status';
import { FormJson, NestedGroupJson } from "../../model_json/common.ts";
import * as path from "jsr:@std/path";
import { Types, startSession } from "npm:mongoose@^6.7";
import { copy, readerFromStreamReader } from "https://deno.land/std@0.152.0/streams/conversion.ts";
import logger from "../../logs/log.ts";
import { normalizeFilename } from "../../utils/file-normalizer.ts";
import { PbTransportArr } from "../../model_json/pb/transport.ts";
import { PbTransport, PbTransportForm } from "../../schemas/pb/transport.ts";
import { normalize } from "https://deno.land/std@0.224.0/url/normalize.ts";


const BASE_URL = 'http://punjabtransport.org/';

export const intitiateTransportPb = async () => {

    await initiateTransportPbFetchData();
    await initiateTransportPbStoreFiles();
}

const initiateTransportPbFetchData = async() => {

    const response = await fetch('http://punjabtransport.org/forms.aspx', {
        headers: {
            'Accept-Encoding': 'gzip, deflate, br, zstd',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7'
        }
    });
    if (response.status !== STATUS_CODE.OK) {
        logger.error('unable to fetch pb transport forms', response);
        return;
    }
    const $ = cheerio.load(await response.text());

    const allTitles = $('div#center_wrap2 > h3.about_sub_heading');
    const allFormUls = $('div#center_wrap2  ul');

    if (allTitles.length !== allFormUls.length) {
        console.log('Pb Transport, titles should match the formLists');
        return;
    }

    const pbTransport: PbTransportArr = []; 

    await PbTransport.collection.drop();
    await PbTransportForm.collection.drop();

    const session = await startSession();
    session.startTransaction();
    for(let i = 0; i < allTitles.length; i++) {
        let title = '';
        const forms: FormJson[] = []
        const nestedGroups: NestedGroupJson[] = [];
        title = $(allTitles[i]).text().trim() ?? '';

        await PbTransport.create({
            title,
            forms,
            nestedGroups,
        })

        pbTransport.push({
            title,
            forms,
            nestedGroups,
        })
    }
    await session.commitTransaction();
    session.endSession();


    const sessionForm = await startSession();
    sessionForm.startTransaction();
    for(let i = 0; i < allTitles.length; i++) {
        let title = '';
        const forms: FormJson[] = []
        title = $(allTitles[i]).text().trim() ?? '';

        const categoryDocument = await PbTransport.findOne({ title }).exec();
        if (categoryDocument == null) {
            session.abortTransaction();
            session.endSession();
            continue;
        }

        const formContainer = allFormUls[i];
        if (formContainer == null) { 
            continue;
        }
        const allForms = $(formContainer).find('a');
        console.log(allForms.length);
        const formIds: Types.ObjectId[] = [];
        for(let i = 0; i < allForms.length; i++) {
            const name = $(allForms[i]).text();
            const link = normalize(`${BASE_URL}${$(allForms[i]).attr('href')}`).toString() ?? '';
            forms.push({
                name,
                link,
            })
            const createdForm = await PbTransportForm.create({
                name,
                link,
            })
            if (createdForm != null) {
                formIds.push(createdForm.id);
            }
        }
        // json
        const foundCategory = pbTransport.find(doc => doc.title === title);
        if(foundCategory !=  null) {
            foundCategory.forms = forms;
        }

        // db
        categoryDocument.forms.push(...formIds);
        categoryDocument.save();
    }


    const __dirname = path.dirname(path.fromFileUrl(import.meta.url));
    const storeDir = path.join(__dirname, '../../storeFormsData/');

    try{
        await Deno.mkdir(path.join(storeDir, 'pb'));
    } catch(err) {
        if (err instanceof Deno.errors.AlreadyExists) {
            Deno.writeTextFileSync(path.join(storeDir, 'pb', 'transportPb.json'), JSON.stringify(pbTransport));
        }
    }
}

const initiateTransportPbStoreFiles = async() => {
     // we should now have the data, start fetching the files

     const allforms = await PbTransportForm.find();

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
        const storeDir = path.join(__dirname, '../../storeFiles/pb/transport');
    
        await Deno.create(`${storeDir}/${fileName}`);
        const file = await Deno.open(`${path.join(__dirname, '../../storeFiles/pb/transport')}/${fileName}`, { create: true, write: true, read: true })
        if (response.body) {
            const reader = readerFromStreamReader(response.body.getReader());
            await copy(reader, file);
         }
        file.close();
    } catch(e) {
        console.log('error: ', e);
        logger.error(`Unable to safe pdf file for Punjab transport forms. Link:${link}. Error is: ${e}`)
    }
}
