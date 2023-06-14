import mongoose from "mongoose";

let onBoardingData = mongoose.Schema(
  {
    orgId: String,
    /**
     * Personal Information
     */
    kycFromPan: { type: Boolean, default: false },
    kycFromPanStatus: { type: String, default: "" },
    kycApiObj: { type: Object },
    username: { type: String, default: "" },
    firstName: { type: String, default: "" },
    middleName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    gender: { type: String, default: "" },
    mobileNumber: { type: String, default: "" },
    DOB: { type: Date },
    email: { type: String, default: "" },
    placeOfBirth: { type: String, default: "" },
    /**
     * FAther details
     */
    fatherName: { type: String, default: "" },
    fatherTitle: { type: String, default: "" },
    /**
     * Mother details
     */
    motherName: { type: String, default: "" },
    motherTitle: { type: String, default: "" },

    /**
     * DL details
     */
    dlNumber: { type: String, default: "" },
    dlIssueDate: { type: Date },

    dlExpiryDate: { type: Date },
    /**
     * Passport details
     */
    passportIssueDate: { type: Date },
    passportExpiryDate: { type: Date },
    passportNumber: { type: String, default: "" },
    /**
     * Aadhaar details
     */
    aadhaarNumber: { type: String, default: "" },
    /**
     * voter details
     */
    voterIdNumber: { type: String, default: "" },
    /**
     * other details
     */
    otherIdNumber: { type: String, default: "" },
    otherIdIssueDate: { type: Date },

    /**
     * marital status
     */
    maritalStatus: { type: String, default: "" },

    /**
     * spouse details
     */
    fatherSpouseName: { type: String, default: "" },
    fatherSpouseTitle: { type: String, default: "" },

    /**
     * Nominee details
     */
    nomineeName: { type: String, default: "" },
    nomineeRelationShip: { type: String, default: "" },
    /**
     * Maiden
     */
    maidenName: { type: String, default: "" },
    maidenTitle: { type: String, default: "" },
    /**
     * Pan Details
     */
    taxStatus: { type: String, default: "" },
    nseTaxStatus: { type: String, default: "" },
    bseTaxStatus: { type: String, default: "" },
    holdingNature: { type: String, default: "" },
    nseHoldingNature: { type: String, default: "" },
    bseHoldingNature: { type: String, default: "" },
    panNumber: { type: String, default: "" },
    panFile: { type: String, default: "" },

    /**
     * Address Details
     */
    selectionOfAddressProof: { type: String, default: "" },
    addressProofFile: { type: String, default: "" },
    addressProofFile2: { type: String, default: "" },
    address: { type: String, default: "" },
    typeOfAdderess: { type: String, default: "" },
    district: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    stateNSE: { type: String, default: "" },
    stateBSE: { type: String, default: "" },
    country: { type: String, default: "" },
    countryNSE: { type: String, default: "" },
    countryBSE: { type: String, default: "" },
    pincode: { type: String, default: "" },

    correspondanceSameAsAddress: { type: Boolean, default: false },

    selectionOfcorrespondenceAddressProof: { type: String, default: "" },
    correspondanceAddressProofFile: { type: String, default: "" },
    correspondanceAddress: { type: String, default: "" },
    correspondanceTypeOfAddress: { type: String, default: "" },
    correspondanceDistrict: { type: String, default: "" },
    correspondanceCity: { type: String, default: "" },
    correspondanceState: { type: String, default: "" },
    correspondanceStateNSE: { type: String, default: "" },
    correspondanceStateBSE: { type: String, default: "" },
    correspondanceCountry: { type: String, default: "" },
    correspondanceCountryNSE: { type: String, default: "" },
    correspondanceCountryBSE: { type: String, default: "" },
    correspondancePincode: { type: String, default: "" },
    /**
     * Bank Details
     */
    bankName: { type: String, default: "" },
    bankAddress: { type: String, default: "" },
    bankMobileNumber: { type: String, default: "" },
    bankAccountHolderName: { type: String, default: "" },
    bankAccountNumber: { type: String, default: "" },
    bankIFSC: { type: String, default: "" },
    bankBranchName: { type: String, default: "" },
    bankBranchPincode: { type: String, default: "" },
    bankCity: { type: String, default: "" },
    bankState: { type: String, default: "" },
    bankFirstHolderName: { type: String, default: "" },
    bankSecondHolderName: { type: String, default: "" },
    bankThirdHolderName: { type: String, default: "" },
    bankAccountType: { type: String, default: "" },
    bankFirstHolderSignatureSameAsNormalSignature: { type: Boolean, default: true },
    bankFirstHolderSignature: { type: String, default: "" },
    bankProofType: { type: String, default: "" },

    mandateAmount: { type: String, default: "" },
    mandateType: { type: String, default: "" },

    // bank account peny transfer
    beneficiaryIfsc: { type: String, default: "" },
    beneficiaryAccountNumber: { type: String, default: "" },
    beneficiaryName: { type: String, default: "" },
    beneficiaryMobile: { type: String, default: "" },

    cancelledCheckFile1: { type: String, default: "" },
    cancelledCheckFile2: { type: String, default: "" },
    /**
     * Facta Form / AdditionalDetails
     */
    nationality: { type: String, default: "" },
    occupation: { type: String, default: "" },
    annualIncome: { type: String, default: "" },
    signzyIncomeCode: { type: String, default: "" },
    sourceOfIncome: { type: String, default: "" },
    stateOfBirth: { type: String, default: "" },
    stateOfBirthCode: { type: String, default: "" },
    cityBirth: { type: String, default: "" },
    countryBirth: { type: String, default: "" },
    politicallyExposed: { type: String, default: "" },
    relatedPoliticallyExposed: { type: String, default: "" },

    countryOfTaxResidence: { type: String, default: "" },
    otherThanIndiaTaxPayerIndentification: { type: String, default: "" },
    otherThanIndiaTaxPayerIndentificationTypeNseCode: { type: String, default: "" },
    otherThanIndiaTaxPayerIndentificationType: { type: String, default: "" },
    taxIdentificationNumber: { type: String, default: "" },
    residentailStatus: { type: String, default: "" },
    occupationDescription: { type: String, default: "" },
    occupationCode: { type: String, default: "" },
    kycAccountCode: { type: String, default: "" },
    kycAccountDescription: { type: String, default: "" },

    communicationAddressCode: { type: String, default: "" },
    communicationAddressType: { type: String, default: "" },

    permanentAddressCode: { type: String, default: "" },
    permanentAddressType: { type: String, default: "" },

    citizenshipCountryCode: { type: String, default: "" },
    CountryCode: { type: String, default: "" },

    citizenshipCountry: { type: String, default: "" },
    citizenshipCountryNseCode: { type: String, default: "" },

    applicationStatusCode: { type: String, default: "" },
    applicationStatusDescription: { type: String, default: "" },
    /**
     * nominee details
     */
    nominee1Name: { type: String, default: "" },
    nominee1Type: { type: String, default: "" },
    nominee1DOB: { type: String, default: "" },
    nominee1Percentage: { type: String, default: "" },
    nominee1Relationship: { type: String, default: "" },
    guardian1Name: { type: String, default: "" },
    guardian1Address: { type: String, default: "" },

    nominee2Name: { type: String, default: "" },
    nominee2Type: { type: String, default: "" },
    nominee2DOB: { type: String, default: "" },
    nominee2Percentage: { type: String, default: "" },
    nominee2Relationship: { type: String, default: "" },
    guardian2Name: { type: String, default: "" },
    guardian2Address: { type: String, default: "" },

    nominee3Name: { type: String, default: "" },
    nominee3Type: { type: String, default: "" },
    nominee3DOB: { type: String, default: "" },
    nominee3Percentage: { type: String, default: "" },
    nominee3Relationship: { type: String, default: "" },
    guardian3Name: { type: String, default: "" },
    guardian3Address: { type: String, default: "" },

    /**
     * Retaed Person Details
     */
    relatedPersonName: { type: String, default: "" },
    relatedPersonMobileNumber: { type: String, default: "" },
    relatedPersonDOB: { type: Date },
    relatedPersonFatherName: { type: String, default: "" },
    relatedPersonKycNumber: { type: String, default: "" },
    relatedPersonKycExist: { type: String, default: "" },
    relatedPersonTitle: { type: String, default: "" },

    /**
     * Video verification file
     *
     */
    videoFile: { type: String },

    /**
     * User photo and signature
     *
     */
    userPhoto: { type: String },
    userSignature: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("onBoardingRawData", onBoardingData);
