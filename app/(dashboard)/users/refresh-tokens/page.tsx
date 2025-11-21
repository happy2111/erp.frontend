"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


import { RefreshToken } from "@/types/refresh-token";
import { RefreshTokensApi } from "@/api/refresh-tokens.api";
import { DataTable } from "./data-table";
import {formatSmartDate} from "@/lib/date";

export default function RefreshTokensPage() {
  const [tokens, setTokens] = useState<RefreshToken[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [search, setSearch] = useState("");


  const [page, setPage] = useState(1);
  const limit = 20; // фиксированное значение; setLimit не использовался
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper: normalize possible error shapes to string
  function normalizeErrorPayload(payload: any): string {
    if (!payload) return "Server error";
    const maybeMessage = payload.message ?? payload.error ?? payload.detail ?? payload.description;
    if (typeof maybeMessage === "string") return maybeMessage;
    if (typeof payload === "string") return payload;
    try {
      return JSON.stringify(payload);
    } catch {
      return "Server error";
    }
  }

  // ----------------------------------------------------------------------
  // LOAD
  // ----------------------------------------------------------------------
  const load = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await RefreshTokensApi.getAll({ page, limit, search });

      // API returns payload in res.data — it may contain items
      const payload = res?.data ?? {};

      // Support both payload.items and payload.data?.items (some APIs wrap)
      const items = payload.items ?? payload.data?.items ?? [];
      const totalCount = payload.total ?? payload.data?.total ?? 0;

      setTokens(items ?? []);
      setTotal(totalCount ?? 0);
    } catch (err: any) {
      const msg = err?.response?.data ? normalizeErrorPayload(err.response.data) : (err?.message ?? "Failed to load refresh tokens");
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [page, limit, search]);

  // ----------------------------------------------------------------------
  // COLUMNS
  // ----------------------------------------------------------------------
  const columns = useMemo<ColumnDef<RefreshToken>[]>(() => {
    return [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllRowsSelected()}
            onCheckedChange={(value) => {
              const checked = !!value;

              table.toggleAllRowsSelected(checked);
              checked
                ? setSelectedIds(tokens.map((t) => t.id))
                : setSelectedIds([]);
            }}
          />
        ),
        cell: ({ row }) => {
          const id = row.original.id;

          return (
            <Checkbox
              checked={selectedIds.includes(id)}
              onCheckedChange={(checked) => {
                setSelectedIds((prev) =>
                  checked ? [...prev, id] : prev.filter((x) => x !== id)
                );
              }}
            />
          );
        },
      },

      {
        accessorKey: "tokenHash",
        header: "Token Hash",
      },

      {
        accessorKey: "userId",
        header: "User ID",
      },

      {
        accessorKey: "expiresAt",
        header: "Expires At",
        cell: ({ getValue }) =>
          // new Date(getValue() as string).toLocaleString(),
        formatSmartDate(getValue() as string)
      },

      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <Button
            size="sm"
            variant="destructive"
            onClick={async () => {
              try {
                setLoading(true);
                await RefreshTokensApi.delete(row.original.id);
                load();
              } catch (err: any) {
                const msg = err?.response?.data ? normalizeErrorPayload(err.response.data) : (err?.message ?? "Failed to delete token");
                setError(msg);
              } finally {
                setLoading(false);
              }
            }}
          >
            Delete
          </Button>
        ),
      },
    ];
  }, [selectedIds, tokens]);

  // ----------------------------------------------------------------------
  // TABLE INSTANCE
  // ----------------------------------------------------------------------

  // ----------------------------------------------------------------------
  // DELETE MANY
  // ----------------------------------------------------------------------
  const deleteSelected = async () => {
    if (!selectedIds.length) return;

    try {
      setLoading(true);

      await RefreshTokensApi.deleteMany({ ids: selectedIds });

      setSelectedIds([]);
      load();
    } catch (err: any) {
      const msg = err?.response?.data ? normalizeErrorPayload(err.response.data) : (err?.message ?? "Failed to delete selected tokens");
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------------------------------------
  // RENDER
  // ----------------------------------------------------------------------
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* SEARCH + DELETE SELECTED */}
      <div className="flex items-center justify-between gap-4">
        <Input
          placeholder="Search tokens…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />

        <Button
          variant="destructive"
          disabled={!selectedIds.length || loading}
          onClick={deleteSelected}
        >
          Delete Selected
        </Button>
      </div>

      {/* ERROR */}
      {error && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </motion.div>
      )}

      {/* TABLE */}
      <motion.div
        key={page}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <DataTable
          data={tokens}
          columns={columns}
          onDeleteSelected={deleteSelected}
        />


      </motion.div>

      {/* PAGINATION */}
      <div className="flex justify-end items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Previous
        </Button>

        <div className="px-3 text-sm">
          Page {page} of {Math.ceil(total / limit)}
        </div>

        <Button
          variant="outline"
          size="sm"
          disabled={page >= Math.ceil(total / limit)}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </Button>
      </div>

      <div className="text-muted-foreground text-sm">
        Showing {tokens.length} of {total} tokens
      </div>
    </div>
  );
}
