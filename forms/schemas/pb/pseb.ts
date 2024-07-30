import { Schema } from "npm:mongoose@^6.7";
import { model } from "npm:mongoose@^6.7";
import FormSchema from "../common/form.ts";

const PbPsebForm =  model("PbPsebForm", FormSchema);

const PbPsebSyllabusSchema = new Schema({
  class: { type: String },
  subject: [{
      type: Schema.Types.ObjectId,
      ref: 'PbPsebForm',
    }]
});
const PbPsebSyllabus =  model("PbPsebSyllabus", PbPsebSyllabusSchema, 'PbPsebSyllabi');

const PbPsebSchema = new Schema({
  title: { type: String },
  syllabus: [{
        type: Schema.Types.ObjectId,
        ref: 'PbPsebSyllabus', 
    }],
});
const PbPseb =  model("PbPseb", PbPsebSchema, 'PbPseb');



export { PbPseb, PbPsebForm, PbPsebSyllabus }