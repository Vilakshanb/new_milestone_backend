import express from "express";
import { getAllAnswerData, submitAnswer } from "../contollers/userAnswer.controller";

const router = express.Router();

router.get("/", getAllAnswerData);

router.post("/submitAnswer", submitAnswer);

export default router;
