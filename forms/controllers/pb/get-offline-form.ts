// deno-lint-ignore-file no-fallthrough
import * as path from "jsr:@std/path";
import logger from "../../logs/log.ts";
import { retrieveFile } from "../../gcloud/retrieve-file.ts";


export const getOfflineFormPb = async(formLink: string, category: string): Promise<Uint8Array | null> => {
    try {
        let prepend = 'pb/';
        switch (category) {
            case "general":
                {
                    prepend += 'general/';
                    break;
                    // const __dirname = path.dirname(path.fromFileUrl(import.meta.url));
                    // const storeDir = path.join(__dirname, '../../storeFiles/pb/general');
                    // const bytes = await Deno.readFile(path.join(`${storeDir}/${formLink}`));
                    // return bytes;
                }   
            case "pspcl":
                {
                    prepend += 'pspcl/';
                    break;
                    // const __dirname = path.dirname(path.fromFileUrl(import.meta.url));
                    // const storeDir = path.join(__dirname, '../../storeFiles/pb/pspcl');
                    // const bytes = await Deno.readFile(path.join(`${storeDir}/${formLink}`));
                    // return bytes;
                }   
            case "ceo":
                {
                    prepend += 'ceo/';
                    break;
                    // const __dirname = path.dirname(path.fromFileUrl(import.meta.url));
                    // const storeDir = path.join(__dirname, '../../storeFiles/pb/ceo');
                    // const bytes = await Deno.readFile(path.join(`${storeDir}/${formLink}`));
                    // return bytes;
                }   
            case "transport":
                {
                    prepend += 'transport/';
                    break;
                    // const __dirname = path.dirname(path.fromFileUrl(import.meta.url));
                    // const storeDir = path.join(__dirname, '../../storeFiles/pb/transport');
                    // const bytes = await Deno.readFile(path.join(`${storeDir}/${formLink}`));
                    // return bytes;
                }   
            case "medical-council":
                {
                    prepend += 'medical-council/';
                    break;
                    // const __dirname = path.dirname(path.fromFileUrl(import.meta.url));
                    // const storeDir = path.join(__dirname, '../../storeFiles/pb/medical-council');
                    // const bytes = await Deno.readFile(path.join(`${storeDir}/${formLink}`));
                    // return bytes;
                }   
            case "pseb":
                {
                    prepend += 'pseb/';
                    break;
                    // const __dirname = path.dirname(path.fromFileUrl(import.meta.url));
                    // const storeDir = path.join(__dirname, '../../storeFiles/pb/pseb');
                    // const bytes = await Deno.readFile(path.join(`${storeDir}/${formLink}`));
                    // return bytes;
                }   
            default:
        }
        const file = await retrieveFile(`${prepend}${formLink}`);
        return file;
    }
    catch (err) {
        logger.error(`Unable to get pdf file for link: ${formLink} and category: ${category}. Error: ${err}`)
        return null;
      }
}