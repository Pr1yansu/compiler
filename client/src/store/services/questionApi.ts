import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Question, QuestionResponse } from "@/types/question";

export const questionApi = createApi({
  reducerPath: "questionApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/v1",
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getQuestions: builder.query<QuestionResponse, void>({
      query: () => "/user/problems",
    }),
    addQuestion: builder.mutation<Question, Partial<Question>>({
      query: (body) => ({
        url: "/admin/add/coding/problem",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useGetQuestionsQuery, useAddQuestionMutation } = questionApi;
