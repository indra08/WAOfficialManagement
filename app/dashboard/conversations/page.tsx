"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";

export default function ConversationsPage() {
  const [search, setSearch] = useState("");

  const conversations = [
    { id: 1, contact: "Budi Santoso", phone: "+62 812-3456-7890", lastMsg: "Thank you for the quick response!", time: "2m ago", unread: 2, status: "open" },
    { id: 2, contact: "Siti Rahayu", phone: "+62 876-5432-1098", lastMsg: "Can I get an update on my order?", time: "15m ago", unread: 0, status: "open" },
    { id: 3, contact: "Andi Wijaya", phone: "+62 811-2233-4455", lastMsg: "Yes, I would like to proceed.", time: "1h ago", unread: 1, status: "closed" },
    { id: 4, contact: "Dewi Lestari", phone: "+62 855-6677-8899", lastMsg: "The product arrived safely.", time: "3h ago", unread: 0, status: "open" },
    { id: 5, contact: "Rudi Hermawan", phone: "+62 822-1133-5577", lastMsg: "I have a question about pricing.", time: "5h ago", unread: 3, status: "open" },
  ];

  const filtered = conversations.filter(
    (c) =>
      c.contact.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-heading">Conversations</h1>
            <p className="text-sm text-muted-text">{conversations.filter((c) => c.unread > 0).length} unread messages</p>
          </div>
          <Button variant="primary">
            New Message
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <Input
              placeholder="Search conversations..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="secondary" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-deep">
                  <th className="px-4 py-3 text-left font-semibold text-subtle">Contact</th>
                  <th className="px-4 py-3 text-left font-semibold text-subtle">Phone</th>
                  <th className="px-4 py-3 text-left font-semibold text-subtle">Last Message</th>
                  <th className="px-4 py-3 text-left font-semibold text-subtle">Status</th>
                  <th className="px-4 py-3 text-left font-semibold text-subtle">Time</th>
                  <th className="px-4 py-3 text-center font-semibold text-subtle">Unread</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((conv) => (
                  <tr key={conv.id} className="border-b border-border last:border-0 hover:bg-deep cursor-pointer transition-colors">
                    <td className="px-4 py-3 font-medium text-heading">{conv.contact}</td>
                    <td className="px-4 py-3 text-muted-text">{conv.phone}</td>
                    <td className="px-4 py-3 max-w-xs truncate text-muted-text">{conv.lastMsg}</td>
                    <td className="px-4 py-3">
                      <Badge variant={conv.status === "open" ? "success" : "default"}>
                        {conv.status === "open" ? "Open" : "Closed"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-text">{conv.time}</td>
                    <td className="px-4 py-3 text-center">
                      {conv.unread > 0 ? (
                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                          {conv.unread}
                        </span>
                      ) : (
                        <span className="text-muted-text">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="py-12 text-center text-sm text-muted-text">
                No conversations found.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
  );
}
