import * as path from "jsr:@std/path";


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
        // switch (category) {
        //     case "Punjab Gov":
        //         {
        //             const forms = await PbGeneralForm.find();
        //             console.log(formLink);
        //             const desiredForm = forms.find(f => {
        //                 const link = f.link ?? '';
        //                 const delimited = link.split('/');
        //                 const fileName = delimited[delimited.length-1];
        //                 return fileName.trim() === formLink.trim();
        //             });
        //             const desiredLink = desiredForm?.link ?? '';

        //             const delimited = desiredLink.split('/');
        //             desiredFormName = delimited[delimited.length-1];
        //             return desiredFormName;
        //         }   
        //     case "Pspcl":
        //         {
        //             const forms = await PbPspclForm.find();
        //             const desiredForm = forms.find(f => {
        //                 const link = f.link ?? '';
        //                 const delimited = link.split('/');
        //                 const fileName = delimited[delimited.length-1];
        //                 return fileName.trim() === formLink.trim();
        //             });
        //             const desiredLink = desiredForm?.link ?? '';

        //             const delimited = desiredLink.split('/');
        //             desiredFormName = delimited[delimited.length-1];
        //             return desiredFormName;
        //         }   
        //     case "ceo":
        //         {
        //             const modifiedLink = ceoFileName.encode(formLink);
        //             const forms = await PbCeoForm.find();
        //             const desiredForm = forms.find(f => {
        //                 const link = f.link ?? '';
        //                 const delimited = link.split('/');
        //                 const fileName = delimited[delimited.length-1];
        //                 return fileName.trim() === modifiedLink.trim();
        //             });
        //             const desiredLink = desiredForm?.link ?? '';

        //             const delimited = desiredLink.split('/');
        //             desiredFormName = delimited[delimited.length-1];
        //             return desiredFormName;
        //         }   
        //     default:
        //         return desiredFormName;
        // }
    }
    catch (err) {
        console.log(err);
        return null;
      }
}