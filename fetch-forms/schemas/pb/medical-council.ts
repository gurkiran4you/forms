import { model } from "npm:mongoose@^6.7";
import { Schema } from "npm:mongoose@^6.7";
import FormSchema from "../common/form.ts";

const PbMedicalCouncilForm =  model("PbMedicalCouncilForm", FormSchema);

const PbMedicalCouncil =  model("PbMedicalCouncil", new Schema({
    title: { type: String },
    forms: [{
      type: Schema.Types.ObjectId,
      ref: 'PbMedicalCouncilForm', 
    }],
    nestedGroups: [{
      type: Schema.Types.ObjectId,
      ref: 'NestedGroup'
    }],
  })
  , 'PbMedicalCouncil');

const PbMedicalCouncilNestedForm =  model("PbMedicalCouncilNestedForm", new Schema({
    subCategory: { type: String },
    forms: [{
      type: Schema.Types.ObjectId,
      ref: 'PbMedicalCouncilForm'
    }],
  }));

export { PbMedicalCouncil, PbMedicalCouncilForm, PbMedicalCouncilNestedForm };