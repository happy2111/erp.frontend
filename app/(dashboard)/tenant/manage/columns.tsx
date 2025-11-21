import {ColumnDef} from "@tanstack/react-table";
import {Tenant} from "@/types/tenant";
import { formatDateTime } from "@/lib/date";
import TenantActions from "@/components/tenant-actions";


export const columns: ColumnDef<Tenant>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "ownerId", header: "Owner ID",
    cell: ({ row }) => row.original.ownerId ?? "-",
  },
  { accessorKey: "apiKey", header: "API Key" },
  { accessorKey: "hostname", header: "Hostname" },
  { accessorKey: "status", header: "Status" },

  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => formatDateTime(row.original.createdAt),
  },
  {
    accessorKey: "updatedAt",
    header: "Updated At",
    cell: ({ row }) => formatDateTime(row.original.updatedAt),
  },

  {
    accessorKey: "owner.phone",
    header: "Owner Phone",
    cell: ({ row }) => row.original.owner?.phone ?? "-",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) =>
      <TenantActions
        tenant={row.original}
        onUpdated={(updated) => {
        row.original = updated;
    }}/>
  },
];
