import express from "express";
import { isAuth } from "../middleware/auth";
import {
  addUser,
  profile,
  resendVerification,
  verifyAdmin,
} from "../controllers/user";
import passport from "../lib/passport";
import type { Request, Response } from "express";
import { getProblems, getProblemById } from "../controllers/problems";

const router = express.Router();

router.post("/register", addUser);
router.post("/verify-admin", verifyAdmin);
router.post("/resend-token", resendVerification);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_URL}/login`,
  }),
  (req: Request, res: Response) => {
    res.redirect(process.env.FRONTEND_URL!);
  }
);

router.get(
  "/github",
  passport.authenticate("github", { scope: ["email", "profile"] })
);

router.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: `${process.env.FRONTEND_URL}/login`,
  }),
  (req: Request, res: Response) => {
    res.redirect(process.env.FRONTEND_URL!);
  }
);

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: `${process.env.FRONTEND_URL}/login`,
  }),
  (req: Request, res: Response) => {
    return res.redirect(process.env.FRONTEND_URL!);
  }
);

router.get("/profile", isAuth, profile);
router.get("/problem/:id", isAuth, getProblemById);
router.get("/problems", isAuth, getProblems);

router.get("/logout", (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) {
      return res
        .status(400)
        .json({ message: "Failed to logout", error: "LogoutFailed" });
    }
  });
  res.redirect(process.env.FRONTEND_URL!);
});

export default router;
