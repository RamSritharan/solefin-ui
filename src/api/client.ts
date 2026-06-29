export const BASE_URL = "http://localhost:3001/api";

export interface ApiResponse<T = any> {
  data: T;
  status: number;
}

class ApiError extends Error {
  response: { status: number; data: any };

  constructor(message: string, status: number, data: any) {
    super(message);
    this.name = "ApiError";
    this.response = { status, data };
  }
}

async function request<T = any>(
  method: string,
  path: string,
  body?: unknown,
): Promise<ApiResponse<T>> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    credentials: "include",
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    throw new ApiError(
      data?.message || response.statusText,
      response.status,
      data,
    );
  }

  return { data, status: response.status };
}

const apiClient = {
  get: <T = any>(path: string) => request<T>("GET", path),
  post: <T = any>(path: string, body?: unknown) =>
    request<T>("POST", path, body),
  put: <T = any>(path: string, body?: unknown) => request<T>("PUT", path, body),
  patch: <T = any>(path: string, body?: unknown) =>
    request<T>("PATCH", path, body),
  delete: <T = any>(path: string) => request<T>("DELETE", path),
};

export default apiClient;
