import { db } from "../lib/db";
import type { Status, Language } from "@prisma/client";
import type { Request, Response } from "express";
import { executeCode } from "../lib/execution";

export const getSubmissions = async (req: Request, res: Response) => {
  try {
    const { user } = req;

    if (!user) {
      return res.status(401).json({
        message: "User not authenticated",
        error: "UserNotAuthenticated",
      });
    }

    const submissions = await db.submission.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        id: "desc",
      },
      include: {
        user: true,
        problem: true,
      },
    });

    return res.status(200).json({
      message: "Submissions fetched successfully",
      submissions,
    });
  } catch (error) {
    console.log("ERROR_GETTING_SUBMISSIONS", error);
    return res.status(500).json({
      message: "Internal server error",
      exception: "ERROR_GETTING_SUBMISSIONS",
      error,
    });
  }
};

export const getSubmissionById = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response
) => {
  try {
    const { id } = req.params;

    const submission = await db.submission.findUnique({
      where: {
        id,
      },
      include: {
        user: true,
        problem: true,
      },
    });

    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    return res.status(200).json({ message: "Submission found", submission });
  } catch (error) {
    console.log("ERROR_GETTING_SUBMISSION_BY_ID", error);
    return res.status(500).json({
      message: "Internal server error",
      exception: "ERROR_GETTING_SUBMISSION_BY_ID",
      error,
    });
  }
};

export const addSubmission = async (
  req: Request<{}, {}, { problemId: string; code: string; language: Language }>,
  res: Response
) => {
  try {
    const { user } = req;
    const { problemId, code, language } = req.body;

    if (!problemId || !code || !language) {
      return res.status(400).json({
        message: "Problem ID, code, and language are required",
        error: "MissingFields",
      });
    }

    const problem = await db.codingProblem.findUnique({
      where: {
        id: problemId,
      },
    });

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    if (!user) {
      return res.status(401).json({
        message: "User not authenticated",
        error: "UserNotAuthenticated",
      });
    }

    const testCases = await db.testCase.findMany({
      where: {
        problemId,
      },
    });

    const executionResults = await executeCode(code, language, testCases);

    let status: Status = "ACCEPTED";
    for (const result of executionResults) {
      if (result.status === "REJECTED") {
        status = "REJECTED";
        break;
      } else if (result.status === "ERROR") {
        req.io.emit("error-code", result.status);
        return res.status(500).json({
          message: "Internal server error",
          exception: "ERROR_EXECUTING_CODE",
          error: result.status,
        });
      }
    }

    const submission = await db.submission.create({
      data: {
        code,
        problemId,
        userId: user.id,
        language,
        status,
      },
    });

    if (!submission) {
      return res.status(500).json({
        message: "Internal server error",
        exception: "ERROR_ADDING_SUBMISSION",
      });
    }

    const allSubmissions = await db.submission.findMany({
      where: {
        userId: user.id,
      },
    });

    await db.statistic.create({
      data: {
        userId: user.id,
        attempted: allSubmissions.length,
        solved: allSubmissions.filter((s) => s.status === "ACCEPTED").length,
        problems: {
          connect: {
            id: problemId,
          },
        },
      },
    });

    return res.status(200).json({
      message: "Submission created successfully",
      submission,
    });
  } catch (error) {
    console.log("ERROR_ADDING_SUBMISSION", error);
    req.io.emit("error-code", error);
    return res.status(500).json({
      message: "Internal server error",
      exception: "ERROR_ADDING_SUBMISSION",
      error,
    });
  }
};

export const updateSubmission = async (
  req: Request<{ id: string }, {}, { code: string; language: Language }>,
  res: Response
) => {
  try {
    const { user } = req;
    const { id } = req.params;

    if (!user) {
      return res.status(401).json({
        message: "User not authenticated",
        error: "UserNotAuthenticated",
      });
    }

    const problem = await db.codingProblem.findUnique({
      where: {
        id,
      },
    });

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    const { code, language } = req.body;

    if (!code || !language) {
      return res.status(400).json({
        message: "Code and language are required",
        error: "MissingFields",
      });
    }

    const testCases = await db.testCase.findMany({
      where: {
        problemId: id,
      },
    });

    const executionResults = await executeCode(code, language, testCases);

    let status: Status = "ACCEPTED";
    for (const result of executionResults) {
      if (result.status === "REJECTED") {
        status = "REJECTED";
        break;
      } else if (result.status === "ERROR") {
        req.io.emit("error-code", result.status);
        return res.status(500).json({
          message: "Internal server error",
          exception: "ERROR_EXECUTING_CODE",
          error: result.status,
        });
      }
    }

    const submission = await db.submission.update({
      where: {
        id,
        userId: user.id,
      },
      data: {
        code,
        language,
        status,
      },
    });

    return res.status(200).json({
      message: "Submission status updated successfully",
      submission,
    });
  } catch (error) {
    console.log("ERROR_UPDATING_SUBMISSION_STATUS", error);
    req.io.emit("error-code", error);
    return res.status(500).json({
      message: "Internal server error",
      exception: "ERROR_UPDATING_SUBMISSION_STATUS",
      error,
    });
  }
};
