import * as path from "jsr:@std/path";
import Logger from "https://deno.land/x/logger@v1.1.6/logger.ts";
const __dirname = path.dirname(path.fromFileUrl(import.meta.url));
const storeDir = path.join(__dirname);
const logger = new Logger();
await logger.initFileLogger(storeDir);
logger.disableConsole();

export default logger;