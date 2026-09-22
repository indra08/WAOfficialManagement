"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Phone } from "lucide-react";

export default function ContactsPage() {
  const [search, setSearch] = useState("");

  const contacts = [
    { id: 1, name: "Budi Santoso", phone: "+62 812-3456-7890", email: "budi@example.com", tags: ["Customer", "VIP"], lastContact: "2h ago" },
    { id: 2, name: "Siti Rahayu", phone: "+62 876-5432-1098", email: "siti@example.com", tags: ["Lead"], lastContact: "1d ago" },
    { id: 3, name: "Andi Wijaya", phone: "+62 811-2233-4455", email: "andi@example.com", tags: ["Customer"], lastContact: "3d ago" },
    { id: 4, name: "Dewi Lestari", phone: "+62 855-6677-8899", email: "dewi@example.com", tags: ["Partner", "VIP"], lastContact: "5d ago" },
    { id: 5, name: "Rudi Hermawan", phone: "+62 822-1133-5577", email: "rudi@example.com", tags: ["Lead"], lastContact: "1w ago" },
  ];

  const filtered = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      c.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-heading">Contacts</h1>
            <p className="text-sm text-muted-text">{contacts.length} total contacts</p>
          </div>
          <Button variant="primary" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Contact
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <Input
            placeholder="Search contacts..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Card>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-deep">
                  <th className="px-4 py-3 text-left font-semibold text-subtle">Name</th>
                  <th className="px-4 py-3 text-left font-semibold text-subtle">Phone</th>
                  <th className="px-4 py-3 text-left font-semibold text-subtle">Email</th>
                  <th className="px-4 py-3 text-left font-semibold text-subtle">Tags</th>
                  <th className="px-4 py-3 text-left font-semibold text-subtle">Last Contact</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((contact) => (
                  <tr key={contact.id} className="border-b border-border last:border-0 hover:bg-deep transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="avatar-initials sm h-8 w-8">
                          {contact.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)}
                        </div>
                        <span className="font-medium text-heading">{contact.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-text flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {contact.phone}
                    </td>
                    <td className="px-4 py-3 text-muted-text">{contact.email || "-"}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {contact.tags.map((tag) => (
                          <Badge key={tag} variant="default" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-text">{contact.lastContact}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="py-12 text-center text-sm text-muted-text">
                No contacts found.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
  );
}
