import { Logger } from "https://deno.land/x/log@v1.1.1/mod.ts";

const fileName = "./logs/errors.text";
const minLevelConsole = 'DEBUG' 
const minLevelFile = 'WARNING' 
const pure = true;
export const logger = await Logger.getInstance(minLevelConsole, minLevelFile, fileName, pure)