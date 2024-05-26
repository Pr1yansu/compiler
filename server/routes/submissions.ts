import express from "express";
import {
  getSubmissionById,
  addSubmission,
  getSubmissions,
  updateSubmission,
} from "../controllers/submissions";
import { isAuth } from "../middleware/auth";

const router = express.Router();

router.get("/", isAuth, getSubmissions);
router.get("/:id", isAuth, getSubmissionById);
router.post("/", isAuth, addSubmission);
router.put("/:id", isAuth, updateSubmission);

export default router;
