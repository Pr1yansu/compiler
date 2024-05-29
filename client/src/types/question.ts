export type Question = {
  id: string;
  title: string;
  description: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  tags: string[];
  createdAt: string;
  testCases: TestCase[];
};

export type TestCase = {
  input: string;
  output: string;
};

export type QuestionResponse = {
  message: string;
  problems?: Question[];
};

export type QuestionResponseID = {
  message: string;
  problem?: Question;
};

export type QuestionPostResponse = {
  message: string;
  problem?: Question;
};
