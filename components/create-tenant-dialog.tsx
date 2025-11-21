"use client";

import { useState } from "react";
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
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";

export function CreateTenantDialog({ onCreated }: { onCreated?: Function }) {
  const [name, setName] = useState("");
  const [hostname, setHostname] = useState("");
  const [ownerId, setOwnerId] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Safe error extraction
  const extractError = (err: any) => {
    const data = err?.response?.data;
    if (typeof data?.message === "string") return data.message;
    return JSON.stringify(data?.message || data || "Unknown error");
  };

  const createTenant = async () => {
    try {
      setLoading(true);
      setError(null);

      const payload: any = {
        name,
        ...(hostname ? { hostname } : {}),
        ...(ownerId ? { ownerId } : {}),
      };

      const created = await TenantsApi.create(payload);

      onCreated?.(created);
    } catch (err: any) {
      setError(extractError(err));
    } finally {
      setLoading(false);
    }
  };

  const disabled = !name || loading;

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>Create Tenant</Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle>Create New Tenant</AlertDialogTitle>
          <AlertDialogDescription>
            Enter the information to create a new isolated tenant environment.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4 mt-3">
          {/* Name */}
          <div>
            <Label>Name *</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Acme Inc."
            />
          </div>

          {/* Hostname */}
          <div>
            <Label>Hostname</Label>
            <Input
              value={hostname}
              onChange={(e) => setHostname(e.target.value)}
              placeholder="acme.uz"
            />
          </div>

          {/* Advanced */}
          <Collapsible>
            <CollapsibleTrigger asChild>
              <Button variant="link" className="px-0 text-sm">
                Advanced Settings
              </Button>
            </CollapsibleTrigger>

            <CollapsibleContent>
              <div className="border-t mt-2 pt-3 space-y-3">
                <div>
                  <Label>Owner ID (main DB)</Label>
                  <Input
                    value={ownerId}
                    onChange={(e) => setOwnerId(e.target.value)}
                    placeholder="UUID of owner user"
                  />
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Error message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-600 text-sm"
            >
              {error}
            </motion.div>
          )}
        </div>

        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>

          <AlertDialogAction disabled={disabled} onClick={createTenant}>
            {loading ? "Creating..." : "Create"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
