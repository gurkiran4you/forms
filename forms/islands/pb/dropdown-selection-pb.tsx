// deno-lint-ignore-file no-case-declarations
/** @jsxImportSource https://esm.sh/preact */

import { Select } from "../../components/Select.tsx";

type DropdownSelectForms = {
    options: {title: string, id: string}[],
    selectedOption: string,
    name: string,
    width: string,
    nextRoute: string,
}

export function DropdownSelectionPb(props: DropdownSelectForms) {


    const { options, selectedOption, name, width, nextRoute} = props as DropdownSelectForms;

    const onSelectChange = (e: Event) => {
        e.preventDefault();

        const element = e.target as HTMLSelectElement;

        const allOptions = element.options;

        let selectedOptionElem = Array.from(allOptions).find(option => !!option.selected);
        if (selectedOptionElem == null) {
            selectedOptionElem = allOptions[0];
        }

        let pathname: string = '';

        if (selectedOptionElem === allOptions[0]) {
            // nothing selected
            // find self and remove until that point
            const currentPath = location.pathname;
            const index = currentPath.indexOf(nextRoute);
            pathname = currentPath.substring(0, index - 1);
            location.pathname = pathname;
        } else {
            // something selected
            // find self and append the id , remove everything beyond self
            const currentPath = location.pathname;
            const index = currentPath.indexOf(nextRoute);
            if (index === -1) {
                // just append
                location.pathname = `${currentPath}/${nextRoute}/${selectedOptionElem.id}`
            } else {
                // already there
                pathname = currentPath.substring(0, index - 1);
                location.pathname = `${pathname}/${nextRoute}/${selectedOptionElem.id}`
            }
        }
    }

    const formClass = `flex flex-auto grow items-center justify-around ${width}`;

    return (
        <>
            <form class={formClass}>
                <Select 
                    label="category"
                    width="w-full"
                    onChange={onSelectChange} 
                    selectFor={name} 
                    selectedOption={selectedOption} 
                    options={options} />
            </form>
        </>
    );
}

