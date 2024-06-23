import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { SubmissionResponse, Submission } from "@/types/submission";

export const submissionApi = createApi({
  reducerPath: "submissionApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/v1/submissions",
    credentials: "include",
  }),
  endpoints: (builder) => ({
    addSubmission: builder.mutation<SubmissionResponse, Submission>({
      query: (data) => ({
        url: "/",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useAddSubmissionMutation } = submissionApi;
