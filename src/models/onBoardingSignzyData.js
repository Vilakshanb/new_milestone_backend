import mongoose from "mongoose";

let onBoardingSignzyData = mongoose.Schema(
  {
    orgId: String,
    onBoardingDataUserId: mongoose.Types.ObjectId,
    creationObjResponse: Object,

    executePoiResponse: Object,
    updatePoiResponse: Object,

    executePoaResponse: Object,
    updatePoaResponse: Object,

    executeCorrespondenceResponse: Object,
    updateCorrespondenceResponse: Object,
    updateFormForUserForensicsResponse: Object,

    executeCannceledChequeResponse: Object,
    updateCancelledChequeResponse: Object,

    executeBankAccountPennyTransferResponse: Object,
    executeVerifyBankAccountResponse: Object,

    updateFORMSResponse: Object,
    updateFATCAResponse: Object,

    updateUserSignatureResponse: Object,
    updateUserPhotoResponse: Object,

    executeRelatedPersonPOIResponse: Object,
    executeStartVideoResponse: Object,

    executeRecordedVideoResponse: Object,
    executeContractPdf: Object,
    executeAadhaarEsignPdf: Object,

    verificationEngineResponse: Object,
  },
  { timestamps: true }
);

export default mongoose.model("onBoardingSignzyData", onBoardingSignzyData);
