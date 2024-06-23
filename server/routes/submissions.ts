import express from "express";
import {
  getSubmissionById,
  addSubmission,
  getSubmissions,
} from "../controllers/submissions";
import { isAuth } from "../middleware/auth";

const router = express.Router();

router.get("/", isAuth, getSubmissions);
router.get("/:id", isAuth, getSubmissionById);
router.post("/", isAuth, addSubmission);

export default router;
