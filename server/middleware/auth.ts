import type { NextFunction, Request, Response } from "express";

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res
    .status(401)
    .json({ message: "Login Pleas", error: "Unauthenticated" });
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated() && req.user.role === "ADMIN") {
    return next();
  }
  return res.status(403).json({
    message: "You are not verified to access the resources",
    error: "Unauthorized",
  });
};
