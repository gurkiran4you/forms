import logger from "../../../logs/log.ts";
import { PbCeo } from "../../../schemas/pb/ceo.ts";
import { PbGeneral } from "../../../schemas/pb/general.ts";
import { PbPseb } from "../../../schemas/pb/pseb.ts";
import { PbPspcl } from "../../../schemas/pb/pspcl.ts";

export async function getPbCategoryTitles(category: string) {
    try {
        switch (category) {
            case "general": {
                    const general = await PbGeneral.find();
                    if (general == null) {
                        return;
                    }
                    return general.map(c => ({title: c.title ?? '', id: c.id}))
                }
            case "pspcl": {
                    const general = await PbPspcl.find();
                    if (general == null) {
                        return;
                    }
                    return general.map(c => ({title: c.title ?? '', id: c.id}))
                }
            case "ceo": {
                    const general = await PbCeo.find();
                    if (general == null) {
                        return;
                    }
                    return general.map(c => ({title: c.title ?? '', id: c.id}))
                }
            case "pseb": {
                    const general = await PbPseb.find();
                    if (general == null) {
                        return;
                    }
                    return general.map(c => ({title: c.title ?? '', id: c.id}))
                }
            default:
                return [];
        }
    }
    catch (err) {
        logger.error(`Unable to get dropdown data for ${category} forms. Error: ${err}`)
        return null;
      }
} 