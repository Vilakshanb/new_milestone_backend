import mongoose from "mongoose";

let OnBoardingNseData = mongoose.Schema(
  {
    orgId: String,
    onBoardingDataUserId: mongoose.Types.ObjectId,
    nseReqRes: Object,
    iin: String,
    factaReqRes: Object,
  },
  { timestamps: true }
);

export default mongoose.model("onBoardingNseData", OnBoardingNseData);
