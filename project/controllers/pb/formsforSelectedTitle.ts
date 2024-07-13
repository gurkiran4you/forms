
import { NestedGroup_m } from "../../models/common.ts";
import { PbCeo, PbCeoForm } from "../../schemas/pb/ceo.ts";
import { PbGeneral, PbGeneralForm } from "../../schemas/pb/general.ts";
import { PbPspcl, PbPspclForm, PbPspclNestedGroup } from "../../schemas/pb/pspcl.ts";

export async function getPbFormsForTitle(category: string, title: string) {
    try {
        switch (category) {
            case "Punjab Gov": {
                    const general = await PbGeneral.find();
                    if (general == null) {
                        return;
                    }
                    const found = general.find(g => g.title === title);
                    if (found == null) {
                        return;
                    }
                    const formIds = found.forms;
                    const forms = await PbGeneralForm.find().where('_id').in(formIds).exec();
                    return {forms, nestedGroupsRes: []};
                }
            case "Pspcl": {
                    const nestedGroupsRes: NestedGroup_m[] = [];
                    const pspcl = await PbPspcl.find();
                    if (pspcl == null) {
                        return;
                    }
                    const found = pspcl.find(g => g.title === title);
                    if (found == null) {
                        return;
                    }
                    const formIds = found.forms;
                    const nestedGroupIds = found.nestedGroups;
                    const forms = await PbPspclForm.find().where('_id').in(formIds).exec();
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

                    return {forms, nestedGroupsRes};
                }
            case "Ceo": {
                    const ceo = await PbCeo.find();
                    if (ceo == null) {
                        return;
                    }
                    const found = ceo.find(g => g.title === title);
                    if (found == null) {
                        return;
                    }
                    const formIds = found.forms;
                    const forms = await PbCeoForm.find().where('_id').in(formIds).exec();
                    return {forms, nestedGroupsRes: []};
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