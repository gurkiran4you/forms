import { model } from "npm:mongoose@^6.7";
import { Schema } from "npm:mongoose@^6.7";
import FormSchema from "../common/form.ts";

const PbPspclForm = model('PbPspclForm', FormSchema);

const PbPspclNestedGroup = model('PbPspclNestedGroup', new Schema({
    subCategory: { type: String },
    forms: [{
      type: Schema.Types.ObjectId,
      ref: 'PbPspclForm'
    }],
  }));


const PbPspcl =  model("PbPspcl", new Schema({
    title: { type: String },
    forms: [{
      type: Schema.Types.ObjectId,
      ref: 'PbPspclForm', 
    }],
    nestedGroups: [{
      type: Schema.Types.ObjectId,
      ref: 'PbPspclNestedGroup'
    }],
  }), 'PbPspcl');


export { PbPspcl, PbPspclForm, PbPspclNestedGroup };