import { Form_m, NestedGroup_m } from "../../../models/common.ts";
import { PbPspcl, PbPspclForm, PbPspclNestedGroup } from "../../../schemas/pb/pspcl.ts";
import { PbPspcl_m } from "../../../models/pb/pspcl.ts";
import logger from "../../../logs/log.ts";

export const getPspclForms = async({response} : {response: any}) => {
    try {
        // fetch all general pb 
        const formGroups = await PbPspcl.find();

        const punjabPspclForms: PbPspcl_m[] = [];

        let nestedGroupsFetched: NestedGroup_m[] = [];
        for (let i = 0; i < formGroups.length; i++) {
            nestedGroupsFetched = [];
            const formsIds = formGroups[i].forms;
            const nestedGroupIds = formGroups[i].nestedGroups;
            const forms = await PbPspclForm.find().where('_id').in(formsIds).exec();
            const nestedGroups = await PbPspclNestedGroup.find().where('_id').in(nestedGroupIds).exec();
            for(let k = 0; k < nestedGroups.length; k++) {
                const formIds = nestedGroups[k].forms;
                const forms = await PbPspclForm.find().where('_id').in(formIds).exec();

                nestedGroupsFetched.push({
                    id: nestedGroups[k].id,
                    subCategory: nestedGroups[k].subCategory ?? '',
                    nestedForms: forms.map(form => ({ id: form.id, name: form.name ?? '', link: form.link ?? '' })),
                })
            }

            punjabPspclForms.push({
                title: formGroups[i].title ?? '',
                forms: forms.map(form => ({id: form.id, name: form.name ?? '', link: form.link ?? ''})),
                nestedGroups: nestedGroupsFetched,
            });
        }

        response.body = {
            punjabPspclForms
        }
        return;
    }
    catch (err) {
        logger.error(`Unable to get all pspcl forms. Error: ${err}`)
        return null;
      }
}