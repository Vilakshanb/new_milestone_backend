import mongoose from "mongoose";
let crmLead = mongoose.Schema(
  {
    orgId: String,
    leadName: String,

    InvestmentLeadOwner: String,

    mobile: String,

    email: String,

    productType: String,

    panNumber: String,

    followupDate: String,

    leadSource: String,

    referenceName: String,

    referencePhone: String,

    reviewDate: String,
    description: String,
    firstFollowUpDate: String,
    followUpPending: String,
    notes: String,
    leadStage: String,
    followUpNotes: String,
    document: String,
    closeLeadStatus: String,
    followupstage: String,

    followUpArr: [
      {
        followupDate: String,
        followUpNotes: String,
        followupstage: String,
        currentChangeDate: { type: Date, default: Date.now() },
      },
    ],

    status: {
      type: String,
      default: "FRESH",
    },
    displayLeadId: String,
  },
  { timestamps: true }
);
export default mongoose.model("CrmLead", crmLead);
