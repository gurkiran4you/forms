import { Types } from 'npm:mongoose@^6.7';
export type FormTypes = 'general' | 'pspcl' | 'ceo' | 'pseb' | 'transport' | 'medical-council';
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

export type DropdownOption = { title: string | FormTypes, id: string }