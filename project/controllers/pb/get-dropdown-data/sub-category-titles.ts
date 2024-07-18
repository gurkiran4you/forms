import logger from "../../../logs/log.ts";
import { PbPseb, PbPsebSyllabus } from "../../../schemas/pb/pseb.ts";

export async function getPbCategorySubTitles(category: string, id: string) {
    try {
        switch (category) {
            case "pseb": {
                    const pseb = await PbPseb.findById(id);
                    if (pseb == null) {
                        return;
                    }
                    const syllabiIds = pseb.syllabus;
                    const syllabi = await PbPsebSyllabus.find().where('_id').in(syllabiIds).exec();
                    const subTitles = syllabi.map(s => ({title: s.class ?? '', id: s.id}));
                    return subTitles;
                }
            default:
                return null
        }
    }
    catch (err) {
        logger.error(`Unable to get dropdown data for sub-category: ${category} forms. Error: ${err}`)
        return null;
      }
} 