// deno-lint-ignore-file no-case-declarations
/** @jsxImportSource https://esm.sh/preact */

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
            <div class="sticky top-0 text-right hover:underline cursor-pointer bg-gradient-to-br from-slate-300">
            <img  onClick={closeDialog} class="w-10 relative left-[95%]" src="/icons/close.svg" alt="My Happy SVG"/>
            </div>
            <div class="flex flex-col px-4 py-8 items-center">
                <img src="/icons/warning.svg" alt="warning" class="w-8 pb-8" />
                <p class="pb-8">You are about to download offline file that has been fetched a week ago, so it may be outdated. Please make sure to check it yourself
                </p>
                <a id="download-pdf-a" class="cursor-pointer hover:underline text-blue-300" href={""} target="_blank">Download</a>
            </div>
        </dialog>
        </>
    );
}

