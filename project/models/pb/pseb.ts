import { Form_m } from '../common.ts';

export type PbPseb_m = {
    title: string,
    syllabusUrl: string,
    syllabus:{
        className: string,
        subjects: Form_m[]
    }[]
}