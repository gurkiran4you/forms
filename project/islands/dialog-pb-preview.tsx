// deno-lint-ignore-file no-case-declarations
/** @jsxImportSource https://esm.sh/preact */

type DropdownSelectForms = {
    id: string
}

export function PreviewDialogPb(props: DropdownSelectForms) {

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
            <div class="sticky top-0 text-right hover:underline cursor-pointer z-10 bg-slate-300">
                <img  onClick={closeDialog} class="w-10 relative left-[95%]" src="/icons/close.svg" alt="My Happy SVG"/>
            </div>
            <div id="pdf-canvas-container" class="flex flex-col px-4 py-8 items-center">
            </div>
        </dialog>
        </>
    );
}

