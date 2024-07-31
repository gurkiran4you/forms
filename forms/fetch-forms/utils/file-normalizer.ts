function normalizeFilename(filePath: string) {
    const url = new URL(filePath);
    const pathname = url.pathname;
    const lastpath = pathname.split('/')[pathname.split('/').length - 1];
    let decodedLastPath = decodeURI(lastpath);
    decodedLastPath=decodedLastPath.replace(/\s+/g,"_");
    return decodedLastPath;
}

export { normalizeFilename };