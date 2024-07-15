import { Schema } from "npm:mongoose@^6.7";
import { model } from "npm:mongoose@^6.7";
import FormSchema from "../common/form.ts";

// Define schema.
const PbPsebSchema = new Schema({
  title: { type: String },
  syllabus: [{
    class: { type: String },
    subject: [{
        type: Schema.Types.ObjectId,
        ref: 'Form', 
      }]
    }],
});

// Export model.
const PbPseb =  model("PbPseb", PbPsebSchema, 'PbPseb');
const PbPsebForm =  model("PbPsebForm", FormSchema);

export { PbPseb, PbPsebForm }