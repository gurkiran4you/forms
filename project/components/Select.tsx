/** @jsxImportSource https://esm.sh/preact */

import { JSX } from "preact";

type SelectProps = {
    selectFor: string,
    options: string[],
    selectedOption?: string,
    label: string,
    width: string,
}

export function Select(props: JSX.HTMLAttributes<HTMLSelectElement> & SelectProps) {

    const { selectFor, options, selectedOption, label, width } = props as SelectProps;

    const classProperties = `bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
        focus:ring-blue-500 focus:border-blue-500 block w- p-1 dark:bg-gray-700
        dark:border-gray-600 dark:placeholder-gray-400 dark:text-white 
        dark:focus:ring-blue-500 dark:focus:border-blue-500} ${width}`;
    return (
        <div class="w-1/3 flex items-center">
            <label htmlFor={selectFor} class="mr-2 block capitalize text-sm font-medium text-gray-900 dark:text-white">{label}</label>
            <select 
                {...props}
                id={selectFor}
                name={selectFor}
                class={classProperties}>
                <option selected>Choose</option>
                {
                    options.map(option => <option selected={option.toString() === selectedOption?.toString()} class="capitalize">{option}</option>)
                }
            </select>
        </div>
    );
}