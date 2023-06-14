export const ROLES = {
  SUPERADMIN: "SUPERADMIN",
  ADMIN: "ADMIN",
  SUBADMIN: "SUBADMIN",
  USER: "USER",
  SUBBROKER: "SUBBROKER",
  ORG: "ORG", // the subscription is linked to this account
  // ORG_ADMIN: "ORG_ADMIN",
  // ORG_SUBADMIN: "ORG_SUBADMIN",
  // ORG_USER: "ORG_USER",
  // ORG_SUBBROKER: "ORG_SUBBROKER",
};

export const GENDER = {
  MALE: "MALE",
  FEMALE: "FEMALE",
  OTHER: "OTHER",
};

export const MARITAL_STATUS = {
  MARRIED: "MARRIED",
  UNMARRIED: "UNMARRIED",
  OTHER: "OTHER",
};

export const BANK_ACCOUNT_TYPE = {};

export const NATIONALITY = {};

export const TYPE_OF_ADDRESS = {
  AADHAAR: "aadhaar",
  PASSPORT: "passport",
  DRIVING_LICENCE: "drivingLicence",
  VOTERID: "voterid",
};

export const OCCUPATION = {};

export const POLITICALLY_EXPOSED = {
  NO: "NO",
  PEP: "PEP",
  RPEP: "RPEP",
};

export const INFO_TYPE = {
  COMPANY_NAME: "COMPANY_NAME",
  INSURANCE_BRANCH: "INSURANCE_BRANCH",
  SM_NAME: "SM_NAME",
  BA_NAME: "BA_NAME",
  PRODUCT_NAME: "PRODUCT_NAME",
  MAKE: "MAKE",
  MODEL: "MODEL",
};

export const SUB_VALID_TYPE = {
  DAYS: "DAYS",
  MONTHS: "MONTHS",
};

export const SUBS = {
  ONBOARDING_ALLOWED: "onboardingAllowed",
  CRM_ALLOWED: "crmAllowed",
  FINANCE_ALLOWED: "financeAllowed",
};

export const KYC_STATUS = {
  REGISTERED: "REGISTERED",
  REJECTED: "REJECTED",
  EXPIRE: "EXPIRE",
  NEW: "NEW",
};

export const ADDRESS_TYPES_CODE = [
  {
    code: "01",
    type: "Residential/Business",
  },
  {
    code: "02",
    type: "Residential",
  },
  {
    code: "03",
    type: "Business",
  },
  {
    code: "04",
    type: "Registered office",
  },
  {
    code: "05",
    type: "Unspecified",
  },
];

export const NSE_IDENTIFICATION_TYPES = [
  { code: "A", type: "Passport" },
  { code: "B", type: "Election ID Card" },
  { code: "C", type: "PAN Card" },
  { code: "D", type: "ID Card" },
  { code: "E", type: "Driving License" },
  { code: "G", type: "UIDIA / Aadhar letter" },
  { code: "H", type: "NREGA Job Card" },
  { code: "O", type: "Others" },
  { code: "X", type: "Not categorized" },
  { code: "T", type: "TIN [Tax Payer Identification Number]" },
  { code: "C1", type: "Company Identification Number" },
  { code: "G1", type: "US GIIN" },
  { code: "E1", type: "Global Entity Identification Number" },
];
