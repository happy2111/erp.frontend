"use client";

import { useEffect } from "react";
import { authStore } from "@/stores/auth.store";
import { observer } from "mobx-react-lite";

function AuthProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    authStore.refresh();
  }, []);

  return <>{children}</>;
}

export default observer(AuthProvider);
