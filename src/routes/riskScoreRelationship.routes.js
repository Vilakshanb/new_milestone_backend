import express from "express";
import { getRiskScoreData, updateRiskScoreData } from "../contollers/riskScoreRelationship.controller";
const router = express.Router();

router.get("/", getRiskScoreData);

router.patch("/update", updateRiskScoreData);

export default router;
