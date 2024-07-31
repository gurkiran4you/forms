import { initiateCategoriesPb } from "./fetchData/pb/categories.ts";
import { initiateCeoPb } from "./fetchData/pb/ceo.ts";
import { initiateGeneralPb } from "./fetchData/pb/general.ts";
import { intitiateMedicalCouncilPb } from "./fetchData/pb/MedicalCouncil.ts";
import { initiatePsebPb } from "./fetchData/pb/pseb.ts";
import { initiatePspclPb } from "./fetchData/pb/pspcl.ts";
import { intitiateTransportPb } from "./fetchData/pb/transport.ts";
import mongoose from "npm:mongoose@^6.7";
import "jsr:@std/dotenv/load";


const uri = Deno.env.get('MONGO_URI') as string;
await mongoose.connect(uri);


await initiateCategoriesPb();
await initiateGeneralPb();
await initiatePspclPb();
await initiateCeoPb();
await initiatePsebPb();
await intitiateTransportPb();
await intitiateMedicalCouncilPb();

Deno.exit();
