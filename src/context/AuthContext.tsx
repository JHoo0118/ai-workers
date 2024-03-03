"use client";
import { ACCESS_TOKEN, USER } from "@/const/const";
import { deleteTokens } from "@/lib/utils/auth";
import { LoginSchema } from "@/lib/validation/loginSchema";
import { SignupSchema } from "@/lib/validation/signupSchema";
import {
  login as loginService,
  logout as logoutService,
  signup as signupService,
} from "@/service/auth/auth";
import { getMe } from "@/service/user/user";
import { LoginOutputs, SignupOutputs } from "@/types/auth-types";
import { SimpleUser, UserModel } from "@/types/user-types";
import { hasCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "react-hot-toast";

interface AuthContextType {
  user?: UserModel;
  signup: (signupSchemaInputs: SignupSchema) => Promise<void>;
  login: (loginSchemaInputs: LoginSchema, forwardUrl?: string) => Promise<void>;
  logout: () => Promise<void>;
  renewalUser: (user: UserModel) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<UserModel | undefined>(undefined);
  const router = useRouter();

  const getUser = useCallback(async () => {
    console.log(hasCookie(ACCESS_TOKEN));
    if (hasCookie(ACCESS_TOKEN)) {
      const user = await getMe();

      if (!user) {
        return;
      }
      renewalUser(user);
    }
  }, []);

  useEffect(() => {
    if (localStorage.getItem(USER) === null) {
      getUser();
    } else {
      setUser(JSON.parse(localStorage.getItem(USER)!));
    }

    if (!hasCookie(ACCESS_TOKEN)) {
      deleteTokens();
    }
  }, [getUser]);

  const renewalUser = (user: UserModel) => {
    setUser(user);

    const simpleUser: SimpleUser = {
      email: user.email,
      username: user.username,
    };

    localStorage.setItem(USER, JSON.stringify(simpleUser));
  };

  const signup = async (signupSchemaInputs: SignupSchema) => {
    await toast.promise(signupService(signupSchemaInputs), {
      loading: "처리 중...",
      success: (data: SignupOutputs) => {
        return <b>회원가입이 완료되었습니다.</b>;
      },
      error: (error) => <b>{error}</b>,
    });
    router.replace("/");
    await getUser();
  };

  const login = async (loginSchemaInputs: LoginSchema, forwardurl?: string) => {
    await toast.promise(loginService(loginSchemaInputs), {
      loading: "처리 중...",
      success: (data: LoginOutputs) => {
        return <b>로그인에 성공하였습니다.</b>;
      },
      error: (error) => <b>{error || "로그인에 실패하였습니다."}</b>,
    });
    router.replace(forwardurl ?? "/");
    await getUser();
  };

  const logout = useCallback(async () => {
    await toast.promise(logoutService(), {
      loading: "처리 중...",
      success: (data: boolean) => {
        return <b>로그아웃 되었습니다.</b>;
      },
      error: (error) => <b>{error}</b>,
    });
    deleteTokens();
    setUser(undefined);
    router.replace("/");
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        signup,
        login,
        logout,
        renewalUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
