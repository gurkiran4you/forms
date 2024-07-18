
import logger from "../../../logs/log.ts";
import { NestedGroup_m } from "../../../models/common.ts";
import { PbCeo, PbCeoForm } from "../../../schemas/pb/ceo.ts";
import { PbGeneral, PbGeneralForm } from "../../../schemas/pb/general.ts";
import { PbPspcl, PbPspclForm, PbPspclNestedGroup } from "../../../schemas/pb/pspcl.ts";

export async function getPbFormsForTitle(category: string, id: string) {
    try {
        switch (category) {
            case "general": {
                    const general = await PbGeneral.findById(id);
                    if (general == null) {
                        return;
                    }
                    const formIds = general.forms;
                    const forms = await PbGeneralForm.find().where('_id').in(formIds).exec() ?? [];
                    const formsRes = forms.map(form => ({ id: form.id, name: form.name ?? '', link: form.link ?? '' }));
                    return {formsRes, nestedGroupsRes: []};
                }
            case "pspcl": {
                    const nestedGroupsRes: NestedGroup_m[] = [];
                    const pspcl = await PbPspcl.findById(id);
                    if (pspcl == null) {
                        return;
                    }
                    const formIds = pspcl.forms;
                    const nestedGroupIds = pspcl.nestedGroups;
                    const forms = await PbPspclForm.find().where('_id').in(formIds).exec() ?? [];
                    const formsRes = forms.map(form => ({ id: form.id, name: form.name ?? '', link: form.link ?? '' }));
                    if (nestedGroupIds && nestedGroupIds.length > 0) {
                        const nestedGroups =  await PbPspclNestedGroup.find().where('_id').in(nestedGroupIds).exec();
                        for(let i = 0; i < nestedGroups.length; i++) {
                            const title = nestedGroups[i].subCategory ?? '';
                            const formIds = nestedGroups[i].forms;
                            const nestedForms = await PbPspclForm.find().where('_id').in(formIds).exec();
                            nestedGroupsRes.push({
                                 id: nestedGroups[i].id,
                                 subCategory: title,
                                 nestedForms: nestedForms.map(form => ({ id: form.id, name: form.name ?? '', link: form.link ?? '' })),
                            })
                        }
                    }

                    return {formsRes, nestedGroupsRes};
                }
            case "ceo": {
                    const ceo = await PbCeo.findById(id);
                    if (ceo == null) {
                        return;
                    }
                    const formIds = ceo.forms;
                    const forms = await PbCeoForm.find().where('_id').in(formIds).exec();
                    const formsRes = forms.map(form => ({ id: form.id, name: form.name ?? '', link: form.link ?? '' }));
                    return {formsRes, nestedGroupsRes: []};
                }
            case "pseb": {
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
        logger.error(`Unable to get form for selected category: ${category} and title id: ${id}. Error: ${err}`)
        return null;
      }
} 