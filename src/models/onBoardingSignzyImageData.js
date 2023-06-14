import mongoose from "mongoose";

let onBoardingSignzyImageData = mongoose.Schema(
  {
    orgId : String,
    onBoardingDataUserId: mongoose.Types.ObjectId,
    poiImageSignzyObj: Object,
    poaImageSignzyObj: Object,
  },
  { timestamps: true }
);

export default mongoose.model("onBoardingSignzyImageData", onBoardingSignzyImageData);
