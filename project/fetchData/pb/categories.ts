import { PbTypes } from "../../schemas/pb/types.ts";

export const initiateCategoriesPb = async() => {
    const formTypes = ['Punjab Gov', 'Pspcl', 'Ceo',  'Pseb'];
    await PbTypes.collection.drop();
    for(const i of formTypes) {
        await PbTypes.create({
            formType: i
        })
    }
}