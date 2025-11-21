import axios from "@/lib/axios";
import { RefreshTokenFilterDto } from "@/types/refresh-token";
import { DeleteManyRefreshTokensDto } from "@/types/refresh-token";

export const RefreshTokensApi = {
  getAll: (filters: RefreshTokenFilterDto) => axios.get("/main-user-refresh-token/filter", { params: filters }),
  delete: (id: string) => axios.delete(`/main-user-refresh-token/${id}`),
  deleteMany: (dto: DeleteManyRefreshTokensDto) =>
    axios.post(`/main-user-refresh-token/bulk`, { data: dto }),
};
