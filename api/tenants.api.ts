import api from "@/lib/axios";
import {
  TenantFilterDto,
  TenantResponse,
  Tenant,
  UpdateTenantInterface
} from "@/types/tenant";

export const TenantsApi = {
  async getAll(params: TenantFilterDto): Promise<TenantResponse> {
    const { data } = await api.get("/tenant/filter", { params });
    return data;
  },

  async create(dto: { name: string; ownerId?: string; hostname?: string }): Promise<Tenant> {
    const { data } = await api.post("/tenant/create", dto);
    return data;
  },

  async softDelete(id: string): Promise<any> {
    const { data } = await api.delete(`/tenant/${id}/soft`);
    return data;
  }
,
  async hardDelete(id: string): Promise<any> {
    const { data } = await api.delete(`/tenant/${id}/hard`);
    return data;
  },

  async update(id: string, dto: UpdateTenantInterface): Promise<any> {
    const { data } = await api.patch(`/tenant/update/${id}`, dto);
    return data;
  }

};
