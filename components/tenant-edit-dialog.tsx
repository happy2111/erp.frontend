"use client";

import { useState } from "react";
import { Tenant } from "@/types/tenant";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TenantsApi } from "@/api/tenants.api";
import { motion } from "framer-motion";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { UpdateTenantInterface, TenantStatus } from "@/types/tenant";
import {toast} from "sonner";

interface TenantEditDialogProps {
  tenant: Tenant;
  onUpdated?: (tenant: Tenant) => void;
}

export function TenantEditDialog({ tenant, onUpdated }: TenantEditDialogProps) {
  const [name, setName] = useState(tenant.name);
  const [hostname, setHostname] = useState(tenant.hostname || "");
  const [status, setStatus] = useState<TenantStatus>(tenant.status);
  const [dbName, setDbName] = useState(tenant.dbName || "");
  const [dbHost, setDbHost] = useState(tenant.dbHost || "");
  const [dbPort, setDbPort] = useState(tenant.dbPort || 5432);
  const [dbUser, setDbUser] = useState(tenant.dbUser || "");
  const [dbPassword, setDbPassword] = useState(tenant.dbPassword || "");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateTenant = async () => {
    try {
      setLoading(true);
      setError(null);

      const payload: UpdateTenantInterface = { name, hostname, status, dbName, dbHost, dbPort, dbUser, dbPassword };
      const updated = await TenantsApi.update(tenant.id, payload);
      onUpdated?.(updated);

      if (updated) {
        toast.success("Tenant updated successfully");
      }

    } catch (err: any) {
      const message = err?.response?.data?.message;
      if (typeof message === "string") {
        setError(message);
      } else if (typeof message === "object" && message !== null) {
        setError(JSON.stringify(message)); // превращаем объект в строку
      } else {
        setError("Failed to update tenant");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm">Edit</Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Edit Tenant "{tenant.name}"</AlertDialogTitle>
          <AlertDialogDescription>
            Update tenant name and hostname, or optionally edit advanced settings.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4 mt-2">
          {/* Основные поля */}
          <div>
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label>Hostname</Label>
            <Input value={hostname} onChange={(e) => setHostname(e.target.value)} />
          </div>

          {/* Расширенные поля */}
          <Collapsible>
            <CollapsibleTrigger asChild>
              <Button variant="link" className="text-sm px-0">Advanced Settings</Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="space-y-2 mt-2 border-t pt-2">
                <div>
                  <Label>Status</Label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as TenantStatus)}
                    className="w-full border rounded px-2 py-1"
                  >
                    {Object.values(TenantStatus).map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>DB Name</Label>
                  <Input value={dbName} onChange={(e) => setDbName(e.target.value)} />
                </div>
                <div>
                  <Label>DB Host</Label>
                  <Input value={dbHost} onChange={(e) => setDbHost(e.target.value)} />
                </div>
                <div>
                  <Label>DB Port</Label>
                  <Input type="number" value={dbPort} onChange={(e) => setDbPort(Number(e.target.value))} />
                </div>
                <div>
                  <Label>DB User</Label>
                  <Input value={dbUser} onChange={(e) => setDbUser(e.target.value)} />
                </div>
                <div>
                  <Label>DB Password</Label>
                  <Input value={dbPassword} onChange={(e) => setDbPassword(e.target.value)} />
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-600 text-sm">
              {error}
            </motion.div>
          )}
        </div>

        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={updateTenant} disabled={loading}>
            {loading ? "Updating..." : "Update"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
