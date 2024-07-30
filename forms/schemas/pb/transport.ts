import { model } from "npm:mongoose@^6.7";
import { Schema } from "npm:mongoose@^6.7";
import FormSchema from "../common/form.ts";

const PbTransportForm =  model("PbTransportForm", FormSchema);

const PbTransport =  model("PbTransport", new Schema({
    title: { type: String },
    forms: [{
      type: Schema.Types.ObjectId,
      ref: 'PbTransportForm', 
    }],
    nestedGroups: [{
      type: Schema.Types.ObjectId,
      ref: 'NestedGroup'
    }],
  })
  , 'PbTransport');

const PbTransportNestedForm =  model("PbTransportNestedForm", new Schema({
    subCategory: { type: String },
    forms: [{
      type: Schema.Types.ObjectId,
      ref: 'PbTransportForm'
    }],
  }));

export { PbTransport, PbTransportForm, PbTransportNestedForm };