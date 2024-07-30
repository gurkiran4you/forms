import * as path from "jsr:@std/path";
import Logger from "https://deno.land/x/logger@v1.1.6/logger.ts";
const __dirname = path.dirname(path.fromFileUrl(import.meta.url));
const storeDir = path.join(__dirname, 'logs');
const logger = new Logger();
const perms = await Deno.permissions.request({ name: 'write', path: storeDir});
if (perms.state === "granted") {
    console.log('granted');
}
await logger.initFileLogger(storeDir);
logger.disableConsole();

export default logger;