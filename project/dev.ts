#!/usr/bin/env -S deno run -A --watch=static/,routes/

import dev from "$fresh/dev.ts";
import config from "./fresh.config.ts";
import { prettyBenchmarkResult, prettyBenchmarkProgress, prettyBenchmarkDown, prettyBenchmarkHistory } from 'https://deno.land/x/pretty_benching@v0.3.3/mod.ts';
import { Cron } from "https://deno.land/x/croner@8.1.0/dist/croner.js";
import mongoose from "npm:mongoose@^6.7";
import { initiateGeneralPb } from "./fetchData/pb/general.ts";
import { initiateCategoriesPb } from "./fetchData/pb/categories.ts";
import { initiateCeoPb } from "./fetchData/pb/ceo.ts";
import { initiatePspclPb } from "./fetchData/pb/pspcl.ts";
import { runBenchmarks } from "https://deno.land/x/pretty_benching@v0.3.3/deps.ts";
import { bench } from "https://deno.land/std@0.91.0/testing/bench.ts";
import { initiatePsebPb } from "./fetchData/pb/pseb.ts";
import * as path from "jsr:@std/path";
import { exists, existsSync } from "$std/fs/exists.ts";
import logger from "./logs/log.ts";

const isInDeployment = Deno.env.get('DENO_DEPLOYMENT_ID') != null;

if(!isInDeployment) {
    // await mongoose.connect("mongodb://localhost:27017");
}

const __dirname = path.dirname(path.fromFileUrl(import.meta.url));

// create store files folders
const storeFilesFolder = 'storeFiles';
const storePathFound = await exists(path.join(__dirname, storeFilesFolder));
if (!storePathFound) {
    // create 
    await Deno.mkdir(path.join(__dirname, storeFilesFolder));
    const perms = await Deno.permissions.request({ name: 'write', path: path.join(__dirname, storeFilesFolder)});
    if (perms.state === "granted") {
        console.log('granted');
    }
    await Deno.mkdir(path.join(__dirname, storeFilesFolder, 'pb'))
    await Deno.mkdir(path.join(__dirname, storeFilesFolder, 'pb', 'pseb'))
    await Deno.mkdir(path.join(__dirname, storeFilesFolder, 'pb', 'pspcl'))
    await Deno.mkdir(path.join(__dirname, storeFilesFolder, 'pb', 'general'))
    await Deno.mkdir(path.join(__dirname, storeFilesFolder, 'pb', 'ceo'))
}
// cron job 
//new Cron("*/10 * * * * *", () => {
    // await initiateGeneralPb();
    // await initiateCategoriesPb();
    // await initiatePspclPb();
    // await initiateCeoPb();
    // await initiatePsebPb();
// console.log("This will print after 5 seconds");
//});
// bench({
//     name: 'test',
//     func: async (b) => {

//         b.start();
//         await initiateCeoPb();
//         b.stop();
//     }
// })

// await runBenchmarks({ silent: true }, prettyBenchmarkProgress())



await dev(import.meta.url, "./main.ts", config);

Deno.exit();
