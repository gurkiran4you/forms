import { Router } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { getGeneralForms } from "../../controllers/pb/general.ts";
import { getCeoForms } from "../../controllers/pb/ceo.ts";
import { getPspclForms } from "../../controllers/pb/pspcl.ts";

const router = new Router();

router
    .get('/pb/general', getGeneralForms)
    .get('/pb/ceo', getCeoForms)
    .get('/pb/pspcl', getPspclForms)

export default router;