import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { User } from "@/types/user";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/v1/user",
    credentials: "include",
  }),
  endpoints: (builder) => ({
    register: builder.mutation<User, Partial<User>>({
      query: (body) => ({
        url: "/register",
        method: "POST",
        body,
      }),
    }),
    login: builder.mutation<User, Partial<User>>({
      query: (body) => ({
        url: "/login",
        method: "POST",
        body,
      }),
    }),
    getUser: builder.query<User, void>({
      query: () => "/profile",
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation, useGetUserQuery } =
  userApi;
