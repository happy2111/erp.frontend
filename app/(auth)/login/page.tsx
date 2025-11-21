"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { authStore } from "@/stores/auth.store";
import {useRouter} from "next/navigation";


const baseSchema = {
  password: z.string().min(8, "Пароль должен быть минимум 8 символов"),
};

const emailSchema = z.object({
  email: z.string().email("Некорректный email"),
  phone: z.string().optional(),
  ...baseSchema,
});

const phoneSchema = z.object({
  phone: z
    .string()
    .min(9, "Введите корректный телефон")
    .regex(/^\+?\d+$/, "Только цифры"),
  email: z.string().optional(),
  ...baseSchema,
});

// ----------------------

export default function LoginPage() {
  const [tab, setTab] = useState<"email" | "phone">("email");
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(tab === "email" ? emailSchema : phoneSchema),
    defaultValues: {
      email: "",
      phone: "",
      password: "",
    },
  });

  const onSubmit = async (values: any) => {
    try {
      const ok = await authStore.login(values);
      if (ok) {
        router.push("/dashboard"); // 🔥 REDIRECT HERE
      }
    } catch (e: any) {
      console.error(e);
    }
  };

  return (
    <Card className="shadow-lg border border-border/40">
      <CardHeader>
        <CardTitle className="text-center text-xl">Вход в систему</CardTitle>
        <CardDescription className="text-center">
          Укажите данные для авторизации
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="email" onValueChange={(v) => setTab(v as any)}>
          <TabsList className="w-full">
            <TabsTrigger value="email" className="w-full">
              Email
            </TabsTrigger>
            <TabsTrigger value="phone" className="w-full">
              Телефон
            </TabsTrigger>
          </TabsList>

          {/* -------------------- EMAIL FORM -------------------- */}
          <TabsContent value="email">
            <form
              className="space-y-4 mt-4"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <div>
                <Label className='mb-2'>Email</Label>
                <Input
                  type="email"
                  placeholder="example@gmail.com"
                  {...form.register("email")}
                />
                {form.formState.errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.email.message as any}
                  </p>
                )}
              </div>

              <div>
                <Label className="mb-2">Пароль</Label>
                <Input
                  type="password"
                  placeholder=""
                  {...form.register("password")}
                />
                {form.formState.errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.password.message as any}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full">
                Войти
              </Button>
            </form>
          </TabsContent>

          {/* -------------------- PHONE FORM -------------------- */}
          <TabsContent value="phone">
            <form
              className="space-y-4 mt-4"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <div>
                <Label className='mb-2'>Телефон</Label>
                <Input
                  type="tel"
                  placeholder="+998901234567"
                  {...form.register("phone")}
                />
                {form.formState.errors.phone && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.phone.message as any}
                  </p>
                )}
              </div>

              <div>
                <Label className='mb-2'>Пароль</Label>
                <Input
                  type="password"
                  placeholder=""
                  {...form.register("password")}
                />
                {form.formState.errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.password.message as any}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full">
                Войти
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
