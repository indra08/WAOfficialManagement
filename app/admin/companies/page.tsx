"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Plus, ArrowLeft, Loader2 } from "lucide-react";

interface Company {
  id: string;
  name: string;
  subdomain: string;
  isActive: boolean;
  createdAt: string;
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([
    { id: "1", name: "Acme Corp", subdomain: "acme-corp", isActive: true, createdAt: "2024-01-15T10:30:00Z" },
    { id: "2", name: "Beta Inc", subdomain: "beta-inc", isActive: true, createdAt: "2024-02-20T14:00:00Z" },
    { id: "3", name: "Gamma LLC", subdomain: "gamma-llc", isActive: false, createdAt: "2024-03-10T09:15:00Z" },
  ]);
  const [search, setSearch] = useState("");
  const [creating, setCreating] = useState(false);

  const filtered = companies.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.subdomain.toLowerCase().includes(search.toLowerCase())
  );

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = formData.get("name") as string;
    const subdomain = formData.get("subdomain") as string;

    setCreating(true);
    try {
      const res = await fetch("/api/company", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, subdomain }),
      });
      const data = (await res.json()) as Company;
      if (res.ok) {
        setCompanies((prev) => [...prev, { ...data, isActive: true, createdAt: new Date().toISOString() }]);
        form.reset();
      }
    } catch {
      // handle error
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="min-h-screen bg-deep">
      <header className="border-b border-border bg-void">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4 text-subtle" />
              <span className="text-sm text-subtle">Back</span>
            </Link>
            <h1 className="text-lg font-bold text-heading">Admin - Companies</h1>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <Input
              placeholder="Search companies..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="primary" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Company
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">All Companies ({companies.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-deep">
                  <th className="px-4 py-3 text-left font-semibold text-subtle">Name</th>
                  <th className="px-4 py-3 text-left font-semibold text-subtle">Subdomain</th>
                  <th className="px-4 py-3 text-left font-semibold text-subtle">Status</th>
                  <th className="px-4 py-3 text-left font-semibold text-subtle">Created</th>
                  <th className="px-4 py-3 text-right font-semibold text-subtle">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((company) => (
                  <tr key={company.id} className="border-b border-border last:border-0 hover:bg-deep transition-colors">
                    <td className="px-4 py-3 font-medium text-heading">{company.name}</td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-text">{company.subdomain}.waofficial.com</td>
                    <td className="px-4 py-3">
                      <Badge variant={company.isActive ? "success" : "error"}>
                        {company.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-text">
                      {new Date(company.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="sm" className="h-8 text-xs">
                        Manage
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="py-12 text-center text-sm text-muted-text">No companies found.</div>
            )}
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-base">Add New Company</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-heading">Company Name</label>
                  <Input name="name" placeholder="Acme Corporation" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-heading">Subdomain</label>
                  <Input name="subdomain" placeholder="acme-corp" required />
                </div>
              </div>
              <Button type="submit" variant="primary" disabled={creating}>
                {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Create Company
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
