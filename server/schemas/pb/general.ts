import { model } from "npm:mongoose@^6.7";
import CategorySchema from "../common/category.ts";
import FormSchema from "../common/form.ts";
import NestedGroupSchema from "../common/nestedGroup.ts";

// Export model.
const PbGeneral =  model("PbGeneral", CategorySchema, 'PbGeneral');
const PbGeneralForm =  model("PbGeneralForm", FormSchema);
const PbGeneralNestedForm =  model("PbGeneralNestedForm", NestedGroupSchema);
export { PbGeneral, PbGeneralForm, PbGeneralNestedForm };