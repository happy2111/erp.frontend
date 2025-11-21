"use client";

import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectItem, SelectContent, SelectValue } from "@/components/ui/select";
import { UserRole } from "@/types/user";

export function UsersFilters({ filters, setFilters }: { filters: any; setFilters: any }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-2 mb-4">
      <Input
        placeholder="Поиск..."
        value={filters.search}
        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        className="w-full sm:w-[200px]"
      />

      <Select
        value={filters.role || ""}
        onValueChange={(role) => setFilters({ ...filters, role })}
      >
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Выбрать роль" />
        </SelectTrigger>
        <SelectContent>
          {Object.values(UserRole).map((role: any) => (
            <SelectItem key={role} value={role}>
              {role}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
