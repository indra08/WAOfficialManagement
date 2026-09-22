"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Search, Plus, Eye, Trash2, Edit2 } from "lucide-react";

export default function TemplatesPage() {
  const [search, setSearch] = useState("");

  const templates = [
    { id: 1, name: "order_confirmation", language: "en", category: "utility", status: "approved", body: "Hello {{1}}, your order {{2}} has been confirmed. Expected delivery: {{3}}." },
    { id: 2, name: "shipping_update", language: "en", category: "transactional", status: "approved", body: "Hi {{1}}, your order {{2}} is on its way! Track it here: {{3}}" },
    { id: 3, name: "appointment_reminder", language: "id", category: "authentication", status: "pending", body: "Reminder: Your appointment with {{1}} is scheduled for {{2}} at {{3}}." },
    { id: 4, name: "payment_receipt", language: "en", category: "utility", status: "approved", body: "Thank you {{1}}! Your payment of {{2}} has been received. Receipt: {{3}}" },
    { id: 5, name: "feedback_request", language: "id", category: "marketing", status: "rejected", body: "Hi {{1}}, we would love to hear your feedback about our service. Please rate us!" },
  ];

  const filtered = templates.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-heading">Message Templates</h1>
            <p className="text-sm text-muted-text">Manage your WhatsApp message templates</p>
          </div>
          <Button variant="primary" className="gap-2">
            <Plus className="h-4 w-4" />
            Create Template
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <Input
              placeholder="Search templates..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((template) => (
                <Card key={template.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base">{template.name}</CardTitle>
                        <p className="mt-1 text-xs text-muted-text">{template.category} · {template.language}</p>
                      </div>
                      <Badge variant={template.status === "approved" ? "success" : template.status === "pending" ? "warning" : "error"}>
                        {template.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 rounded-md bg-base p-3 text-xs text-body">
                      {template.body}
                    </p>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="h-8 gap-1 px-2 text-xs">
                        <Eye className="h-3 w-3" /> Preview
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 gap-1 px-2 text-xs">
                        <Edit2 className="h-3 w-3" /> Edit
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 gap-1 px-2 text-xs text-error hover:bg-error-bg hover:text-error">
                        <Trash2 className="h-3 w-3" /> Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {filtered.length === 0 && (
              <div className="py-12 text-center text-sm text-muted-text">
                No templates found.
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
  );
}
