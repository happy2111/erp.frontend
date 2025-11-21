import axios, { AxiosError } from "axios";
import { authStore } from "@/stores/auth.store";
import { toast } from "sonner";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

function toErrorMessage(payload: any): string {
  function asString(v: any): string | null {
    if (v == null) return null;
    if (typeof v === "string") return v.trim() || null;
    if (Array.isArray(v)) {
      const parts = v
        .map((x) => asString(x))
        .filter((x): x is string => Boolean(x));
      return parts.length ? Array.from(new Set(parts)).join(", ") : null;
    }
    if (typeof v === "object") {
      // Common API shapes (NestJS, etc.)
      const keysToTry = [
        "message",
        "error",
        "detail",
        "description",
        "statusText",
      ];
      for (const k of keysToTry) {
        const got = asString((v as any)[k]);
        if (got) return got;
      }
      // Some backends wrap inside { message: { message: "..." } }
      if (v.message && typeof v.message === "object") {
        const nested = asString(v.message.message) || asString(v.message.error);
        if (nested) return nested;
      }
    }
    return null;
  }

  const msg = asString(payload);
  if (msg) return msg;

  try {
    if (payload) return JSON.stringify(payload);
  } catch {}

  return "Server error";
}

// 👉 Подставляем accessToken
api.interceptors.request.use((config) => {
  if (authStore.accessToken) {
    config.headers.Authorization = `Bearer ${authStore.accessToken}`;
  }
  return config;
});

// ============ GLOBAL ERROR HANDLER ============
api.interceptors.response.use(
  (res) => res,

  async (error: AxiosError<any>) => {
    const originalRequest: any = error.config;

    // ❗ Глобальный toast ошибок (normalize to string)
    const data: any = error.response?.data;
    const msg = toErrorMessage(data);

    // Не показываем toast при refresh
    if (originalRequest?.url !== "/auth/refresh") {
      toast.error(msg);
    }

    // === REFRESH логика ===
    if (error.response?.status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true;

      try {
        const ok = await authStore.refresh();
        if (ok) return api(originalRequest);
      } catch {
        authStore.logout();
      }
    }

    return Promise.reject(error);
  }
);

export default api;
