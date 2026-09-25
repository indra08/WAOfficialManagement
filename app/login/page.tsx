"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { MessageCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = (await res.json()) as Record<string, unknown>;

      if (!res.ok) {
        setError((data.error as string | undefined) || "Login failed");
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl font-bold text-heading">Sign in</CardTitle>
        <CardDescription>Enter your email and password to access your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-md border border-error-border bg-error-bg px-3 py-2 text-sm text-error">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <label className="text-sm font-medium text-heading" htmlFor="email">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-heading" htmlFor="password">
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-end">
            <Link href="/forgot-password" className="text-xs text-primary hover:text-primary-dim">
              Forgot password?
            </Link>
          </div>
          <Button type="submit" variant="primary" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Sign in
          </Button>
          <p className="text-center text-sm text-muted-text">
            Dont have an account?{" "}
            <Link href="/register" className="font-medium text-primary hover:text-primary-dim">
              Sign up
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-deep px-4">
      <div className="w-full max-w-sm">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
            <MessageCircle className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold text-heading">Whatsapp Official Management</span>
        </Link>
        <Suspense fallback={<div className="animate-pulse space-y-4"><div className="h-48 rounded-lg bg-base" /></div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
