import mongoose from "mongoose";
let fixedDeposit = mongoose.Schema(
  {
    orgId: String,
    investor: String,
    investorId: String,
    investorName: String,
    investorMobileNo: String,
    allotmentDate: String,
    entity: String,
    fdDay: String,
    fdIssuer: String,
    fdMonth: String,
    roi: String,
    maturityDate: String,
    commissionInRate: String,
    commissionOutRate: String,
    amount: String,
    fdType: String,
    bank: String,
    refNo: String,
    chequeNo: String,
    remarks: String,
  },
  { timestamps: true }
);
export default mongoose.model("fixedDeposit", fixedDeposit);
