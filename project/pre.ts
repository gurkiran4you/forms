import { initiateCategoriesPb } from "./fetchData/pb/categories.ts";
import { initiateCeoPb } from "./fetchData/pb/ceo.ts";
import { initiateGeneralPb } from "./fetchData/pb/general.ts";
import { initiatePsebPb } from "./fetchData/pb/pseb.ts";
import { initiatePspclPb } from "./fetchData/pb/pspcl.ts";
import { Cron } from "https://deno.land/x/croner@8.1.0/dist/croner.js";
import { exists } from "$std/fs/exists.ts";
import * as path from "jsr:@std/path";


import mongoose from "npm:mongoose@^6.7";

// cron job 
new Cron("* * * * *", () => {
    console.log("This will print after every 1 minute");
});

// create store files folders
const storeFilesFolder = 'storeFiles';

const __dirname = path.dirname(path.fromFileUrl(import.meta.url));
const storePathFound = await exists(path.join(__dirname, storeFilesFolder));
if (!storePathFound) {
    // create 
    await Deno.mkdir(path.join(__dirname, storeFilesFolder));
    await Deno.mkdir(path.join(__dirname, storeFilesFolder, 'pb'))
    await Deno.mkdir(path.join(__dirname, storeFilesFolder, 'pb', 'pseb'))
    await Deno.mkdir(path.join(__dirname, storeFilesFolder, 'pb', 'pspcl'))
    await Deno.mkdir(path.join(__dirname, storeFilesFolder, 'pb', 'general'))
    await Deno.mkdir(path.join(__dirname, storeFilesFolder, 'pb', 'ceo'))
}


const uri = Deno.env.get('MONGO_URI') as string;
await mongoose.connect(uri);

await initiateGeneralPb();
await initiateCategoriesPb();
await initiatePspclPb();
await initiateCeoPb();
await initiatePsebPb();

Deno.exit();
