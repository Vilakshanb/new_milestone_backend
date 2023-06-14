import mongoose from "mongoose";
let NotebookFile = mongoose.Schema(
  {
    notebookFolderId: String,
    name: String,
    message: String,
  },
  { timestamps: true }
);
export default mongoose.model("NotebookFile", NotebookFile);
