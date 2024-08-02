import "jsr:@std/dotenv/load";
import { getBucket } from "./get-bucket.ts";

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