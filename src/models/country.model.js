import mongoose from "mongoose";

let country = mongoose.Schema(
  {
    nseCountryName: String,
    bseCountryName: String,
    nseCountryCode: String, // ??
    bseCountryCode: String, // ??
  },
  { timestamps: true }
);

export default mongoose.model("country", country);
