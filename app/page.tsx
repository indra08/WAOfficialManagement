import Link from "next/link";
import {
  ArrowRight,
  MessageCircle,
  Shield,
  BarChart3,
  Users,
  Clock,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {

  return (
    <div className="flex min-h-screen flex-col bg-void">
      <header className="border-b border-border bg-void">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
              <MessageCircle className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-heading">Whatsapp Official Management</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/tutorial" className="hidden text-sm font-medium text-subtle hover:text-heading sm:block">
              Setup
            </Link>
            <Link href="/login" className="text-sm font-medium text-subtle hover:text-heading">
              Sign in
            </Link>
            <Link href="/register">
              <Button variant="primary" size="sm">
                Get Started
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <main>
        {/* ───────────────────────── HERO ───────────────────────── */}
        <section className="relative overflow-hidden py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-border bg-primary-bg px-4 py-1.5 text-xs font-semibold text-primary-dim">
                <Zap className="h-3 w-3" />
                Built for WhatsApp Business
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-heading sm:text-5xl lg:text-6xl">
                Manage your WhatsApp Business{" "}
                <span className="text-primary">like a PRO</span>
              </h1>
              <p className="mt-6 text-lg text-subtle leading-relaxed">
                One dashboard to connect, manage, and scale your WhatsApp Business conversations.
                Track contacts, automate messages, and grow your customer relationships effortlessly.
              </p>
              <div className="mt-10 flex items-center justify-center gap-4">
                <Link href="/register">
                  <Button variant="primary" size="lg" className="gap-2">
                    Start Free Trial
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="secondary" size="lg">
                    View Demo
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ───────────────────────── FITUR ───────────────────────── */}
        <section className="bg-deep py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-heading">Everything you need</h2>
              <p className="mt-3 text-subtle">Powerful features to streamline your WhatsApp Business operations</p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: MessageCircle,
                  title: "Multi-Account Management",
                  desc: "Connect multiple WhatsApp Business accounts and manage them all from one centralized dashboard.",
                },
                {
                  icon: Users,
                  title: "Contact Management",
                  desc: "Organize and segment your contacts with tags, custom fields, and smart lists for targeted messaging.",
                },
                {
                  icon: BarChart3,
                  title: "Analytics & Insights",
                  desc: "Track message delivery rates, response times, and conversation metrics to optimize your outreach.",
                },
                {
                  icon: Shield,
                  title: "Team Collaboration",
                  desc: "Assign conversations to team members, set roles and permissions, and work together seamlessly.",
                },
                {
                  icon: Clock,
                  title: "Message Templates",
                  desc: "Create and manage approved message templates for consistent, professional customer communication.",
                },
                {
                  icon: Zap,
                  title: "Webhook Integration",
                  desc: "Receive real-time notifications for incoming messages and integrate with your existing tools.",
                },
              ].map((feature) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.title} className="card">
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-bg">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="mb-2 text-base font-bold text-heading">{feature.title}</h3>
                    <p className="text-sm text-muted-text">{feature.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ───────────────────────── TUTORIAL CTA ───────────────────────── */}
        <section className="bg-deep/50 py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-border bg-primary-bg px-4 py-1.5 text-xs font-semibold text-primary-dim">
                <Zap className="h-3 w-3" />
                Panduan Integrasi
              </div>
              <h2 className="text-3xl font-extrabold text-heading sm:text-4xl">
                Hubungkan WhatsApp Business Anda dalam hitungan menit
              </h2>
              <p className="mt-4 text-subtle leading-relaxed">
                Whatsapp Official Management memakai Meta Embedded Signup resmi — tidak perlu paham API,
                tidak perlu mengatur server. Ikuti panduan lengkap 8 langkah kami.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-border bg-void px-4 py-1.5 text-xs font-medium text-subtle">
                  ± 15–30 menit
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-border bg-void px-4 py-1.5 text-xs font-medium text-subtle">
                  8 langkah sederhana
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-border bg-void px-4 py-1.5 text-xs font-medium text-subtle">
                  Tanpa coding
                </span>
              </div>
              <div className="mt-10 flex items-center justify-center gap-4">
                <Link href="/tutorial">
                  <Button variant="primary" size="lg" className="gap-2">
                    Lihat Tutorial Lengkap
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="secondary" size="lg">
                    Mulai Sekarang
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ───────────────────────── CTA AKHIR ───────────────────────── */}
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="card text-center">
              <h2 className="text-3xl font-extrabold text-heading">Ready to get started?</h2>
              <p className="mx-auto mt-4 max-w-lg text-subtle">
                Join thousands of businesses using Whatsapp Official Management to manage their WhatsApp Business communications.
              </p>
              <div className="mt-8">
                <Link href="/register">
                  <Button variant="primary" size="lg" className="gap-2">
                    Create Free Account
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-deep py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
                <MessageCircle className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-bold text-heading">Whatsapp Official</span>
            </div>
            <p className="text-sm text-muted-text">
              © 2026 Whatsapp Official Management. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
