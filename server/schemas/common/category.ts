import { Schema } from "npm:mongoose@^6.7";

// Define schema.
const CategorySchema = new Schema({
  title: { type: String },
  forms: [{
    type: Schema.Types.ObjectId,
    ref: 'Form', 
  }],
  nestedGroups: [{
    type: Schema.Types.ObjectId,
    ref: 'NestedGroup'
  }],
});

// Validations
// CategorySchema.path("name").required(true, "Name of the form cannot be left blank");
// CategorySchema.path("link").required(
//   true,
//   "Form link cannot be blank.",
// );

// Export schema.
export default CategorySchema;