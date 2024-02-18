export type UserModel = {
  email: string;
  username: string;
  password: string;
  disabled: boolean;
  createdAt: string;
  updatedAt: string;
  refreshToken?: string;
};

export type GetMeOutputs = UserModel;

export type SimpleUser = Pick<UserModel, "email" | "username">;
