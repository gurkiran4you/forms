import { FormJson, NestedGroupJson } from '../common.ts';

export type PbGeneralArr = PbGeneral[];

export type PbGeneral = {
    title: string,
    forms: FormJson[],
    nestedGroups: NestedGroupJson[],
}