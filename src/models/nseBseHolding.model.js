import mongoose from "mongoose";

let nseBseHolding = mongoose.Schema(
  {
    nseHoldingCode: String,
    nseHoldingName: String,
    bseHoldingName: String,
    bseHoldingCode: String,
  },
  { timestamps: true }
);

export default mongoose.model("nseBseHolding", nseBseHolding);
