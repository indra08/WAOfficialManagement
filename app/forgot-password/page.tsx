"use client";

import { useState } from "react";
import Link from "next/link";
import { MessageCircle, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-deep px-4">
      <div className="w-full max-w-sm">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
            <MessageCircle className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold text-heading">WaOfficial</span>
        </Link>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl font-bold text-heading">
              {submitted ? "Check your email" : "Forgot password?"}
            </CardTitle>
            <CardDescription>
              {submitted
                ? "We sent a password reset link to your email address."
                : "Enter your email and we will send you a reset link."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {submitted ? (
              <div className="flex flex-col items-center gap-4 py-4">
                <CheckCircle className="h-12 w-12 text-success" />
                <p className="text-center text-sm text-muted-text">
                  If an account exists for <strong className="text-heading">{email}</strong>, you will receive a password reset link shortly.
                </p>
                <Link href="/login">
                  <Button variant="secondary" className="w-full">
                    Back to Sign In
                  </Button>
                </Link>
              </div>
            ) : (
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
                <Button type="submit" variant="primary" className="w-full" disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Send Reset Link
                </Button>
                <div className="text-center">
                  <Link href="/login" className="text-sm text-primary hover:text-primary-dim">
                    Back to Sign In
                  </Link>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
