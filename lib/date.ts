import { format, formatDistanceToNow, isToday, isYesterday } from "date-fns";
import { ru } from "date-fns/locale";

/**
 * Преобразование строки даты в объект Date
 */
export const toDate = (value: string | Date): Date => {
  return value instanceof Date ? value : new Date(value);
};

/**
 * Формат: 13.11.2025
 */
export const formatDate = (value: string | Date): string => {
  const date = toDate(value);
  return format(date, "dd.MM.yyyy", { locale: ru });
};

/**
 * Формат: 13.11.2025 09:40
 */
export const formatDateTime = (value: string | Date): string => {
  const date = toDate(value);
  return format(date, "dd.MM.yyyy HH:mm", { locale: ru });
};

/**
 * Пользовательский формат: Сегодня / Вчера / 13.11.2025
 */
export const formatSmartDate = (value: string | Date): string => {
  const date = toDate(value);

  if (isToday(date)) {
    return `Сегодня, ${format(date, "HH:mm", { locale: ru })}`;
  }

  if (isYesterday(date)) {
    return `Вчера, ${format(date, "HH:mm", { locale: ru })}`;
  }

  return format(date, "dd.MM.yyyy HH:mm", { locale: ru });
};

/**
 * Видео-стиль: 5 минут назад / 2 дня назад
 */
export const formatAgo = (value: string | Date): string => {
  const date = toDate(value);
  return formatDistanceToNow(date, { addSuffix: true, locale: ru });
};

/**
 * Универсальная функция (под таблицы)
 * createdAt → "13.11.2025 09:40"
 */
export const formatForTable = (value: string | Date): string => {
  return formatDateTime(value);
};
