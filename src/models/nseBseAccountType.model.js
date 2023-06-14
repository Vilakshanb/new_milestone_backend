import mongoose from "mongoose";

let nseBseTaxStatus = mongoose.Schema(
  {
    nseTaxCode: String,
    nseTaxName: String,
    bseTaxName: String,
    bseTaxCode: String,
  },
  { timestamps: true }
);

export default mongoose.model("nseBseTaxStatus", nseBseTaxStatus);
