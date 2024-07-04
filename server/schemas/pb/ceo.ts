import { model } from "npm:mongoose@^6.7";
import CategorySchema from "../common/category.ts";
import FormSchema from "../common/form.ts";
import NestedGroupSchema from "../common/nestedGroup.ts";

// Export model.
const PbCeo =  model("PbCeo", CategorySchema, 'PbCeo');
const PbCeoForm =  model("PbCeoForm", FormSchema);
const PbCeoNestedForm =  model("PbGeneralNestedForm", NestedGroupSchema);
export { PbCeo, PbCeoForm, PbCeoNestedForm };