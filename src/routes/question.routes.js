import express from "express";
import { addQuestion, deleteQuestionById, getAllQuestionData, getQuestionById, updateQuestionById } from "../contollers/question.controller";
import { authForOrgs, authorizeJwt } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/", authorizeJwt, addQuestion);

router.get("/", getAllQuestionData);

router.get("/getById/:id", getQuestionById);

router.patch("/updateById/:id", authorizeJwt, updateQuestionById);

router.delete("/deleteById/:id", authorizeJwt, deleteQuestionById);

export default router;
