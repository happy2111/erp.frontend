"use client";

import { useEffect, useState } from "react";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { UsersApi } from "@/api/users.api";
import { UsersFilters } from "./filters";
import { CreateUserDialog } from "./create-user-dialog";
import { UserFilterDto } from "@/types/user";
import {Button} from "@/components/ui/button";

export default function UsersPage() {
  const [filters, setFilters] = useState<UserFilterDto>({
    search: "",
    role: undefined,
    page: 1,    // обязательное число
    limit: 20,  // обязательное число
  } as Required<Pick<UserFilterDto, 'page' | 'limit'>> & Omit<UserFilterDto, 'page' | 'limit'>);


  const [data, setData] = useState([]);

  const [total, setTotal] = useState(0);

  const load = async () => {
    const res = await UsersApi.getAll(filters);
    setData(res.data.items);
    setTotal(res.data.total);
  };

  useEffect(() => {
    load();
  }, [filters]);

  const nextPage = () =>
    setFilters(prev => ({ ...prev, page: (prev.page ?? 1) + 1 }));

  const prevPage = () =>
    setFilters(prev => ({ ...prev, page: Math.max((prev.page ?? 1) - 1, 1) }));


  return (
    <div className="p-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
        <UsersFilters filters={filters} setFilters={setFilters} />
        <CreateUserDialog onCreated={load} />
      </div>

      <DataTable columns={columns} data={data} />

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {data.length} of {total} row(s)
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={prevPage}
            disabled={(filters.page ?? 1) === 1}
          >
            Previous
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={nextPage}
            disabled={(filters.page ?? 1) >= Math.ceil(total / (filters.limit ?? 20))}
          >
            Next
          </Button>

        </div>
      </div>
    </div>
  );
}
