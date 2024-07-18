import { extname } from "$std/path/posix/mod.ts";

export function extractExt(link: string) {
    const linkArr = link.split('.');
    const ext = linkArr[linkArr.length - 1];
    return ext;
}
export function extractExtIcon(link: string) {
    const linkArr = link.split('.');
    const ext = linkArr[linkArr.length - 1];
    switch (ext) {
        case 'pdf':
            return '/icons/pdf.svg';
        case 'mp3':
            return '/icons/mp3.svg';
        case 'xls':
            return '/icons/xls.svg';
        case 'doc':
        case 'docx':
            return '/icons/word.svg';
        default:
            break;
    }
}