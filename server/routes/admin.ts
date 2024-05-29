import express from "express";
import { isAuth, isAdmin } from "../middleware/auth";
import {
  deleteAdmin,
  getUsers,
  removeUser,
  updateAdmin,
} from "../controllers/user";
import {
  addProblem,
  deleteProblem,
  updateProblem,
  updateProblemDifficulty,
  updateProblemTags,
} from "../controllers/problems";

const router = express.Router();

router.get("/all/users", isAuth, isAdmin, getUsers);
router.put("/profile/update", isAuth, isAdmin, updateAdmin);
router.delete("/profile/delete", isAuth, isAdmin, deleteAdmin);
router.delete("/remove/user/:id", isAuth, isAdmin, removeUser);
router.post("/add/coding/problem", isAuth, isAdmin, addProblem);
router.put("/update/problem/:id", isAuth, isAdmin, updateProblem);
router.patch(
  "/update/problem/difficulty/:id",
  isAuth,
  isAdmin,
  updateProblemDifficulty
);
router.patch("/update/problem/tags/:id", isAuth, isAdmin, updateProblemTags);
router.delete("/delete/problem/:id", isAuth, isAdmin, deleteProblem);

export default router;
