import express from "express";
import { BaReport, clientBasicInformationGet, getAddonMasters, getAgentDataList, getAllInsuranceBranch, getBirthDays, getUserRiskTypeAnswers, hpaMaster, makeMaster, modelMaster, OdTpPremiumReport, policyDownload, policyPurchased } from "../contollers/report.controller";

const router = express.Router();

router.get("/clientBasicInformationGet", clientBasicInformationGet)
router.get("/getAllInsuranceBranch", getAllInsuranceBranch)
router.get("/getAddonMasters", getAddonMasters)
router.get("/getUserRiskTypeAnswers", getUserRiskTypeAnswers)
router.get("/hpaMaster", hpaMaster)
router.get("/makeMaster", makeMaster)
router.get("/modelMaster", modelMaster)
router.get("/getPolicyPurchased", policyPurchased)
router.get("/OdTpPremiumReport", OdTpPremiumReport)
router.get("/BaReport", BaReport)

router.get("/getAgentDataList", getAgentDataList)
router.get("/getBirthDays", getBirthDays)
router.get("/policyDownload", policyDownload)

export default router;
