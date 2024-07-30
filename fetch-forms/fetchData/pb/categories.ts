import { PbTypes } from "../../schemas/pb/types.ts";

export type FormTypes = 'general' | 'pspcl' | 'ceo' | 'pseb';

export const initiateCategoriesPb = async() => {
    const formTypes = ['general', 'pspcl', 'medical-council', 'transport', 'pseb', 'ceo'];
    await PbTypes.collection.drop();
    for(const i of formTypes) {
        await PbTypes.create({
            formType: i
        })
    }
}