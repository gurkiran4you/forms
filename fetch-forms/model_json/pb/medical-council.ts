import { FormJson, NestedGroupJson } from '../common.ts';

export type PbMedicalCouncilArr = PbMedicalCouncil[];

export type PbMedicalCouncil = {
    title: string,
    forms: FormJson[],
    nestedGroups: NestedGroupJson[],
}