import {Bucket} from "npm:@google-cloud/storage";
import "jsr:@std/dotenv/load";

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
