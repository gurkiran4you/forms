import { FormJson, NestedGroupJson } from '../common.ts';

export type pbCeoArr = PbCeo[];

export type PbCeo = {
    title: string,
    forms: FormJson[],
    nestedGroups: NestedGroupJson[],
}