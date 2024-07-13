import { model } from "npm:mongoose@^6.7";
import FormTypeSchema from "../common/formTypes.ts";

// Export model.
const PbTypes =  model("PbTypes", FormTypeSchema);
export { PbTypes };