/** @jsxImportSource https://esm.sh/preact */


type ProgressProps = {
    valuePercent: string,
    visibility: string,
}

export function Progress(props: ProgressProps) {

    const { valuePercent, visibility } = props as ProgressProps;

    const className = `mr-4 ${visibility}`

    return (
        <section class={className}>
            <progress class="bg-amber-400" id="file" max="100" value={valuePercent}>{valuePercent} %</progress>
        </section>
    );
}