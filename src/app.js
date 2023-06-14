import "dotenv/config";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import mongoose from "mongoose";
import { errorHandler } from "./helpers/errorHandler";
import { CONFIG } from "./helpers/config";

import indexRoutes from "./routes/index.routes";
import userRoutes from "./routes/user.routes";
import questionRoutes from "./routes/question.routes";
import userAnswerRoutes from "./routes/userAnswer.routes";
import riskScoreRelationshipRoutes from "./routes/riskScoreRelationship.routes";
import onBoardingRoutes from "./routes/onBoarding.routes";
import ClientRouter from "./routes/Client.routes";
import LeadRouter from "./routes/crmLead.routes";
import TodoRouter from "./routes/Todo.routes";
import FdRouter from "./routes/FixedDeposit.routes";
import GiPolicyRouter from "./routes/GiPolicy.routes";
import GeneralInfoRouter from "./routes/GeneralInfo.routes";
import ReportRouter from "./routes/report.routes";
import SubscriptionRouter from "./routes/subscription.routes";
import SubscriptionOrderRouter from "./routes/subscriptionOrder.routes";
import NotebookRouter from "./routes/Notebook.routes";
import NotebookFileRouter from "./routes/NotebookFile.routes";

import seedData from "./seeder";
import cors from "cors";
import { setUserAndUserObj } from "./middlewares/auth.middleware";
import { setNseBseData } from "./services/nse";

mongoose.connect(CONFIG.MONGOURI, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("connected to db at " + CONFIG.MONGOURI);
    seedData();
    setNseBseData();
  }
});

// mongoose.set("debug", true);

const app = express();

app.use(cors());
app.use(logger("dev"));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(express.json({ limit: "100mb" })); // parses the incoming json requests
app.use(express.urlencoded({ extended: false, limit: "100mb", parameterLimit: 10000000 }));
app.use(cookieParser());
app.use(express.static(path.join(process.cwd(), "public")));
app.use(express.static(path.join(__dirname, "..", "src", "public")));
// console.log(path.join(__dirname, "..", "src", "public"));
app.use(setUserAndUserObj);

app.use("/", indexRoutes);
app.use("/user", userRoutes);
app.use("/question", questionRoutes);
app.use("/useranswer", userAnswerRoutes);
app.use("/riskScoreRelationship", riskScoreRelationshipRoutes);
app.use("/onBoarding", onBoardingRoutes);
app.use("/client", ClientRouter);
app.use("/notebookFile", NotebookFileRouter);
app.use("/lead", LeadRouter);
app.use("/Todo", TodoRouter);
app.use("/FD", FdRouter);
app.use("/GiPolicy", GiPolicyRouter);
app.use("/GeneralInfo", GeneralInfoRouter);
app.use("/report", ReportRouter);
app.use("/subscription", SubscriptionRouter);
app.use("/subscriptionOrder", SubscriptionOrderRouter);

app.use("/notebook", NotebookRouter);
app.use(errorHandler);

export default app;
