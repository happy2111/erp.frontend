'use client'
import {ReactNode, useEffect} from "react";
import {authStore} from "@/stores/auth.store";
import {useRouter} from "next/navigation";

export default function AuthLayout({ children }: { children: ReactNode }) {
  const router = useRouter();

    useEffect(() => {
      if (authStore.isAuth) {
        router.replace("/dashboard");
      }
    }, [authStore.isAuth]);
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-6">
        {children}
      </div>
    </div>
  );
}
