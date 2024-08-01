// deno-lint-ignore-file no-case-declarations
/** @jsxImportSource https://esm.sh/preact */

type DropdownSelectForms = {
    id: string,
    text: string[]
}

export function GenericTextDialogPb(props: DropdownSelectForms) {

    const { id, text } = props;

    const closeDialog = () => {
        const modal = document.querySelector(`#${id}`) as HTMLDialogElement;
        if (!modal) {
            return;
        }
        modal.close();
    }

    return (
        <>
        <dialog id={id} class="w-1/2">
            <div class="sticky top-0 text-right hover:underline cursor-pointer z-10 bg-gradient-to-br from-slate-300">
                <img  onClick={closeDialog} class="w-10 relative left-[95%]" src="/icons/close.svg" alt="My Happy SVG"/>
            </div>
            <div class="flex flex-col px-4 py-8 items-center">
               {
                text.map(t => <p class="mb-3">{t}</p>)
               }
            </div>
        </dialog>
        </>
    );
}

