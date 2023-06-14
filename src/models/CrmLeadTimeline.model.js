import mongoose from "mongoose";
let CrmLeadTimeline = mongoose.Schema(
  {
    changedById: String,
    changedByName: String,
    changeStr: String,
    fieldUpdated: String,
    leadId: String,
  },
  { timestamps: true }
);
export default mongoose.model("CrmLeadTimeline", CrmLeadTimeline);
