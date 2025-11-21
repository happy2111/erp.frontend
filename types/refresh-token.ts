export interface RefreshTokenFilterDto {
  search?: string;        // Поиск по tokenHash (частичное совпадение)
  userId?: string;        // Фильтр по userId
  expiresBefore?: string; // ISO дата, токены, срок которых истёк до этой даты
  page?: number;          // Номер страницы
  limit?: number;         // Количество элементов на странице
}

export interface DeleteManyRefreshTokensDto {
  ids: string[];          // Список ID токенов для удаления
}

export interface RefreshToken {
  id: string;
  tokenHash: string;
  userId: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}
