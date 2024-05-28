export type Question = {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  answer: string;
  tags: string[];
  createdAt: string;
};

export enum Difficulty {
  EASY,
  MEDIUM,
  HARD,
}

export type QuestionResponse = {
  message: string;
  problems?: Question[];
};
