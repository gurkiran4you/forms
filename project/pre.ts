import { initiateCategoriesPb } from "./fetchData/pb/categories.ts";
import { initiateCeoPb } from "./fetchData/pb/ceo.ts";
import { initiateGeneralPb } from "./fetchData/pb/general.ts";
import { initiatePsebPb } from "./fetchData/pb/pseb.ts";
import { initiatePspclPb } from "./fetchData/pb/pspcl.ts";

await initiateGeneralPb();
await initiateCategoriesPb();
await initiatePspclPb();
await initiateCeoPb();
await initiatePsebPb();
