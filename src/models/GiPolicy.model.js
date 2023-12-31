import mongoose from "mongoose";
let GiPolicy = mongoose.Schema(
  {
    orgId : String,
    headBy: String,
    status: String,
    Type: String,
    insurerName: String,
    groupHeadName: String,
    mobile: String,
    renewable: String,
    policyNumber: String,
    investorId: String,
    companyName: String,
    insuranceBranch: String,
    SmName: String,
    BaName: String,
    insuranceType: String,
    insuranceSubType: String,
    productName: String,
    hpaName: String,
    hpaBranch: String,
    loginDate: String,
    periodFrom: String,
    periodTo: String,
    longTermPolicy: String,
    addOnDetailsArr: Array,
    OdPremium: String,
    tpPremium: String,
    isTwelvePercentage: String,
    ncb: String,
    discount: String,
    netPremiumAmount: String,
    terrorismPremium: String,
    gst: String,
    finalPremium: String,
    claimProcess: String,
    paymentType: String,
    cashAmount: String,
    totalAmount: String,
    remarks: String,

    vehicleValue: String,
    NonElecAccessories: String,
    electricalAccessories: String,
    kit: String,
    trainerTotalValue: String,
    totalIDV: String,
    model: String,
    make: String,
    color: String,
    registerationNumber: String,
    engineNumber: String,
    chasisNumber: String,
    registerationDate: String,
    seatingCapacity: String,
    cubicCapacity: String,
    fuelType: String,
    mfdMonthYear: String,
    vehicleWeight: String,
    placeOfRegisteration: String,

    proposalFile: String,
    policyFile: String,
  },
  { timestamps: true }
);
export default mongoose.model("GiPolicy", GiPolicy);
