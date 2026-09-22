"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus, MoreHorizontal } from "lucide-react";

export default function TeamPage() {
  const members = [
    { id: 1, name: "Indra Maulana", email: "indra@company.com", role: "Admin", avatar: "IM", status: "active" },
    { id: 2, name: "Sari Dewi", email: "sari@company.com", role: "Agent", avatar: "SD", status: "active" },
    { id: 3, name: "Budi Hartono", email: "budi@company.com", role: "Agent", avatar: "BH", status: "inactive" },
  ];

  return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-heading">Team Members</h1>
            <p className="text-sm text-muted-text">Manage access and permissions</p>
          </div>
          <Button variant="primary" className="gap-2">
            <Plus className="h-4 w-4" />
            Invite Member
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Members ({members.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-deep">
                  <th className="px-4 py-3 text-left font-semibold text-subtle">Member</th>
                  <th className="px-4 py-3 text-left font-semibold text-subtle">Role</th>
                  <th className="px-4 py-3 text-left font-semibold text-subtle">Status</th>
                  <th className="px-4 py-3 text-right font-semibold text-subtle">Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr key={member.id} className="border-b border-border last:border-0 hover:bg-deep transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="bg-primary text-white text-xs">
                            {member.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-heading">{member.name}</p>
                          <p className="text-xs text-muted-text">{member.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={member.role === "Admin" ? "warning" : "default"}
                        className="text-xs"
                      >
                        {member.role}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={member.status === "active" ? "success" : "default"}>
                        {member.status === "active" ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
  );
}
