import { PbTypes } from "../../schemas/pb/types.ts";

export type FormTypes = 'general' | 'pspcl' | 'ceo' | 'pseb';

export const initiateCategoriesPb = async() => {
    const formTypes = ['general', 'pspcl', 'ceo',  'pseb'];
    await PbTypes.collection.drop();
    for(const i of formTypes) {
        await PbTypes.create({
            formType: i
        })
    }
}