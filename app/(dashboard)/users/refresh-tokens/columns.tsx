"use client";

import { ColumnDef } from "@tanstack/react-table";
import { RefreshToken } from "@/types/refresh-token";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import {formatSmartDate} from "@/lib/date";

export const columns: ColumnDef<RefreshToken>[] = [
  // Checkbox
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "userId",
    header: "User ID",
  },
  {
    accessorKey: "tokenHash",
    header: "Token Hash",
    cell: ({ row }) => (
      <span className="font-mono text-xs text-muted-foreground">
        {row.original.tokenHash.slice(0, 20)}...
      </span>
    )
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) =>
      new Date(row.original.createdAt).toLocaleString(),
  },
  {
    accessorKey: "expiresAt",
    header: "Expires",
    cell: ({ row }) =>
      formatSmartDate(row.original.expiresAt)

      // new Date(row.original.expiresAt).toLocaleString(),
  },

  // Actions
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <Button
        variant="destructive"
        size="sm"
        onClick={() => console.log("Delete token", row.original.id)}
      >
        <Trash className="w-4 h-4" />
      </Button>
    ),
  },
];
