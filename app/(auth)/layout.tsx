'use client'
import {ReactNode, useEffect} from "react";
import {observer} from "mobx-react-lite";
import {authStore} from "@/stores/auth.store";
import {useRouter} from "next/navigation";

function AuthLayout({ children }: { children: ReactNode }) {
  const router = useRouter();

    useEffect(() => {
      if (authStore.isAuth) {
        router.replace("/dashboard");
      }
    }, [authStore.isAuth, router]);
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-6">
        {children}
      </div>
    </div>
  );
}

export default observer(AuthLayout);
