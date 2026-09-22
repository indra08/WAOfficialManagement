"use client";

import { useState } from "react";
import DashboardShell from "../layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, RefreshCw } from "lucide-react";

export default function WhatsAppPage() {
  const [loading, setLoading] = useState(false);
  const [connecting, setConnecting] = useState(false);

  async function handleConnect() {
    setConnecting(true);
    try {
      const res = await fetch("/api/whatsapp/connect", { method: "POST" });
      const data = await res.json();
      if (data.connectionId) {
        alert(`Connection initiated! Code: ${data.code || "Check your dashboard"}`);
      }
    } catch {
      alert("Failed to connect");
    } finally {
      setConnecting(false);
    }
  }

  async function handleRefresh() {
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1000));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-heading">WhatsApp</h1>
            <p className="text-sm text-muted-text">Manage your WhatsApp Business connections</p>
          </div>
          <Button variant="primary" onClick={handleConnect} disabled={connecting}>
            {connecting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Connect Account
          </Button>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-bold">Connections</CardTitle>
            <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { phone: "+62 812-3456-7890", status: "connected", quality: "high", since: "2 days ago" },
                { phone: "+62 876-5432-1098", status: "pending", quality: null, since: "Just now" },
              ].map((acc) => (
                <div key={acc.phone} className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-bg">
                      <span className="font-bold text-primary text-sm">WA</span>
                    </div>
                    <div>
                      <p className="font-medium text-heading">{acc.phone}</p>
                      <p className="text-xs text-muted-text">Connected {acc.since}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {acc.quality && (
                      <span className="text-xs text-muted-text">Quality: {acc.quality}</span>
                    )}
                    <Badge variant={acc.status === "connected" ? "success" : "warning"}>
                      {acc.status === "connected" ? "Online" : "Pending"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
  );
}
