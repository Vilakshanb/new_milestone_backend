import express from "express";

import * as lead from "../contollers/crmLead.controller";
import { authForOrgs, authorizeJwt } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/multer.middleware";
import { SUBS } from "../helpers/constant";

const router = express.Router();

router.post("/", authForOrgs([SUBS.CRM_ALLOWED]), lead.createLead);
router.get("/", authForOrgs([SUBS.CRM_ALLOWED]), lead.getLead);
router.get("/getById/:id", authForOrgs([SUBS.CRM_ALLOWED]), lead.getById);
router.post("/uploadFile/:id", authForOrgs([SUBS.CRM_ALLOWED]), upload.single("file"), lead.uploadFile);
router.delete("/deleteById/:id", authForOrgs([SUBS.CRM_ALLOWED]), lead.deleteLeadById);
router.post("/updateLeadFollowUp/:id", authForOrgs([SUBS.CRM_ALLOWED]), authorizeJwt, lead.updateLeadFollowUp);
router.get("/getTimelinesByLeadId/:id", authorizeJwt, authForOrgs([SUBS.CRM_ALLOWED]), lead.getTimeLines);
router.post("/followUpArrElRemove/:id", authorizeJwt, authForOrgs([SUBS.CRM_ALLOWED]), lead.followUpArrElRemove);

router.post("/followUpArrElUpdate/:id", authorizeJwt, authForOrgs([SUBS.CRM_ALLOWED]), lead.followUpArrElUpdate);

export default router;
