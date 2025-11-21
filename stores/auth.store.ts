import { makeAutoObservable } from "mobx";
import api from "@/lib/axios";

export class AuthStore {
  user: any = null;
  accessToken: string | null = null;
  isAuth = false;

  constructor() {
    makeAutoObservable(this);

    if (typeof window !== "undefined") {
      this.accessToken = localStorage.getItem("access_token");

      const rawUser = localStorage.getItem("user");
      try {
        this.user = rawUser ? JSON.parse(rawUser) : null;
      } catch {
        this.user = null;
        localStorage.removeItem("user");
      }

      this.isAuth = !!this.accessToken;
    }
  }

  async login(data: { phone?: string; email?: string; password: string }) {
    const res = await api.post("/auth/login", data);

    const token: string = res.data.data.access_token;
    const user: any = res.data.data.user;

    this.accessToken = token;
    this.user = user;
    this.isAuth = true;

    localStorage.setItem("access_token", token);
    localStorage.setItem("user", JSON.stringify(user));

    return true;
  }

  async refresh() {
    try {
      const res = await api.post("/auth/refresh");

      const token = res.data.data.access_token;
      const user = res.data.data.user;

      this.accessToken = token;
      this.user = user;
      this.isAuth = true;

      localStorage.setItem("access_token", token);
      localStorage.setItem("user", JSON.stringify(user));

      return true;
    } catch (e) {
      this.logout();
      return false;
    }
  }

  logout() {
    this.isAuth = false;
    this.user = null;
    this.accessToken = null;
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
  }
}

export const authStore = new AuthStore();
