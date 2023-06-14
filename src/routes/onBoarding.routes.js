import express from "express";
import {
  AesDecryptAnyData,
  AesEncryptAnyData,
  bseOnboardingCreateCustomerRequest,
  generateAndCreateCaptcha,
  getAllOnBoarding,
  getAllOnBoardingClientInfo,
  getCities,
  getCountries,
  getHolding,
  getIncomeCodes,
  getOnBoardingById,
  getStates,
  getTax,
  nseOnboardingCreateCustomerRequest,
  saveOnBoarding,
  signzyGenerateAdhaarEsign,
  signzyGetVideoCode,
  signzyOnboardingRequestCreation,
  uploadBase64File,
  uploadFile,
  verifyKycFromApi,
} from "../contollers/onBoarding.controller";
import { authForOrgs, authorizeJwt } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/multer.middleware";
const router = express.Router();

router.post("/", saveOnBoarding);

router.get("/getAll", authorizeJwt, getAllOnBoarding);

router.get("/getCountry", getCountries);

router.get("/getStates", getStates);

router.get("/getCities", getCities);

router.get("/getTax", getTax);

router.get("/getHolding", getHolding);

router.get("/getIncomeCodes", getIncomeCodes);

router.get("/getBasicClientInfo", getAllOnBoardingClientInfo);

router.get("/getById/:id", getOnBoardingById);

router.patch("/uploadFile/:id", upload.single("file"), uploadFile);

router.patch("/uploadBase64Video/:id", uploadBase64File);

router.get("/generateAndCreateCaptcha/:id", generateAndCreateCaptcha);

router.post(`/signzyOnboardingRequestCreation/:id`, signzyOnboardingRequestCreation);

router.post(`/nseOnboardingRequestCreation/:id`, nseOnboardingCreateCustomerRequest);

router.post(`/bseOnboardingRequestCreation/:id`, bseOnboardingCreateCustomerRequest);

router.post("/AesEncryptAnyData", AesEncryptAnyData);

router.post("/decryptAes", AesDecryptAnyData);

router.post("/verifyKycFromApi", verifyKycFromApi);

router.post("/signzyGenerateAdhaarEsign/:id", signzyGenerateAdhaarEsign);

router.post("/signzyGetVideoCode/:id", signzyGetVideoCode);

export default router;
