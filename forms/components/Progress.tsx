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
            {
                valuePercent === '0' && <progress id="file">{valuePercent} %</progress>
            }
            {
                valuePercent !== '0' && <progress id="file" max="100" value={valuePercent}>{valuePercent} %</progress>
            }
        </section>
    );
}