export interface Submission {
  problemId: string;
  code: string;
  language: string;
}

export interface SubmissionResponse {
  message: string;
  submission?: Submission;
}
