"use client";

import { observer } from "mobx-react-lite";
import { authStore } from "@/stores/auth.store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function Protected({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    if (!authStore.isAuth) {
      router.replace("/login");
    }else {
      router.replace("/dashboard");
    }
  }, [authStore.isAuth]);

  if (!authStore.isAuth) return null;

  return <>{children}</>;
}

export default observer(Protected);
