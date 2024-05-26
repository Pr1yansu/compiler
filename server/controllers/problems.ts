import { db } from "../lib/db";
import Cache from "node-cache";
import { filterProblems } from "../lib/filter";
import type { Difficulty } from "@prisma/client";
import type { Request, Response } from "express";
import type { codingProblem } from "@prisma/client";

const cache = new Cache({
  stdTTL: 600,
  checkperiod: 120,
  useClones: false,
});

export const addProblem = async (
  req: Request<{}, {}, codingProblem>,
  res: Response
) => {
  try {
    const { answer, description, difficulty, title, tags } = req.body;

    if (!answer || !description || !difficulty || !title || !tags) {
      return res.status(400).json({
        message: "Please provide all required fields",
        error: "MissingFields",
      });
    }

    const problem = await db.codingProblem.create({
      data: {
        answer,
        description,
        difficulty,
        title,
        tags,
      },
    });

    return res.status(201).json({ message: "Problem added", problem });
  } catch (error) {
    console.log("ERROR_ADDING_PROBLEM", error);
    return res.status(500).json({
      message: "Internal server error",
      exception: "ERROR_ADDING_PROBLEM",
      error,
    });
  }
};

export const updateProblem = async (
  req: Request<{ id: string }, {}, codingProblem>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { answer, description, difficulty, title, tags } = req.body;

    const existingProblem = await db.codingProblem.findUnique({
      where: {
        id: id,
      },
    });

    if (!existingProblem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    const problem = await db.codingProblem.update({
      where: {
        id: id,
      },
      data: {
        answer: answer || existingProblem.answer,
        description: description || existingProblem.description,
        difficulty: difficulty || existingProblem.difficulty,
        title: title || existingProblem.title,
        tags: tags || existingProblem.tags,
      },
    });

    return res.status(200).json({ message: "Problem updated", problem });
  } catch (error) {
    console.log("ERROR_UPDATING_PROBLEM", error);
    return res.status(500).json({
      message: "Internal server error",
      exception: "ERROR_UPDATING_PROBLEM",
      error,
    });
  }
};

export const deleteProblem = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response
) => {
  try {
    const { id } = req.params;

    await db.codingProblem.delete({
      where: {
        id: id,
      },
    });

    return res.status(200).json({ message: "Problem deleted" });
  } catch (error) {
    console.log("ERROR_DELETING_PROBLEM", error);
    return res.status(500).json({
      message: "Internal server error",
      exception: "ERROR_DELETING_PROBLEM",
      error,
    });
  }
};

export const getProblems = async (req: Request<{}, {}, {}>, res: Response) => {
  try {
    const filters = req.query;
    if (cache.has("problems")) {
      const problems = cache.get("problems");
      return res.status(200).json({
        message: "Problems found",
        problems,
      });
    }
    const problems = await filterProblems(filters);
    if (problems.length <= 0) {
      return res.status(404).json({ message: "No problems found" });
    }
    cache.set("problems", problems);
    return res.status(200).json({
      message: "Problems found",
      problems,
    });
  } catch (error) {
    console.log("ERROR_GETTING_PROBLEM", error);
    return res.status(500).json({
      message: "Internal server error",
      exception: "ERROR_GETTING_PROBLEM",
      error,
    });
  }
};

export const getProblemById = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const problem = await db.codingProblem.findUnique({
      where: {
        id: id,
      },
    });
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }
    return res.status(200).json({ message: "Problem found", problem });
  } catch (error) {
    console.log("ERROR_GETTING_PROBLEM_BY_ID", error);
    return res.status(500).json({
      message: "Internal server error",
      exception: "ERROR_GETTING_PROBLEM_BY_ID",
      error,
    });
  }
};

export const updateProblemDifficulty = async (
  req: Request<
    {
      id: string;
    },
    {},
    {
      difficulty: Difficulty;
    }
  >,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { difficulty } = req.body;

    if (!difficulty) {
      return res.status(400).json({
        message: "Please provide difficulty",
        error: "MissingFields",
      });
    }

    const problem = await db.codingProblem.update({
      where: {
        id: id,
      },
      data: {
        difficulty,
      },
    });

    return res
      .status(200)
      .json({ message: "Problem difficulty updated", problem });
  } catch (error) {
    console.log("ERROR_UPDATING_PROBLEM_DIFFICULTY", error);
  }
};

export const updateProblemTags = async (
  req: Request<
    {
      id: string;
    },
    {},
    {
      tags: string[];
    }
  >,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { tags } = req.body;

    if (!tags) {
      return res.status(400).json({
        message: "Please provide tags",
        error: "MissingFields",
      });
    }

    const problem = await db.codingProblem.update({
      where: {
        id: id,
      },
      data: {
        tags,
      },
    });

    return res.status(200).json({ message: "Problem tags updated", problem });
  } catch (error) {
    console.log("ERROR_UPDATING_PROBLEM_TAGS", error);
  }
};

export const updateProblemAnswer = async (
  req: Request<
    {
      id: string;
    },
    {},
    {
      answer: string;
    }
  >,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { answer } = req.body;

    if (!answer) {
      return res.status(400).json({
        message: "Please provide answer",
        error: "MissingFields",
      });
    }

    const problem = await db.codingProblem.update({
      where: {
        id: id,
      },
      data: {
        answer,
      },
    });

    return res.status(200).json({ message: "Problem answer updated", problem });
  } catch (error) {
    console.log("ERROR_UPDATING_PROBLEM_ANSWER", error);
  }
};
