import {Bucket, Storage} from "npm:@google-cloud/storage";
import * as path from "jsr:@std/path";
import "jsr:@std/dotenv/load";


export const getBucket = () => {
    const authJson = Deno.env.get('gcloud_storage_auth_file');
    const projectId = Deno.env.get('gcloud_project_id');
    const __dirname = path.dirname(path.fromFileUrl(import.meta.url));
    console.log(authJson, projectId);
    const gc = new Storage({
        keyFilename: path.join(__dirname, `../${authJson}`),
        projectId,
    });
    
    return gc.bucket('bucket-forms_files-forms_and_such');
}

export const uploadFile = async (bucket: Bucket, fileName: string, response: Response) => {
    try {
        const file = bucket.file(fileName);
        const blobStream = bucket.file(file.name).createWriteStream();
    
        const reader = response.body?.getReader();
        if (reader == null) {
            return;
        }
        let readResult: ReadableStreamDefaultReadResult<Uint8Array>;
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
