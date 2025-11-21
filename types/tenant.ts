export enum TenantStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  DELETED = "DELETED"
}

export interface Tenant {
  id: string;
  name: string;
  ownerId?: string;
  apiKey: string;
  hostname?: string;
  status: TenantStatus;
  createdAt: string;
  updatedAt: string;
  owner: {
    phone: string;
  }

  dbName?: string;
  dbHost?: string;
  dbPort?: number;
  dbUser?: string;
  dbPassword?: string;
}

export interface UpdateTenantInterface {
  name?: string;
  ownerId?: string;
  status?: TenantStatus;
  hostname?: string;
  dbName?: string;
  dbHost?: string;
  dbPort?: number;
  dbUser?: string;
  dbPassword?: string;
}

export interface TenantResponse {
  data: {
    total: number;
    page: number;
    limit: number;
    items: Tenant[];
  }
}

export interface TenantFilterDto {
  search?: string;
  name?: string;
  ownerId?: string;
  apiKey?: string;
  hostname?: string;
  status?: TenantStatus;
  page?: number;
  limit?: number;
}





