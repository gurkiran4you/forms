import { model, Schema } from "npm:mongoose@^6.7";

// Define schema.
const FormSchema = new Schema({
  name: { type: String },
  link: { type: String },
});

// Validations
// FormSchema.path("name").required(true, "Name of the form cannot be left blank");
// FormSchema.path("link").required(
//   true,
//   "Form link cannot be blank.",
// );

// Export schema.
export default FormSchema;