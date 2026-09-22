"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, ArrowLeft, Webhook } from "lucide-react";

interface WebhookLog {
  id: string;
  eventType: string;
  processed: boolean;
  error: string | null;
  createdAt: string;
  payload: Record<string, unknown>;
}

const mockLogs: WebhookLog[] = [
  {
    id: "1",
    eventType: "messages",
    processed: true,
    error: null,
    createdAt: "2024-01-20T10:30:00Z",
    payload: { messaging_product: "whatsapp", recipient_id: "+6281234567890" },
  },
  {
    id: "2",
    eventType: "statuses",
    processed: true,
    error: null,
    createdAt: "2024-01-20T10:28:00Z",
    payload: { status: "read", message_id: "wamid.HBgLNjI4MTIzNDU2Nzg5MAUCABIYFDNFQjBDODdCNjMyNUM3MDNBMkEyRRiDBo0Y" },
  },
  {
    id: "3",
    eventType: "messages",
    processed: false,
    error: "Invalid phone number format",
    createdAt: "2024-01-20T10:25:00Z",
    payload: { messaging_product: "whatsapp" },
  },
];

export default function WebhooksPage() {
  const [logs, setLogs] = useState<WebhookLog[]>(mockLogs);
  const [search, setSearch] = useState("");

  const filtered = logs.filter((log) =>
    log.eventType.toLowerCase().includes(search.toLowerCase())
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
            <h1 className="text-lg font-bold text-heading">Admin - Webhook Logs</h1>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <Input
              placeholder="Search event types..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All Events</TabsTrigger>
            <TabsTrigger value="processed">Processed</TabsTrigger>
            <TabsTrigger value="errors">Errors</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-6">
            <div className="space-y-3">
              {filtered.map((log) => (
                <Card key={log.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Webhook className="h-5 w-5 text-primary" />
                        <div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={log.processed ? "success" : "error"}
                              className="text-xs"
                            >
                              {log.processed ? "Processed" : "Error"}
                            </Badge>
                            <span className="font-mono text-xs text-muted-text">{log.eventType}</span>
                          </div>
                          <p className="mt-1 text-xs text-muted-text">
                            {new Date(log.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <button
                        className="text-xs text-primary hover:text-primary-dim"
                        onClick={() => alert(JSON.stringify(log.payload, null, 2))}
                      >
                        View Payload
                      </button>
                    </div>
                    {log.error && (
                      <p className="mt-3 rounded-md bg-error-bg border border-error-border px-3 py-2 text-xs text-error">
                        {log.error}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
            {filtered.length === 0 && (
              <div className="py-12 text-center text-sm text-muted-text">No webhook logs found.</div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
