import { authClient } from "@/lib/auth-client";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

export async function apiRequest(path, options = {}) {
  const {
    requiresAuth = false,
    ...fetchOptions
  } = options;

  const headers = new Headers(fetchOptions.headers);

  if (
    fetchOptions.body &&
    !(fetchOptions.body instanceof FormData)
  ) {
    headers.set("Content-Type", "application/json");
  }

  if (requiresAuth) {
    const { data, error } = await authClient.token();

    if (error || !data?.token) {
      throw new Error("Please login to continue.");
    }

    headers.set("Authorization", `Bearer ${data.token}`);
  }

  const response = await fetch(
    `${API_URL}${path}`,
    {
      ...fetchOptions,
      headers,
      cache: "no-store",
    }
  );

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      result?.message || `Request failed (${response.status})`
    );
  }

  return result;
}