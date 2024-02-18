import { SignupSchema } from "@/lib/validation/signupSchema";

export type signupInputs = Omit<SignupSchema, "confirmPassword">;
export type SignupOutputs = {
  accessToken: string;
  refreshToken: string;
};

export type LoginInputs = {
  username: string;
  password: string;
};
export type LoginOutputs = Pick<SignupOutputs, "accessToken", "refreshToken">;

export type RefreshTokensOutputs = Pick<
  SignupOutputs,
  "accessToken",
  "refreshToken"
>;
