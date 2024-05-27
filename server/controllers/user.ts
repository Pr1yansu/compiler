import { db } from "../lib/db";
import bcrypt from "bcryptjs";
import Cache from "node-cache";
import { sendMail } from "../lib/send-mail";
import { filterUsers } from "../lib/filter";
import type { Response, Request } from "express";

const cache = new Cache();

export const addUser = async (
  req: Request<
    {},
    {},
    {
      email: string;
      name: string;
      image: string;
      password: string;
      role: string;
    }
  >,
  res: Response
) => {
  try {
    const { email, name, image, password, role } = req.body;

    if (!email || !name || !password) {
      return res.status(400).json({
        message: "Please provide all required fields",
        error: "MissingFields",
      });
    }

    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists", error: "UserAlreadyExists" });
    }

    if (!email || !name || !password) {
      return res.status(400).json({
        message: "Please provide all required fields",
        error: "MissingFields",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ message: "Invalid email", error: "InvalidEmail" });
    }

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must contain at least 8 characters, one uppercase letter, one lowercase letter and one number",
        error: "InvalidPassword",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await db.user.create({
      data: {
        email,
        name,
        image,
        password: hashedPassword,
      },
    });

    if (role && role.toUpperCase() === "ADMIN") {
      const currentTime = new Date();
      const expiryDate = new Date(currentTime.getTime() + 60 * 1000);
      const token = await db.adminVerification.create({
        data: {
          user: {
            connect: {
              id: user.id,
            },
          },
          expiresAt: expiryDate,
          token:
            Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15),
        },
      });

      await sendMail(
        process.env.ADMIN_EMAIL!,
        "Admin Verification",
        "Please click on the link below to verify your email",
        `<a href="http://localhost:3000/verify/${token.token}">Verify Email</a>`
      );

      return res.status(201).json({
        message: "User created successfully waiting for verification",
        user,
        error: null,
      });
    }

    return res.status(201).json({
      message: "User created successfully",
      user,
      error: null,
    });
  } catch (error) {
    console.log("ERROR_ADDING_USER", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const verifyAdmin = async (
  req: Request<
    {},
    {},
    {
      token: string;
    }
  >,
  res: Response
) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        message: "Please provide a token",
        error: "MissingToken",
      });
    }

    const currentTime = new Date();
    const adminVerification = await db.adminVerification.findFirst({
      where: {
        token,
        expiresAt: {
          gte: currentTime,
        },
      },
    });

    if (!adminVerification) {
      return res.status(400).json({
        message: "Invalid or expired token",
        error: "InvalidToken",
      });
    }

    await db.user.update({
      where: {
        id: adminVerification.userId,
      },
      data: {
        role: "ADMIN",
      },
    });

    return res.status(200).json({
      message: "User verified successfully",
      error: null,
    });
  } catch (error) {
    console.log("ERROR_VERIFYING_USER", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const resendVerification = async (
  req: Request<
    {},
    {},
    {
      email: string;
    }
  >,
  res: Response
) => {
  try {
    const { email } = req.body;
    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
        error: "UserNotFound",
      });
    }

    if (user.role === "ADMIN") {
      return res.status(400).json({
        message: "User is already an admin",
        error: "UserIsAdmin",
      });
    }

    const adminVerification = await db.adminVerification.findFirst({
      where: {
        userId: user.id,
      },
    });

    const currentTime = new Date();
    const expiryDate = new Date(currentTime.getTime() + 60 * 60 * 1000);

    if (!adminVerification) {
      return res.status(400).json({
        message: "Key not found kindly register again",
        error: "KeyNotFound",
      });
    }

    const token = await db.adminVerification.update({
      where: {
        id: adminVerification.id,
      },
      data: {
        expiresAt: expiryDate,
        token:
          Math.random().toString(36).substring(2, 15) +
          Math.random().toString(36).substring(2, 15),
      },
    });

    await sendMail(
      process.env.ADMIN_EMAIL!,
      "Admin Verification",
      "Please click on the link below to verify your email",
      `<a href="http://localhost:3000/verify/${token.token}">Verify Email</a>`
    );

    return res.status(200).json({
      message: "Verification email sent",
      error: null,
    });
  } catch (error) {
    console.log("ERROR_RESENDING_VERIFICATION", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const getUsers = async (
  req: Request<
    {},
    {},
    {},
    {
      id?: string;
      search?: string;
      page?: number;
      limit?: number;
      sort?: string;
      order?: string;
      createdAt?: string;
    }
  >,
  res: Response
) => {
  try {
    const filters = req.query;

    if (filters) {
      const cachedUsers = cache.get(`users-${JSON.stringify(filters)}`);
      if (cachedUsers) {
        return res.status(200).json({
          message: "Users fetched successfully",
          users: cachedUsers,
          error: null,
        });
      }
    }

    const users = await filterUsers(filters);

    if (!users) {
      return res.status(400).json({
        message: "No users found",
        error: "NoUsersFound",
      });
    }

    if (filters) {
      cache.set(`users-${JSON.stringify(filters)}`, users, 60 * 60);
    } else {
      cache.set("users", users, 60 * 60);
    }

    return res.status(200).json({
      message: "Users fetched successfully",
      users,
      error: null,
    });
  } catch (error) {
    console.log("ERROR_GETTING_USERS", error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
};

export const profile = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(400).json({
        message: "User not found",
        error: "UserNotFound",
      });
    }

    const { id } = user;

    if (cache.has(`user-${id}`)) {
      const userProfile = cache.get(`user-${id}`);
      return res.status(200).json({
        message: "User profile fetched successfully",
        userProfile,
        error: null,
      });
    }

    const userProfile = await db.user.findUnique({
      where: { id },
    });

    cache.set(`user-${id}`, userProfile, 60 * 60);

    return res.status(200).json({
      message: "User profile fetched successfully",
      userProfile,
      error: null,
    });
  } catch (error) {
    console.log("ERROR_GETTING_PROFILE", error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
};
