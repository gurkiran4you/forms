import { Schema } from "npm:mongoose@^6.7";
import { model } from "npm:mongoose@^6.7";
import FormSchema from "../common/form.ts";

// Define schema.
const PbPsebSchema = new Schema({
  title: { type: String },
  syllabus: [{
        type: Schema.Types.ObjectId,
        ref: 'Syllabus', 
    }],
});
const PbPsebSyllabusSchema = new Schema({
    class: { type: String },
    subject: [{
        type: Schema.Types.ObjectId,
        ref: 'Form',
      }]
});

// Export model.
const PbPseb =  model("PbPseb", PbPsebSchema, 'PbPseb');
const PbPsebSyllabus =  model("PbPsebSyllabus", PbPsebSyllabusSchema, 'PbPsebSyllabi');
const PbPsebForm =  model("PbPsebForm", FormSchema);

export { PbPseb, PbPsebForm, PbPsebSyllabus }