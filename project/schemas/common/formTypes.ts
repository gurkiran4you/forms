import { Schema } from "npm:mongoose@^6.7";

// Define schema.
const FormTypeSchema = new Schema({
  formType: { type: String },
});

// Validations
// CategorySchema.path("name").required(true, "Name of the form cannot be left blank");
// CategorySchema.path("link").required(
//   true,
//   "Form link cannot be blank.",
// );

// Export schema.
export default FormTypeSchema;