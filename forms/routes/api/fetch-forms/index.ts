import { Handlers } from "$fresh/server.ts";
import mongoose from "npm:mongoose@^6.7";
import "jsr:@std/dotenv/load";
import { initiateCategoriesPb } from "../../../fetch-forms/fetchData/pb/categories.ts";
import { initiateCeoPb } from "../../../fetch-forms/fetchData/pb/ceo.ts";
import { initiateGeneralPb } from "../../../fetch-forms/fetchData/pb/general.ts";
import { intitiateMedicalCouncilPb } from "../../../fetch-forms/fetchData/pb/MedicalCouncil.ts";
import { initiatePsebPb } from "../../../fetch-forms/fetchData/pb/pseb.ts";
import { initiatePspclPb } from "../../../fetch-forms/fetchData/pb/pspcl.ts";
import { intitiateTransportPb } from "../../../fetch-forms/fetchData/pb/transport.ts";

export const handler: Handlers = {
    async POST(req, _ctx) {
        const body = await req.json();
        const { secret } = body;
        if (secret === 'secret') {
            const uri = Deno.env.get('MONGO_URI') as string;
            await mongoose.connect(uri);

            await initiateCategoriesPb();
            await initiateGeneralPb();
            await initiatePspclPb();
            await initiateCeoPb();
            await initiatePsebPb();
            await intitiateTransportPb();
            await intitiateMedicalCouncilPb();
            return new Response('Hello');
        }
        return new Response('nope');
    }
}