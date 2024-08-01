import {Bucket, Storage} from "npm:@google-cloud/storage";
import * as path from "jsr:@std/path";
import "jsr:@std/dotenv/load";


export const getBucket = () => {
    const authJson = Deno.env.get('GCP_CREDENTIALS') || "{}";
    const jsonAuth = JSON.parse(authJson);
    const gc = new Storage({
        credentials: jsonAuth,
        projectId: jsonAuth.project_id,
    });
    return gc.bucket('forms_and_such');
}

export const uploadFile = async (bucket: Bucket, fileName: string, response: Response) => {
    try {
        const file = bucket.file(fileName);
        const blobStream = bucket.file(file.name).createWriteStream();
    
        const reader = response.body?.getReader();
        if (reader == null) {
            return;
        }
        let readResult: ReadableStreamReadResult<Uint8Array>;
        do {
            readResult = await reader?.read();
            if (!readResult?.done) {
                blobStream.write(new Uint8Array(readResult?.value));
            }
        } while (!readResult.done)
    
        blobStream.end();
    } catch (e) {
        console.log(e);
    }
}
