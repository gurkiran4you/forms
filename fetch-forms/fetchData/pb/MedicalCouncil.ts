import * as cheerio from "https://esm.sh/cheerio@1.0.0-rc.12";
import { STATUS_CODE } from 'jsr:@oak/commons/status';
import { FormJson, NestedGroupJson } from "../../model_json/common.ts";
import * as path from "jsr:@std/path";
import { Types, startSession } from "npm:mongoose@^6.7";
import { copy, readerFromStreamReader } from "https://deno.land/std@0.152.0/streams/conversion.ts";
import logger from "../../logs/log.ts";
import { normalizeFilename } from "../../utils/file-normalizer.ts";
import { PbMedicalCouncil, PbMedicalCouncilForm } from "../../schemas/pb/medical-council.ts";
import { PbMedicalCouncilArr } from "../../model_json/pb/medical-council.ts";
import { getBucket, uploadFile } from "../../gcloud/upload-file.ts";
import { Bucket } from "npm:@google-cloud/storage";

export const intitiateMedicalCouncilPb = async () => {

    await initiateMedicalCouncilPbFetchData();
    await initiateMedicalCouncilPbStoreFiles();
}

const initiateMedicalCouncilPbFetchData = async() => {

    const response = await fetch('https://punjabmedicalcouncil.in/');
    if (response.status !== STATUS_CODE.OK) {
        logger.error('unable to fetch pb medical council forms', response);
        return;
    }
    const $ = cheerio.load(await response.text());

    const allTitlesContainers = $('div.home-noti');
    const allFormUls = $('marquee');

    if (allTitlesContainers.length !== allFormUls.length) {
        console.log('Pb Medical council, titles should match the formLists');
        return;
    }

    const pbMedicalCouncil: PbMedicalCouncilArr = []; 

    await PbMedicalCouncil.collection.drop();
    await PbMedicalCouncilForm.collection.drop();

    const session = await startSession();
    session.startTransaction();
    for(let i = 0; i < allTitlesContainers.length; i++) {
        let title = '';
        const forms: FormJson[] = []
        const nestedGroups: NestedGroupJson[] = [];
        title = $(allTitlesContainers[i]).find('h3').text().trim() ?? '';

        await PbMedicalCouncil.create({
            title,
            forms,
            nestedGroups,
        })

        pbMedicalCouncil.push({
            title,
            forms,
            nestedGroups,
        })
    }
    await session.commitTransaction();
    session.endSession();


    const sessionForm = await startSession();
    sessionForm.startTransaction();
    for(let i = 0; i < allTitlesContainers.length; i++) {
        let title = '';
        const forms: FormJson[] = []
        title = $(allTitlesContainers[i]).find('h3').text().trim() ?? '';

        const categoryDocument = await PbMedicalCouncil.findOne({ title }).exec();
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
            const link = $(allForms[i]).attr('href') ?? '';
            forms.push({
                name,
                link,
            })
            const createdForm = await PbMedicalCouncilForm.create({
                name,
                link,
            })
            if (createdForm != null) {
                formIds.push(createdForm.id);
            }
        }
        // json
        const foundCategory = pbMedicalCouncil.find(doc => doc.title === title);
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
            Deno.writeTextFileSync(path.join(storeDir, 'pb', 'medicalCouncilPb.json'), JSON.stringify(pbMedicalCouncil));
        }
    }
}

const initiateMedicalCouncilPbStoreFiles = async() => {
     // we should now have the data, start fetching the files

     const allforms = await PbMedicalCouncilForm.find();

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
             filename = `pb/medical-council/${normalizeFilename(filename)}`;
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
        console.log('error: ', e);
        logger.error(`Unable to safe pdf file for Punjab medical council forms. Link:${link}. Error is: ${e}`)
    }
}
