import  api from "@/lib/axios";
import {CreateUserDto, UserFilterDto} from "@/types/user";

export const UsersApi = {
  async getAll(params: UserFilterDto) {
    const { data } = await api.get("/main-user/filter", { params });
    return data;
  },

  async create(dto: CreateUserDto) {
    const { data } = await api.post("/main-user/create", dto);
    return data;
  },

  async delete(id: string) {
    const { data } = await api.delete(`/main-user/${id}/hard`);
    return data;
  }
}
