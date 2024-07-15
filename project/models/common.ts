import { Types } from 'npm:mongoose@^6.7';

export type FormTypes_m = string[];

export type Form_m = {
    id?: Types.ObjectId,
    name: string,
    link: string,
}

export type NestedGroup_m = {
    id: Types.ObjectId
    subCategory: string,
    forms?: Types.ObjectId[],
    nestedForms?: Form_m[],
}