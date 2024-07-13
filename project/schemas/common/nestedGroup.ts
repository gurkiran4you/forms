import { Schema } from "npm:mongoose@^6.7";

// Define schema.
const NestedGroupSchema = new Schema({
  subCategory: { type: String },
  forms: [{
    type: Schema.Types.ObjectId,
    ref: 'Form'
  }],
});

// Validations
// FormSchema.path("name").required(true, "Name of the form cannot be left blank");
// FormSchema.path("link").required(
//   true,
//   "Form link cannot be blank.",
// );

// Export model.
export default NestedGroupSchema;