export type FormJson = {
    name: string,
    link: string,
}

export type NestedGroupJson = {
    subCategory: string,
    forms: FormJson[],
}