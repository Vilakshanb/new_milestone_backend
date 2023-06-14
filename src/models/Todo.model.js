import mongoose from "mongoose";
let Todo = mongoose.Schema(
  {
    orgId : String,
    title: String,
    description: String,
    status: String,
    todoDate: String,
    userId: String,
  },
  { timestamps: true }
);
export default mongoose.model("Todo", Todo);
