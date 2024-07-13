#!/usr/bin/env -S deno run -A --watch=static/,routes/

import dev from "$fresh/dev.ts";
import config from "./fresh.config.ts";

import "$std/dotenv/load.ts";

import mongoose from "npm:mongoose@^6.7";
import { initiateGeneralPb } from "./fetchData/pb/general.ts";
import { initiateCategoriesPb } from "./fetchData/pb/categories.ts";
import { initiateCeoPb } from "./fetchData/pb/ceo.ts";
import { initiatePspclPb } from "./fetchData/pb/pspcl.ts";

await mongoose.connect("mongodb://localhost:27017");

// cron job 
// Deno.cron("Fetching all text and links", "* * * * *", async () => {
// await initiateCategoriesPb();
// await initiateGeneralPb();
// await initiatePspclPb();
// await initiateCeoPb();
// await initiateCategoriesPb();
// await initiatePsebPb();
 // console.log("This will print once a minute.");
// });


await dev(import.meta.url, "./main.ts", config);
