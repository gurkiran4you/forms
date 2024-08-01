import {Bucket, Storage} from "npm:@google-cloud/storage";
import * as path from "jsr:@std/path";
import "jsr:@std/dotenv/load";

export const getBucket = (): Bucket => {
    const authJson = Deno.env.get('GCP_CREDENTIALS') || "{}";
    const jsonAuth = JSON.parse(authJson);
    console.log(jsonAuth);
    const gc = new Storage({
        credentials: jsonAuth,
        projectId: jsonAuth.project_id,
    });
    return gc.bucket('forms_and_such');
}

export const retrieveFile = async (fileName: string): Promise<Uint8Array | null> => {
    try {
        const bucket = getBucket();
        const chunks = await bucket.file(fileName).download();
        const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
        const dataToSend = new Uint8Array(totalLength);
        let offset = 0;
        for (const c of chunks) {
            dataToSend.set(c, offset);
            offset += c.length;
        }
        return dataToSend;
        // const readStream = bucket.file(fileName).createReadStream();
        // const chunks: Uint8Array[] = [];
        // readStream.on('readable', () => {
        //     let chunk;
        //     console.log('Stream is readable (new data received in buffer)');
        //     // Use a loop to make sure we read all currently available data
        //     while (null !== (chunk = readStream.read())) {
        //       chunks.push(chunk);
        //     }
        //   });
          
          // 'end' will be triggered once when there is no more data available
        //   readStream.on('end', () => {
        //     const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
        //     const dataToSend = new Uint8Array(totalLength);
        //     let offset = 0;
        //     for (const c of chunks) {
        //         dataToSend.set(c, offset);
        //         offset += c.length;
        //     }
        //     return dataToSend;
        //   });
    } catch (e) {
        console.log(e);
        return null;
    }
}


retrieveFile('pb/ceo/16_En_form.pdf');