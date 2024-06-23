import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { userApi } from "@/store/services/userApi";
import { questionApi } from "@/store/services/questionApi";
import { submissionApi } from "@/store/services/submissionApi";

export const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
    [questionApi.reducerPath]: questionApi.reducer,
    [submissionApi.reducerPath]: submissionApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(userApi.middleware)
      .concat(questionApi.middleware)
      .concat(submissionApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
