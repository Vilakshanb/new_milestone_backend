import mongoose from "mongoose";
let userFcmTokens = mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    tokenId: String,
  },
  { timestamps: true }
);
export default mongoose.model("UserFcmTokens", userFcmTokens);
