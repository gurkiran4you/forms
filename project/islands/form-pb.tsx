/** @jsxImportSource https://esm.sh/preact */

import { Form_m } from "../models/common.ts";
import { extractExt, extractExtIcon } from "../utils/extensionExtractor.ts";
import { normalizeFilename } from "../utils/file-normalizer.ts";

type DropdownSelectForms = {
    form: Form_m,
    category: string,
    dialogID: string,
    nested?: boolean,
}

export function PunjabForm(props: DropdownSelectForms) {
    const { form, category, dialogID, nested = false } = props as DropdownSelectForms;

    const iconPath = extractExtIcon(form.link);
    const ext = extractExt(form.link);

    const openOfflineLink = async (link: string) => {
        const modal = document.querySelector(`#${dialogID}`) as HTMLDialogElement;
        if (!modal) {
            return;
        }
        modal.showModal();
        await downloadOfflineLink(link)
    } 
    const downloadOfflineLink = async (link: string) => {
        console.log(link);
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
            normalizedName = normalizeFilename(link);
        }
        const response = await fetch(`/punjab/api/forms/getOfflineForm/${normalizedName}?${new URLSearchParams({
            category,
        })}`, {
            headers: {
                "Content-Type": `application/pdf,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.wordprocessingml.document,audio/mpeg`
              },
        });
        const aTag = document.querySelector(`#${dialogID} #download-pdf-a`) as HTMLAnchorElement;
        const pdf = await response.blob();
        const url = window.URL.createObjectURL(pdf);
        aTag.download = normalizedName;
        aTag.href = url;
    } 

    let formClass = `flex justify-between items-center my-2 py-2 relative`;
    if (nested) {
        formClass += ` ml-8 before:content-[''] before:bg-amber-500 before:absolute 
        before:-left-4 before:w-1 before:h-5`;
    }

    return (
        <>
            <div key={form.id} class={formClass}>
                <div class="flex">
                    <p class="text-amber-700">{form.name}</p>
                </div>
                <div class="border-b-2 border-amber-700 w-full opacity-10 absolute right-0 bottom-0"></div>
                {
                    (form.link.trim() === '') ? (
                        <p class="text-red-200">This form is not available, please reach out to concerned authority</p>
                    ) : (
                        <p class="flex">
                            {
                                ext === 'mp3' && (
                                    <audio controls>
                                    <source src={form.link} type="audio/ogg" />
                                    <source src={form.link} type="audio/mpeg" />
                                    Your browser does not support the audio element.
                                </audio>
                                )
                            }

                            <a href={form.link} target="_blank" class="hover:scale-125">
                                <img src={iconPath} alt="Download form"/>
                            </a>
                            <span onClick={() => openOfflineLink(form.link)} class="flex items-center text-xs hover:underline cursor-pointer">
                                <img class="w-4" src="/icons/question.svg" alt="My Happy SVG"/>
                                &nbsp;Not Working ?
                            </span>
                        </p>
                    )
                }

            </div>
        </>
    );
}

