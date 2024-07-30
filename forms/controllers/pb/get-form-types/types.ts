import logger from "../../../logs/log.ts";
import { DropdownOption } from "../../../models/common.ts";
import { PbTypes } from "../../../schemas/pb/types.ts";

export const getPbFormTypes = async() => {
    try {
        // fetch all general pb 
        const allFormsTypes = await PbTypes.find();

        const pbFormTypes: DropdownOption[] = [];

        for (let i = 0; i < allFormsTypes.length; i++) {
            const formType = allFormsTypes[i].formType ?? '';
            const id = allFormsTypes[i].id;
            pbFormTypes.push({
                title: formType,
                id,
            });
        }
        return pbFormTypes;
    }
    catch (err) {
        console.log(err);
        logger.error(`Unable to get form types for punjab. Error: ${err}`)
        return null;
      }
}