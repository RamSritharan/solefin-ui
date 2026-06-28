import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  login as loginThunk,
  register as registerThunk,
  logout as logoutAction,
} from "../store/authSlice";
import { User } from "../types";

interface UseAuthResult {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    name: string,
    businessName: string,
  ) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

export const useAuth = (): UseAuthResult => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const login = useCallback(
    async (email: string, password: string) => {
      const result = await dispatch(loginThunk({ email, password }));
      if (loginThunk.rejected.match(result)) {
        throw new Error(result.payload || "Login failed");
      }
    },
    [dispatch],
  );

  const register = useCallback(
    async (
      email: string,
      password: string,
      name: string,
      businessName: string,
    ) => {
      const result = await dispatch(
        registerThunk({ email, password, name, businessName }),
      );
      if (registerThunk.rejected.match(result)) {
        throw new Error(result.payload || "Registration failed");
      }
    },
    [dispatch],
  );

  const logout = useCallback(() => {
    dispatch(logoutAction());
  }, [dispatch]);

  return {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };
};
