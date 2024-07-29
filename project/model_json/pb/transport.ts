import { FormJson, NestedGroupJson } from '../common.ts';

export type PbTransportArr = PbTransport[];

export type PbTransport = {
    title: string,
    forms: FormJson[],
    nestedGroups: NestedGroupJson[],
}