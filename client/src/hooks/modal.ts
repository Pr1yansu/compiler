import { create } from "zustand";

type deleteQuestionModalState = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  questionId: string;
  setQuestionId: (id: string) => void;
};

export const useDeleteQuestionModal = create<deleteQuestionModalState>(
  (set) => ({
    isOpen: false,
    questionId: "",
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false }),
    setQuestionId: (id) => set({ questionId: id }),
  })
);

type updateQuestionModalState = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  questionId: string;
  setQuestionId: (id: string) => void;
};

export const useUpdateQuestionModal = create<updateQuestionModalState>(
  (set) => ({
    isOpen: false,
    questionId: "",
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false, questionId: "" }),
    setQuestionId: (id) => set({ questionId: id }),
  })
);

type testCasesModalState = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  currentTestCaseIndex: number;
  setCurrentTestCaseIndex: (index: number) => void;
};

export const useTestCasesModal = create<testCasesModalState>((set) => ({
  isOpen: false,
  currentTestCaseIndex: -1,
  open: () => set({ isOpen: true, currentTestCaseIndex: 0 }),
  close: () => set({ isOpen: false, currentTestCaseIndex: -1 }),
  setCurrentTestCaseIndex: (index) => set({ currentTestCaseIndex: index }),
}));
