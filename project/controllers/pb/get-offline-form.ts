import * as path from "jsr:@std/path";
import logger from "../../logs/log.ts";


export const getOfflineFormPb = async(formLink: string, category: string): Promise<Uint8Array | null> => {
    try {
        switch (category) {
            case "Punjab Gov":
                {
                    const __dirname = path.dirname(path.fromFileUrl(import.meta.url));
                    const storeDir = path.join(__dirname, '../../storeFiles/pb/general');
                    const bytes = await Deno.readFile(path.join(`${storeDir}/${formLink}`));
                    return bytes;
                }   
            case "Pspcl":
                {
                    const __dirname = path.dirname(path.fromFileUrl(import.meta.url));
                    const storeDir = path.join(__dirname, '../../storeFiles/pb/pspcl');
                    const bytes = await Deno.readFile(path.join(`${storeDir}/${formLink}`));
                    return bytes;
                }   
            case "Ceo":
                {
                    console.log(formLink);
                    const __dirname = path.dirname(path.fromFileUrl(import.meta.url));
                    const storeDir = path.join(__dirname, '../../storeFiles/pb/ceo');
                    const bytes = await Deno.readFile(path.join(`${storeDir}/${formLink}`));
                    return bytes;
                }   
            default:
                return null;
        }
    }
    catch (err) {
        logger.error(`Unable to get pdf file for link: ${formLink} and category: ${category}. Error: ${err}`)
        return null;
      }
}