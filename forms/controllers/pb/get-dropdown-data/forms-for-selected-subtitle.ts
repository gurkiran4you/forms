import { PbPsebForm, PbPsebSyllabus } from "../../../schemas/pb/pseb.ts";


export async function getPbFormsForSubTitle(category: string, subtitleId: string) {
    try {
        switch (category) {
            case "pseb": {
                    const syllabus = await PbPsebSyllabus.findById(subtitleId);
                    if (syllabus == null) {
                        return null;
                    }
                    const formIds = syllabus.subject;
                    if (formIds == null) {
                        return null;
                    }
                    const forms = await PbPsebForm.find().where('_id').in(formIds).exec();

                    return forms.map(f => ({id: f.id, name: f.name ?? '', link: f.link ?? ''}));
                }
            default:
                return null;
        }
    }
    catch (err) {
        console.log(err);
        console.error(`Unable to get form for selected category: ${category} and title: ${subtitleId}. Error: ${err}`)
        return null;
      }
} 