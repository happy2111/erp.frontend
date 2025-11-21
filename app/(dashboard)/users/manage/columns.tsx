"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { UsersApi } from "@/api/users.api";
import {User} from "@/types/user";

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "firstName",
    header: "Имя",
  },
  {
    accessorKey: "lastName",
    header: "Фамилия",
  },
  {
    accessorKey: "phone",
    header: "Телефон",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Роль",
  },
  {
    header: "Действия",
    cell: ({ row }) => {
      const user = row.original;

      return (
        <Button
          variant="destructive"
          size="icon"
          onClick={async () => {
            try {
              await UsersApi.delete(user.id);
              toast.success("Пользователь удалён");
            } catch (e: any) {
              toast.error(e.response?.data?.message || "Ошибка удаления");
            }
          }}
        >
          <Trash2 className="size-4" />
        </Button>
      );
    },
  },
];
