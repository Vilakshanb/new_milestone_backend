import mongoose from "mongoose";

let OnBoardingBseData = mongoose.Schema(
  {
    orgId: String,
    onBoardingDataUserId: mongoose.Types.ObjectId,
    bseReqRes: Object,
    bseId: String,
  },
  { timestamps: true }
);

export default mongoose.model("onBoardingBseData", OnBoardingBseData);
