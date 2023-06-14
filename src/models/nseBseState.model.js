import mongoose from "mongoose";

let nseBseState = mongoose.Schema(
  {
    nseStateCode: String,
    nseStateName: String,
    bseStateName: String,
    bseStateCode: String,
    countryCode: String,
  },
  { timestamps: true }
);

export default mongoose.model("nseBseState", nseBseState);
