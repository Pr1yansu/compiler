import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  Question,
  QuestionPostResponse,
  QuestionResponse,
  QuestionResponseID,
} from "@/types/question";

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
    getQuestionById: builder.query<QuestionResponseID, string>({
      query: (id) => ({
        url: `/user/problem/${id}`,
      }),
    }),
    addQuestion: builder.mutation<QuestionPostResponse, Partial<Question>>({
      query: ({
        TestCase,
        createdAt,
        description,
        difficulty,
        tags,
        title,
      }) => ({
        url: "/admin/add/coding/problem",
        method: "POST",
        body: {
          testCases: TestCase,
          createdAt,
          description,
          difficulty,
          tags,
          title,
        },
      }),
    }),
    updateQuestion: builder.mutation<QuestionPostResponse, Partial<Question>>({
      query: ({
        TestCase,
        createdAt,
        description,
        difficulty,
        tags,
        title,
        id,
      }) => ({
        url: `/admin/update/problem/${id}`,
        method: "PUT",
        body: {
          testCases: TestCase,
          createdAt,
          description,
          difficulty,
          tags,
          title,
        },
      }),
    }),
    deleteQuestion: builder.mutation<QuestionPostResponse, string>({
      query: (id) => ({
        url: `/admin/delete/problem/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetQuestionsQuery,
  useAddQuestionMutation,
  useGetQuestionByIdQuery,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation,
} = questionApi;
