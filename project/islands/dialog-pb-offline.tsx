// deno-lint-ignore-file no-case-declarations
/** @jsxImportSource https://esm.sh/preact */

import { JSX } from "preact";
import { Select } from "../components/Select.tsx";

type DropdownSelectForms = {
    id: string
}

export function OfflineFormDialogPb(props: DropdownSelectForms) {

    const { id } = props;

    const closeDialog = () => {
        const modal = document.querySelector(`#${id}`) as HTMLDialogElement;
        if (!modal) {
            return;
        }
        modal.close();
    }

    return (
        <>
        <dialog id={id}>
            <div class="absolute right-2 top-2 hover:underline cursor-pointer" onClick={closeDialog}>X</div>
            <div class="flex flex-col px-4 py-8 items-center">
                <img src="/icons/warning.svg" alt="warning" class="w-8 pb-8" />
                <p class="pb-8">You are about to download offline file that has been fetched a week ago, so it may be outdate. Please make sure to check it yourself
                </p>
                <a id="download-pdf-a" class="cursor-pointer hover:underline text-blue-300" href={""} target="_blank">Download</a>
            </div>
        </dialog>
        </>
    );
}

