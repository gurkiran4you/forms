import { PbGeneral, PbGeneralForm } from "../../../schemas/pb/general.ts";
import { PbGeneral_m } from "../../../models/pb/general.ts";

export const getGeneralForms = async() => {
    try {
        // fetch all general pb 
        const formGroups = await PbGeneral.find();

        const punjabGeneralForms: PbGeneral_m[] = [];

        for (let i = 0; i < formGroups.length; i++) {
            const formsIds = formGroups[i].forms;
            const forms = await PbGeneralForm.find().where('_id').in(formsIds).exec();
            punjabGeneralForms.push({
                title: formGroups[i].title ?? '',
                forms: forms.map(form => ({ id: form.id, name: form.name ?? '', link: form.link ?? '' })),
                nestedGroups: [],
            });
        }
        return punjabGeneralForms;
    }
    catch (err) {
        console.log(err);
        return null;
      }
}