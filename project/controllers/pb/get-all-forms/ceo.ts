import { Form_m } from "../../../models/common.ts";
import { PbCeo_m } from "../../../models/pb/ceo.ts";
import { PbCeo, PbCeoForm } from "../../../schemas/pb/ceo.ts";

export const getCeoForms = async({response} : {response: any}) => {
    try {
        // fetch all general pb 
        const allForms = await PbCeoForm.find();
        const formGroups = await PbCeo.find();

        const punjabCeoForms: PbCeo_m[] = [];

        for (let i = 0; i < formGroups.length; i++) {
            const formsIds = formGroups[i].forms;
            const forms = allForms.filter(form => formsIds.includes(form.id)) as Form_m[];

            punjabCeoForms.push({
                title: formGroups[i].title ?? '',
                forms,
                nestedGroups: [],
            });
        }

        response.body = {
            punjabCeoForms
        }
        return;
    }
    catch (err) {
        response.body = {
          success: false,
          msg: err.toString(),
        };
        return;
      }
}