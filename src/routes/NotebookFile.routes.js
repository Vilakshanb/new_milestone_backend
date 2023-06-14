import express from "express";

import * as NotebookFile from "../contollers/NotebookFile.controller";
import { authForOrgs, authorizeJwt } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/", authorizeJwt, NotebookFile.createNotebookFile);
router.get("/", authorizeJwt, NotebookFile.getFileByNotebookId);
router.get("/getById/:id", authorizeJwt, NotebookFile.getById);
router.delete("/deleteById/:id", authorizeJwt, NotebookFile.deleteById);
router.patch("/updateById/:id", authorizeJwt, NotebookFile.updateById);
export default router;
