import { FormJson, NestedGroupJson } from '../common.ts';

export type PbPspclArr = PbPspcl[];

export type PbPspcl = {
    title: string,
    forms: FormJson[],
    nestedGroups: NestedGroupJson[],
}