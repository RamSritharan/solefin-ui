import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import apiClient from "../api/client";
import { User } from "../types";

interface AuthState {
  user: User | null;
}

interface AuthPayload {
  user: User;
}

const loadInitialState = (): AuthState => {
  const storedUser = localStorage.getItem("user");
  return {
    user: storedUser ? JSON.parse(storedUser) : null,
  };
};

export const login = createAsyncThunk<
  AuthPayload,
  { email: string; password: string },
  { rejectValue: string }
>("auth/login", async ({ email, password }, { rejectWithValue }) => {
  try {
    const response = await apiClient.post("/auth/login", { email, password });
    const { user } = response.data;
    return { user };
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Login failed");
  }
});

export const register = createAsyncThunk<
  AuthPayload,
  { email: string; password: string; name: string; businessName: string },
  { rejectValue: string }
>(
  "auth/register",
  async ({ email, password, name, businessName }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/auth/register", {
        email,
        password,
        name,
        businessName,
      });
      const { user } = response.data;
      return { user };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed",
      );
    }
  },
);

const persistAuth = (state: AuthState, { user }: AuthPayload) => {
  state.user = user;
  localStorage.setItem("user", JSON.stringify(user));
};

const authSlice = createSlice({
  name: "auth",
  initialState: loadInitialState(),
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action: PayloadAction<AuthPayload>) => {
        persistAuth(state, action.payload);
      })
      .addCase(
        register.fulfilled,
        (state, action: PayloadAction<AuthPayload>) => {
          persistAuth(state, action.payload);
        },
      );
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
