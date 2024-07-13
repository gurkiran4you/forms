import { PbCeo } from "../../../schemas/pb/ceo.ts";
import { PbGeneral } from "../../../schemas/pb/general.ts";
import { PbPspcl } from "../../../schemas/pb/pspcl.ts";

export async function getPbCategoryTitles(category: string) {
    try {
        switch (category) {
            case "Punjab Gov": {
                    const general = await PbGeneral.find();
                    if (general == null) {
                        return;
                    }
                    return general.map(c => c.title ?? '')
                }
            case "Pspcl": {
                    const general = await PbPspcl.find();
                    if (general == null) {
                        return;
                    }
                    return general.map(c => c.title ?? '')
                }
            case "Ceo": {
                    const general = await PbCeo.find();
                    if (general == null) {
                        return;
                    }
                    return general.map(c => c.title ?? '')
                }
            case "Pseb": {
                    const general = await PbGeneral.find();
                    if (general == null) {
                        return;
                    }
                    return general.map(c => c.title ?? '')
                }
            default:
                break;
        }
    }
    catch (err) {
        console.log(err);
        return null;
      }
} 