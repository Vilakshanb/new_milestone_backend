import mongoose from "mongoose";
let NotebookFolder = mongoose.Schema(
  {
    name: String,
    userId: String,
    orgId: String,
  },
  { timestamps: true }
);
export default mongoose.model("NotebookFolder", NotebookFolder);
