import mongoose from "mongoose";

let city = mongoose.Schema(
  {
    name: String,
    pincodeArr: [
      {
        pincode: String,
      },
    ],
    nseStateCode: String,
    nseCountryCode: String,
  },
  { timestamps: true }
);

export default mongoose.model("city", city);
