"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UsersApi } from "@/api/users.api";
import { toast } from "sonner";
import { Select, SelectTrigger, SelectValue, SelectItem, SelectContent } from "@/components/ui/select";
import {CreateUserDto, UserRole} from "@/types/user";

export function CreateUserDialog({ onCreated }: { onCreated: any }) {
  const [open, setOpen] = useState(false);
  const [dto, setDto] = useState<CreateUserDto>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    role: UserRole.OWNER,
  });

  const submit = async () => {
    try {
      await UsersApi.create(dto);
      toast.success("Пользователь создан");
      setOpen(false);
      onCreated?.();
    } catch (e: any) {
      // // Проверяем, что message — это строка
      // const errorMessage =
      //   typeof e.response?.data?.message === "string"
      //     ? e.response.data.message
      //     : JSON.stringify(e.response?.data) || "Ошибка создания";
      // toast.error(errorMessage);
    }
  };


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Создать пользователя</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogTitle>Создать нового пользователя</DialogTitle>


        <div className="grid gap-3 py-4">
          <Input placeholder="Имя" value={dto.firstName} onChange={(e) => setDto({ ...dto, firstName: e.target.value })} />
          <Input placeholder="Фамилия" value={dto.lastName} onChange={(e) => setDto({ ...dto, lastName: e.target.value })} />
          <Input placeholder="Телефон" value={dto.phone} onChange={(e) => setDto({ ...dto, phone: e.target.value })} />
          <Input placeholder="Email" value={dto.email ?? ""} onChange={(e) => setDto({ ...dto, email: e.target.value })} />
          <Input placeholder="Пароль" type="password" value={dto.password} onChange={(e) => setDto({ ...dto, password: e.target.value })} />

          <Select
            value={dto.role}
            onValueChange={(role) => setDto({ ...dto, role: role as UserRole })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Роль" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(UserRole).map((role) => (
                <SelectItem key={role} value={role}>{role}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button onClick={submit}>Создать</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
