/** @jsxImportSource https://esm.sh/preact */

import { JSX } from "preact";
import { Select } from "../components/Select.tsx";
import { FormTypes_m, Form_m, NestedGroup_m } from "../models/common.ts";
import { useState } from "preact/hooks";
import { signal } from "@preact/signals";
import extractExt from "../utils/extensionExtractor.ts";
import { Base64 } from "https://deno.land/x/bb64@1.1.0/mod.ts";

type DropdownSelectForms = {
    formTypes: FormTypes_m,
}

const forms = signal({forms: [], nestedGroupsRes: []} as { forms: Form_m[], nestedGroupsRes: NestedGroup_m[] });
const subCategory = ['Pseb'];
export function DropdownSelectionPb(props: JSX.HTMLAttributes<HTMLSelectElement> & DropdownSelectForms) {
    const [category, setCategory] = useState('');
    const [title, setTitle] = useState('');
    const [subTitle, setSubTitle] = useState('');
    const [subTitleOptions, setSubTitleOptions] = useState([] as string[]);
    const [titleOptions, setTitleOptions] = useState([] as string[]);

    const setCategoryField = async (e: Event) => {
        e.preventDefault();
        // reset the forms 
        forms.value = {
            forms: [],
            nestedGroupsRes: [],
        }
        const element = e.target as HTMLSelectElement;
        setCategory(element.value);

        const response = await fetch('/punjab/api/forms', {
            method: 'POST',
            body: JSON.stringify({category: element.value, dropdown: 'category'})
        });
        const titleOptions = await response.json() as string[];
        setTitleOptions([...titleOptions]);
    }
    const setTitleField = async (e: Event) => {
        e.preventDefault();
        const element = e.target as HTMLSelectElement;
        setTitle(element.value);

        const response = await fetch('/punjab/api/forms', {
            method: 'POST',
            body: JSON.stringify({title: element.value, category, dropdown: 'title'})
        });
        if (subCategory.includes(category)) {
            const subTitleOptions = await response.json() as string[];
            setSubTitleOptions([...subTitleOptions]);
        } else {
            const fetchedForms = await response.json() as { forms: Form_m[], nestedGroupsRes: NestedGroup_m[] };
            forms.value = fetchedForms;
        }
    }
    const setSubTitleField = async (e: Event) => {
        e.preventDefault();
        const element = e.target as HTMLSelectElement;
        setSubTitle(element.value);

        const response = await fetch('/punjab/api/forms', {
            method: 'POST',
            body: JSON.stringify({title: element.value, category, dropdown: 'sub-title'})
        });
        const fetchedForms = await response.json() as { forms: Form_m[], nestedGroupsRes: NestedGroup_m[] };
        forms.value = fetchedForms;
    }

    const openOfflineLink = async (link: string) => {
        const modal = document.querySelector('#offline-form-modal') as HTMLDialogElement;
        if (!modal) {
            return;
        }
        modal.showModal();
        await downloadOfflineLink(link)
    } 
    const downloadOfflineLink = async (link: string) => {
        let normalizedName = '';
        if (category.toLowerCase() === 'ceo') {
            const params = link.split('?')[1];
            const searchParams = new URLSearchParams(params);
            for (const value of searchParams.values()) {
                normalizedName = normalizedName + value + '_';
              }
              normalizedName = normalizedName.substring(0, normalizedName.length - 1);
              normalizedName = normalizedName + '.pdf';
        } else {
            const delimited = link.split('/');
            normalizedName = delimited[delimited.length-1];
        }
        const response = await fetch(`/punjab/api/forms/getOfflineForm/${normalizedName}?${new URLSearchParams({
            category,
        })}`, {
            headers: {
                "Content-Type": `application/pdf,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.wordprocessingml.document,audio/mpeg`
              },
        });
        const aTag = document.querySelector('#download-pdf-a') as HTMLAnchorElement;
        const pdf = await response.blob();
        // const url = window.URL.createObjectURL(new Blob(pdf.payload, { type: 'application/pdf' }));
        // const arr = new Uint8Array(pdf.payload);
        // const blob = new Blob([arr], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(pdf);
        aTag.href = url;

        console.log(pdf);
    } 

    const closeDialog = () => {
        const modal = document.querySelector('#offline-form-modal') as HTMLDialogElement;
        if (!modal) {
            return;
        }
        modal.close();
    }

    const { formTypes } = props as DropdownSelectForms;

    return (
        <>
            <section class="bg-amber-100 flex flex-auto py-2">
                <form class="flex flex-auto grow items-center justify-around">
                    <Select 
                        label="category"
                        width="w-1/3"
                        onChange={setCategoryField} 
                        selectFor="pb_category" 
                        selectedOption={category} 
                        options={formTypes} />
                    <Select 
                        label="title"
                        width="w-full"
                        onChange={setTitleField} 
                        selectFor="pb_title" 
                        selectedOption={title} 
                        options={titleOptions} />
                        {
                            subCategory.includes(category) && (
                            <Select 
                                label="title"
                                width="w-full"
                                onChange={setSubTitleField} 
                                selectFor="pb_sub_title" 
                                selectedOption={subTitle} 
                                options={subTitleOptions} /> )
                        }

                </form>
            </section>
            <section 
                class="flex flex-col px-8 relative min-h-screen min-h-lvh">
                    <div class="bg-wheat bg-no-repeat absolute opacity-10 -z-10
                    w-auto h-auto top-0 bottom-0 left-0 right-0 bg-cover"></div>
                {
                    forms.value.forms.map((form, index) => {
                        const path = extractExt(form.link);

                        // TODO: do this elsewhere
                        return (
                            <div key={form.id} class=" flex justify-between items-center my-2 py-2 relative">
                                <div class="flex">
                                    <p class="text-amber-700">{form.name}</p>
                                </div>
                                <div class="border-b-2 border-amber-700 w-full opacity-10 absolute right-0 bottom-0"></div>
                                {
                                    (form.link.trim() === '') ? (
                                        <p class="text-red-200">This form is not available, please reach out to concerned authority</p>
                                    ) : (
                                        <p class="flex">
                                            <a href={form.link} target="_blank" class="hover:scale-125">
                                                <img src={path} alt="Download form"/>
                                            </a>
                                            <span onClick={() => openOfflineLink(form.link)} class="flex items-center text-xs hover:underline cursor-pointer">
                                                <img class="w-4" src="/icons/question.svg" alt="My Happy SVG"/>
                                                &nbsp;Not Working ?
                                            </span>
                                        </p>
                                    )
                                }

                            </div>
                        )
                    })
                }
                {
                    forms.value.nestedGroupsRes.map((group) => {
                        return (
                            <div key={group.id} class="">
                                <div class="">{group.subCategory}</div>
                                {
                                    group.nestedForms?.map(form => {
                                         const path = extractExt(form.link);
                                        return(
                                        <div key={form.id} class="flex justify-between my-2 ml-2 relative
                                            before:content-[''] before:bg-amber-500 before:absolute before:w-1 before:h-3">
                                            <p class="ml-4 text-amber-700">{form.name}</p>
                                            <div class="border-b-2 border-amber-700 w-full opacity-10 absolute right-0 bottom-0"></div>
                                            <p class="flex">
                                                <a href={form.link} target="_blank" class="hover:scale-125">
                                                    <img src={path} alt="Download form"/>
                                                </a>
                                                <span onClick={() => openOfflineLink(form.link)} class="flex items-center text-xs hover:underline cursor-pointer">
                                                    <img class="w-4" src="/icons/question.svg" alt="My Happy SVG"/>
                                                    &nbsp;Not Working ?
                                                </span>
                                            </p>
                                        </div>
                                        )
                                    })
                                }
                            </div>
                        )
                    })
                }
            </section>

            <dialog id="offline-form-modal">
                <div class="absolute right-2 top-2 hover:underline cursor-pointer" onClick={closeDialog}>X</div>
                <div class="flex flex-col px-4 py-8 items-center">
                    <img src="/icons/warning.svg" alt="warning" class="w-8 pb-8" />
                    <p class="pb-8">You are about to download offline file that has been fetched a week ago, so it may be outdate. Please make sure to check it yourself
                    </p>
                    <a id="download-pdf-a" class="cursor-pointer hover:underline text-blue-300" href={""} target="_blank" download="form.pdf">Download</a>
                </div>
            </dialog>
        </>
    );
}

