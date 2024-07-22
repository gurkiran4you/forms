import { model } from "npm:mongoose@^6.7";
import { Schema } from "npm:mongoose@^6.7";
import FormSchema from "../common/form.ts";

const PbGeneralForm =  model("PbGeneralForm", FormSchema);

const PbGeneral =  model("PbGeneral", new Schema({
    title: { type: String },
    forms: [{
      type: Schema.Types.ObjectId,
      ref: 'PbGeneralForm', 
    }],
    nestedGroups: [{
      type: Schema.Types.ObjectId,
      ref: 'NestedGroup'
    }],
  })
  , 'PbGeneral');

const PbGeneralNestedForm =  model("PbGeneralNestedForm", new Schema({
    subCategory: { type: String },
    forms: [{
      type: Schema.Types.ObjectId,
      ref: 'PbGeneralForm'
    }],
  }));

export { PbGeneral, PbGeneralForm, PbGeneralNestedForm };