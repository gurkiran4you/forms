import { model } from "npm:mongoose@^6.7";
import { Schema } from "npm:mongoose@^6.7";

// Export model.
const PbTypes =  model("PbTypes", new Schema({
    formType: { type: String },
  }));
export { PbTypes };