"use client";

import { useEffect, useState } from "react";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { TenantsApi } from "@/api/tenants.api";
import { Button } from "@/components/ui/button";
import { TenantFilterDto, Tenant } from "@/types/tenant";
import {CreateTenantDialog} from "@/components/create-tenant-dialog";


export default function TenantsPage() {
  const [filters, setFilters] = useState<TenantFilterDto>({ page: 1, limit: 20 });
  const [data, setData] = useState<Tenant[]>([]);
  const [total, setTotal] = useState(0);

  const load = async () => {
    const res = await TenantsApi.getAll(filters);
    setData(res.data?.items ?? []);
    setTotal(res.data?.total ?? 0);
  };

  useEffect(() => {
    load();
  }, [filters]);

  const nextPage = () =>
    setFilters((prev) => ({ ...prev, page: (prev.page ?? 1) + 1 }));

  const prevPage = () =>
    setFilters((prev) => ({ ...prev, page: Math.max((prev.page ?? 1) - 1, 1) }));

  return (
    <div className="p-4 space-y-4">

      {/* ---------------- TOP BAR ---------------- */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Tenants</h1>

        {/* кнопка создания */}
        <CreateTenantDialog onCreated={() => load()} />
      </div>

      {/* ---------------- TABLE ---------------- */}
      <DataTable columns={columns} data={data} />

      {/* ---------------- PAGINATION ---------------- */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={prevPage}
          disabled={(filters.page ?? 1) <= 1}
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

      <div className="text-muted-foreground text-sm">
        {data?.length ?? 0} of {total ?? 0} tenant(s)
      </div>
    </div>
  );
}
