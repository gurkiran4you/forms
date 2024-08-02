import { retrieveFile } from "../../gcloud/retrieve-file.ts";


export const getOfflineFormPb = async(formLink: string, category: string): Promise<Uint8Array | null> => {
    try {
        let prepend = 'pb/';
        switch (category) {
            case "general":
                {
                    prepend += 'general/';
                    break;
                }   
            case "pspcl":
                {
                    prepend += 'pspcl/';
                    break;
                }   
            case "ceo":
                {
                    prepend += 'ceo/';
                    break;
                }   
            case "transport":
                {
                    prepend += 'transport/';
                    break;
                }   
            case "medical-council":
                {
                    prepend += 'medical-council/';
                    break;
                }   
            case "pseb":
                {
                    prepend += 'pseb/';
                    break;
                }   
            default:
        }
        const file = await retrieveFile(`${prepend}${formLink}`);
        return file;
    }
    catch (err) {
        console.error(`Unable to get pdf file for link: ${formLink} and category: ${category}. Error: ${err}`)
        return null;
      }
}