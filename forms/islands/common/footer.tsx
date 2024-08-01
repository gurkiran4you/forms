// deno-lint-ignore-file no-case-declarations
/** @jsxImportSource https://esm.sh/preact */

import { useState } from "preact/hooks";
import { Select } from "../../components/Select.tsx";
import { GenericTextDialogPb } from "../dialogs/dialog-generic-text.tsx";
import { CONSTANTS } from "../../utils/constants.ts";

type Footer = {
    textDialogID: string,
}

export function Footer(props: Footer) {
    const [ text, setText] = useState(['']);

    const { textDialogID } = props;

    const currentYear = new Date().getFullYear();

    const openModal = (e: Event) => {
        const li = e.target as HTMLLIElement;
        if (li.classList.contains('why-this')) {
            setText(CONSTANTS.whyThis)
        } else {
            setText(CONSTANTS.disclaimer)
        }
        const modal = document.querySelector(`#${textDialogID}`) as HTMLDialogElement;
        if (!modal) {
            return;
        }
        modal.showModal();
    }
    return (
        <>
            <div class="flex justify-between px-5 items-center h-full">
            <div class="w-1/4"></div>
            <div class="w-1/2">
                <ul class="list-none flex justify-center">
                    <li onClick={(e) => openModal(e)} class="why-this text-slate-200  cursor-pointer border-b-2 border-b-transparent hover:border-b-2 hover:border-b-slate-300 transition-all capitalize mr-5">Why this?</li>
                    <li onClick={(e) => openModal(e)} class="disclaimer text-slate-200  cursor-pointer border-b-2 border-b-transparent hover:border-b-2 hover:border-b-slate-300 transition-all capitalize mr-5">Disclaimer</li>
                </ul>
            </div>
            <div class="text-slate-200 text-xs w-1/4 text-end">&copy; {currentYear} G Singh</div>
            </div>

            <GenericTextDialogPb id="generic-text-dialog" text={text} />

        </>
    );
}

