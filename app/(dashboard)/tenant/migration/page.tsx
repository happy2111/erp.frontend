'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { motion } from "framer-motion";
import api from "@/lib/axios";

export default function TenantsMigrationPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const migrateAll = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      setProgress(10);

      const interval = window.setInterval(() => {
        setProgress((prev) => Math.min(prev + 15, 90));
      }, 300);

      await api.post("/tenant/migrate-all");

      clearInterval(interval);
      setProgress(100);

      setSuccess(true);
    } catch (err: any) {
      if (err?.response?.data) {
        const data = err.response.data;
        const message =
          typeof data === "string"
            ? data
            : data.message || JSON.stringify(data);
        setError(message);
      } else {
        setError(err?.message || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="shadow-lg border border-gray-200">
          <CardHeader>
            <CardTitle>Migrate All Tenants</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              This will migrate all tenant databases. Please make sure you have backups before proceeding.
            </p>

            <Button
              onClick={migrateAll}
              disabled={loading}
              className="w-full"
              variant="default"
            >
              {loading ? "Migrating..." : "Start Migration"}
            </Button>

            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Progress value={progress} className="mt-2" />
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Alert variant="default" className="mt-2">
                  <AlertTitle>Migration Completed</AlertTitle>
                  <AlertDescription>
                    All tenant databases have been successfully migrated.
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Alert variant="destructive" className="mt-2">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    {typeof error === "string" ? error : JSON.stringify(error)}
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
