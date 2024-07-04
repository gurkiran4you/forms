import { model } from "npm:mongoose@^6.7";
import CategorySchema from "../common/category.ts";
import FormSchema from "../common/form.ts";
import NestedGroupSchema from "../common/nestedGroup.ts";

// Export model.
const PbPspcl =  model("PbPspcl", CategorySchema, 'PbPspcl');
const PbPspclForm = model('PbPspclForm', FormSchema);
const PbPspclNestedGroup = model('PbPspclNestedGroup', NestedGroupSchema);

export { PbPspcl, PbPspclForm, PbPspclNestedGroup };