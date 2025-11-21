export interface User {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string | null;
  role: UserRole;
  createdAt: string;   // backend отдаёт Date → клиент получает string
  updatedAt: string;   // тоже Date → string
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface RefreshResponse {
  access_token: string;
}

export enum UserRole {
  OWNER = "OWNER",
  ADMIN = "ADMIN",
  PLATFORM_OWNER = "PLATFORM_OWNER"
}

export interface CreateUserDto {
  firstName: string;
  lastName: string;
  phone: string;
  email?: string | null;
  password: string;
  role?: UserRole;
}


export interface UserFilterDto {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  role?: UserRole;

  createdFrom?: string; // yyyy-mm-dd
  createdTo?: string;
  updatedFrom?: string;
  updatedTo?: string;

  search?: string;

  page?: number;
  limit?: number;
}
