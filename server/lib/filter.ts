import { db } from "./db";
import type { Difficulty } from "@prisma/client";

type query = {
  id?: string;
  search?: string;
  page?: number;
  limit?: number;
  sort?: string;
  order?: string;
  createdAt?: string;
};

type problemQuery = {
  id?: string;
  search?: string;
  difficulty?: Difficulty;
  page?: number;
  limit?: number;
  sort?: string;
  order?: string;
  createdAt?: string;
};

export const filterUsers = async (filters: query) => {
  const { search, id, page, limit, sort, order, createdAt } = filters;

  const users = await db.user.findMany({
    where: {
      id: id ? id : undefined,
      name: search ? { contains: search } : undefined,
      email: search ? { contains: search } : undefined,
    },
    orderBy: {
      [sort || "id"]: order || "asc",
    },
    skip: page ? (page - 1) * (limit || 10) : undefined,
    take: limit || 10,
  });

  return users;
};

export const filterProblems = async (filters: problemQuery) => {
  const { search, id, page, limit, sort, order, difficulty, createdAt } =
    filters;

  const problems = await db.codingProblem.findMany({
    where: {
      id: id,
      title: { contains: search },
      description: { contains: search },
      difficulty: { equals: difficulty },
      createdAt: {
        gte: createdAt,
      },
    },
    orderBy: {
      [sort || "id"]: order || "asc",
    },
    skip: page ? (page - 1) * (limit || 10) : undefined,
    take: limit || 10,
  });

  if (!problems) {
    return [];
  }

  return problems;
};
