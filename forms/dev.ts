#!/usr/bin/env -S deno run -A --watch=static/,routes/

import dev from "$fresh/dev.ts";
import config from "./fresh.config.ts";
import mongoose from "npm:mongoose@^6.7";

const uri = Deno.env.get('MONGO_URI') as string;
if (uri) {
    await mongoose.connect(uri);
} else {
    await mongoose.connect("mongodb://localhost:27017");
}

await dev(import.meta.url, "./main.ts", config);

Deno.exit();
