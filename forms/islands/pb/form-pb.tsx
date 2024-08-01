/** @jsxImportSource https://esm.sh/preact */

import { BytesList } from "https://deno.land/std@0.152.0/bytes/bytes_list.ts";
import { getOfflineFormPb } from "../../controllers/pb/get-offline-form.ts";
import { Form_m } from "../../models/common.ts";
import { extractExt, extractExtIcon } from "../../utils/extensionExtractor.ts";
import { normalizeFilename } from "../../utils/file-normalizer.ts";
import * as pdfjsLib from "npm:pdfjs-dist"
import { Progress } from "../../components/Progress.tsx";
import { useState } from 'preact/hooks';

type DropdownSelectForms = {
    form: Form_m,
    category: string,
    categoryTitle?: string,
    dialogID: string,
    previewDialogID?: string,
    nested?: boolean,
}

export function PunjabForm(props: DropdownSelectForms) {

    const [progressValue, setProgressValue] = useState('0');
    const [progressVisibility, setprogressVisibility] = useState('invisible');

    const { form, category, dialogID, nested = false, previewDialogID, categoryTitle = '' } = props as DropdownSelectForms;

    const iconPath = extractExtIcon(form.link);
    let ext = extractExt(form.link);
    if (categoryTitle === 'ceo') {
        ext = 'pdf';
    }

    const openPreviewLink = async (link: string, e: Event) => {
        const self = e.target as HTMLSpanElement;
        self.classList.add('pointer-events-none');
        const modal = document.querySelector(`#${previewDialogID}`) as HTMLDialogElement;
        if (!modal) {
            return;
        }
        setprogressVisibility('block');

        try {
            const { pdf, normalizedName } = await getOfflineFormPb(link);
            const url = window.URL.createObjectURL(pdf);


            pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.mjs`;

            const loadingTask = await pdfjsLib.getDocument(url);
            const pdfDoc = await loadingTask.promise;

            const totalNumberOfPages = pdfDoc.numPages;

            // remove all previous canvases 
            const previewDialog =  document.querySelector(`#${previewDialogID} #pdf-canvas-container`) as HTMLDivElement;
            previewDialog.innerHTML = '';
            for(let i = 1; i <= totalNumberOfPages; i++) {
                const progress = Math.floor((i/totalNumberOfPages) * 100);
                setProgressValue(progress.toString());
                await handlePdfPages(i, pdfDoc)
            }
        } catch(e) {
            console.log('Failed to create pdf preview, Error: ', e);
            setProgressValue('0');
            setprogressVisibility('hidden');
            self.classList.remove('pointer-events-none');
            return;
        }
        self.classList.remove('pointer-events-none');
        setProgressValue('0');
        setprogressVisibility('hidden');
        modal.showModal();
    } 

    const handlePdfPages = async(pageNumber: number, pdfDoc: any) => {
        const page = await pdfDoc.getPage(pageNumber);
  
        const scale = 1.5;
        const viewport = page.getViewport({scale: scale});
  
        // Prepare canvas using PDF page dimensions
        const canvas = document.createElement( "canvas" );
        const context = canvas.getContext('2d');
        if (context == null) {
            return;
        }
        canvas.height = viewport.height;
        canvas.width = viewport.width;
  
        // Render PDF page into canvas context
        const renderContext = {
          canvasContext: context,
          viewport: viewport
        };
        const renderTask = page.render(renderContext);
        await renderTask.promise;

        // find dialog id and append canvas
        const dialog = document.querySelector(`#${previewDialogID}`) as HTMLDialogElement;
        if (dialog == null) {
            return;
        }
        const previewDialog =  dialog.querySelector(`#pdf-canvas-container`) as HTMLDivElement;

        previewDialog.appendChild(canvas);
    }

    const openOfflineLink = async (link: string) => {
        const modal = document.querySelector(`#${dialogID}`) as HTMLDialogElement;
        if (!modal) {
            return;
        }
        modal.showModal();
        await downloadOfflineLink(link)
    } 
    const downloadOfflineLink = async (link: string) => {
        const { pdf, normalizedName } = await getOfflineFormPb(link);
        const aTag = document.querySelector(`#${dialogID} #download-pdf-a`) as HTMLAnchorElement;

        const url = window.URL.createObjectURL(pdf);
        aTag.download = normalizedName;
        aTag.href = url;
    } 

    const getOfflineFormPb =  async(link: string) => {
        let normalizedName = '';
        if (categoryTitle.toLowerCase() === 'ceo') {
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

        const pdf = await response.blob();
        return { pdf, normalizedName};
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
                        <p class="flex items-center">
                            {
                                ext === 'mp3' && (
                                    <audio controls>
                                    <source src={form.link} type="audio/ogg" />
                                    <source src={form.link} type="audio/mpeg" />
                                    Your browser does not support the audio element.
                                </audio>
                                )
                            }
                            {
                                ext === 'pdf' && (
                                    <>
                                        <Progress valuePercent={progressValue} visibility={progressVisibility} />
                                        <span class="mr-2 cursor-pointer hover:scale-125 transition-all">
                                            <img  onClick={(e) => openPreviewLink(form.link, e)} title="preview" class="w-full" src="/icons/preview.svg" alt="My Happy SVG"/>
                                        </span>
                                    </>
                                )
                            }

                            <a href={form.link} target="_blank" class="mr-2 hover:scale-125 transition-all">
                                <img title="Download" src={iconPath} alt="Download form"/>
                            </a>
                            <span 
                                title="Download offline form" 
                                onClick={() => openOfflineLink(form.link)} 
                                class="flex items-center text-xs hover:underline cursor-pointer">
                                <img  class="w-3" src="/icons/question.svg" alt="My Happy SVG"/>
                                &nbsp;Not Working ?
                            </span>
                        </p>
                    )
                }
            </div>
        </>
    );
}

