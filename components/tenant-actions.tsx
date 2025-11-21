// explanation: Сделал компонент клиентским (добавил "use client") — он использует useState и должен рендериться на клиенте.
"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import {TenantsApi} from "@/api/tenants.api";
import {Tenant} from "@/types/tenant";
import {TenantEditDialog} from "@/components/tenant-edit-dialog";

export default function TenantActions({ tenant , onUpdated }: { tenant: Tenant, onUpdated?: (tenant: Tenant) => void }) {
  const [softOpen, setSoftOpen] = useState(false);
  const [hardOpen, setHardOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <TenantEditDialog tenant={tenant} onUpdated={onUpdated} />

          <DropdownMenuItem onClick={() => setSoftOpen(true)}>
            Soft Delete
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setHardOpen(true)} className="text-red-600">
            Hard Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Soft Delete Dialog */}
      <AlertDialog open={softOpen} onOpenChange={setSoftOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete tenant "{tenant.name}"?
            </AlertDialogTitle>
            <AlertDialogDescription>
              The tenant will be marked as deleted but still stored in DB.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSoftOpen(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                await TenantsApi.softDelete(tenant.id);
                setSoftOpen(false);
              }}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Hard Delete Dialog */}
      <AlertDialog open={hardOpen} onOpenChange={setHardOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Permanently delete "{tenant.name}"?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. All tenant data will be erased permanently!
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setHardOpen(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={async () => {
                await TenantsApi.hardDelete(tenant.id);
                setHardOpen(false);
              }}
            >
              Confirm Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
