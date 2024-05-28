export type User = {
  id: string;
  email: string;
  googleId?: string;
  githubId?: string;
  password?: string;
  image?: string;
  name: string;
  role: "ADMIN" | "USER";
  createdAt: string;
};

export type UserResponse = {
  message: string;
  error?: string;
  userProfile?: User;
};
