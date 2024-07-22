import { model } from "npm:mongoose@^6.7";
import FormSchema from "../common/form.ts";
import { Schema } from "npm:mongoose@^6.7";

const PbCeoForm =  model("PbCeoForm", FormSchema);

const PbCeoNestedForm =  model("PbCeolNestedForm", new Schema({
    subCategory: { type: String },
    forms: [{
      type: Schema.Types.ObjectId,
      ref: 'PbCeoForm'
    }],
  }));

const PbCeo =  model("PbCeo", new Schema({
    title: { type: String },
    forms: [{
      type: Schema.Types.ObjectId,
      ref: 'PbCeoForm', 
    }],
    nestedGroups: [{
      type: Schema.Types.ObjectId,
      ref: 'PbCeoNestedForm'
    }],
  }), 'PbCeo');

export { PbCeo, PbCeoForm, PbCeoNestedForm };