import { initiateCategoriesPb } from "./fetchData/pb/categories.ts";
import { initiateCeoPb } from "./fetchData/pb/ceo.ts";
import { initiateGeneralPb } from "./fetchData/pb/general.ts";
import { initiatePsebPb } from "./fetchData/pb/pseb.ts";
import { initiatePspclPb } from "./fetchData/pb/pspcl.ts";
import mongoose from "npm:mongoose@^6.7";

const uri = Deno.env.get('MONGO_URI') as string;
await mongoose.connect(uri);

await initiateGeneralPb();
await initiateCategoriesPb();
await initiatePspclPb();
await initiateCeoPb();
await initiatePsebPb();

Deno.exit();
