import logger from "../../../logs/log.ts";
import { PbPseb } from "../../../schemas/pb/pseb.ts";

export async function getPbCategorySubTitles(category: string, title: string) {
    try {
        switch (category) {
            case "Pseb": {
                    const pseb = await PbPseb.findOne({title: title.trim()});
                    if (pseb == null) {
                        return;
                    }
                    const syllabi = pseb.syllabus;

                    return syllabi.map(s => s.class)
                }
            default:
                break;
        }
    }
    catch (err) {
        logger.error(`Unable to get dropdown data for sub-category: ${category} forms. Error: ${err}`)
        return null;
      }
} 