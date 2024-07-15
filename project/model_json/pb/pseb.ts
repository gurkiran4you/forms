import { FormJson } from "../common.ts";

export type PbPsebJson = {
    title: string,
    syllabusUrl: string,
    syllabus:{
        className: string,
        subjects: FormJson[]
    }[]
}