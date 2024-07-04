import { Application } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
import mongoose from "npm:mongoose@^6.7";
import { initiateGeneralPb } from "./fetchData/pb/general.ts";
import { initiatePspclPb } from "./fetchData/pb/pspcl.ts";
import { initiateCeoPb } from "./fetchData/pb/ceo.ts";
import * as path from "jsr:@std/path";
import router from "./routes/pb/routes.ts";

await mongoose.connect("mongodb://localhost:27017");


// cron job 
// Deno.cron("Fetching all text and links", "* * * * *", async () => {

//    await initiateGeneralPb();
//    await initiatePspclPb();
//    await initiateCeoPb();
    // console.log("This will print once a minute.");
// });



const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());
app.use(oakCors());

const PORT = 3000;

// Logger
app.use(async (ctx: { response: { headers: { get: (arg0: string) => any; }; }; request: { method: any; url: any; }; }, next: () => any) => {
    await next();
    const rt = ctx.response.headers.get("X-Response-Time");
    console.log(`${ctx.request.method} ${ctx.request.url} - ${rt}`);
});
  
// Timing
app.use(async (ctx: { response: { headers: { set: (arg0: string, arg1: string) => void; }; }; }, next: () => any) => {
const start = Date.now();
await next();
const ms = Date.now() - start;
ctx.response.headers.set("X-Response-Time", `${ms}ms`);
});

console.log(`server is listening on port: ${PORT}`);
app.use((ctx) => {
    const __dirname = path.dirname(path.fromFileUrl(import.meta.url));
    const filePath = path.join(__dirname, './storeFormsData/pb/pspclPb.json');
    const contents = Deno.readTextFileSync(filePath);
    ctx.response.body = contents;
});

await app.listen({port: PORT});
