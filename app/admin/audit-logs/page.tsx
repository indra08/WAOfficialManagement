"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, ArrowLeft, Shield } from "lucide-react";

interface AuditLog {
  id: string;
  action: string;
  entityType: string;
  entityId: string | null;
  userName: string;
  ipAddress: string | null;
  createdAt: string;
}

const mockLogs: AuditLog[] = [
  {
    id: "1",
    action: "created",
    entityType: "company",
    entityId: "comp_001",
    userName: "Indra Maulana",
    ipAddress: "192.168.1.1",
    createdAt: "2024-01-20T10:30:00Z",
  },
  {
    id: "2",
    action: "updated",
    entityType: "template",
    entityId: "tpl_042",
    userName: "Sari Dewi",
    ipAddress: "192.168.1.15",
    createdAt: "2024-01-20T09:45:00Z",
  },
  {
    id: "3",
    action: "deleted",
    entityType: "contact",
    entityId: "cnt_128",
    userName: "Budi Hartono",
    ipAddress: null,
    createdAt: "2024-01-19T16:20:00Z",
  },
  {
    id: "4",
    action: "connected",
    entityType: "whatsapp_account",
    entityId: "wa_003",
    userName: "Indra Maulana",
    ipAddress: "192.168.1.1",
    createdAt: "2024-01-19T14:00:00Z",
  },
  {
    id: "5",
    action: "created",
    entityType: "conversation",
    entityId: "conv_551",
    userName: "Sari Dewi",
    ipAddress: "192.168.1.15",
    createdAt: "2024-01-19T11:30:00Z",
  },
];

export default function AuditLogsPage() {
  const [logs] = useState<AuditLog[]>(mockLogs);
  const [search, setSearch] = useState("");

  const filtered = logs.filter(
    (log) =>
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.entityType.toLowerCase().includes(search.toLowerCase()) ||
      log.userName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-deep">
      <header className="border-b border-border bg-void">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4 text-subtle" />
              <span className="text-sm text-subtle">Back</span>
            </Link>
            <h1 className="text-lg font-bold text-heading">Admin - Audit Logs</h1>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <Input
              placeholder="Search actions, users, entities..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              Recent Activity ({logs.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-deep">
                  <th className="px-4 py-3 text-left font-semibold text-subtle">Action</th>
                  <th className="px-4 py-3 text-left font-semibold text-subtle">Entity</th>
                  <th className="px-4 py-3 text-left font-semibold text-subtle">User</th>
                  <th className="px-4 py-3 text-left font-semibold text-subtle">IP Address</th>
                  <th className="px-4 py-3 text-left font-semibold text-subtle">Time</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((log) => (
                  <tr key={log.id} className="border-b border-border last:border-0 hover:bg-deep transition-colors">
                    <td className="px-4 py-3">
                      <Badge
                        variant={
                          log.action === "deleted"
                            ? "error"
                            : log.action === "created"
                            ? "success"
                            : "default"
                        }
                        className="capitalize"
                      >
                        {log.action}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-medium text-heading capitalize">{log.entityType}</span>
                      {log.entityId && (
                        <span className="ml-2 font-mono text-xs text-muted-text">{log.entityId}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-subtle">{log.userName}</td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-text">
                      {log.ipAddress || "-"}
                    </td>
                    <td className="px-4 py-3 text-muted-text">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="py-12 text-center text-sm text-muted-text">No audit logs found.</div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
