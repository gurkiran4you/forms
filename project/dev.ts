#!/usr/bin/env -S deno run -A --watch=static/,routes/

import dev from "$fresh/dev.ts";
import config from "./fresh.config.ts";
import { prettyBenchmarkResult, prettyBenchmarkProgress, prettyBenchmarkDown, prettyBenchmarkHistory } from 'https://deno.land/x/pretty_benching@v0.3.3/mod.ts';
import mongoose from "npm:mongoose@^6.7";
import { initiateGeneralPb } from "./fetchData/pb/general.ts";
import { initiateCategoriesPb } from "./fetchData/pb/categories.ts";
import { initiateCeoPb } from "./fetchData/pb/ceo.ts";
import { initiatePspclPb } from "./fetchData/pb/pspcl.ts";
import { runBenchmarks } from "https://deno.land/x/pretty_benching@v0.3.3/deps.ts";
import { bench } from "https://deno.land/std@0.91.0/testing/bench.ts";
import { initiatePsebPb } from "./fetchData/pb/pseb.ts";
import logger from "./logs/log.ts";



// await mongoose.connect("mongodb://localhost:27017");

const __dirname = path.dirname(path.fromFileUrl(import.meta.url));

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
