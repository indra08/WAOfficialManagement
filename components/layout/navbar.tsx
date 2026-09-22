"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  Search,
  X,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const user = {
    name: "Demo User",
    email: "demo@example.com",
    initials: "DU",
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-void">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <button
            className="flex h-8 w-8 items-center justify-center rounded-md md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="h-5 w-5 text-subtle" />
            ) : (
              <Menu className="h-5 w-5 text-subtle" />
            )}
          </button>
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
              <span className="text-xs font-extrabold text-white">W</span>
            </div>
            <span className="hidden text-sm font-bold text-heading sm:inline">
              WaOfficial
            </span>
          </Link>
          {pathname.startsWith("/dashboard") && (
            <div className="hidden items-center gap-1 rounded-lg bg-base px-2 py-1 sm:flex">
              <Search className="h-4 w-4 text-muted" />
              <input
                type="text"
                placeholder="Search..."
                className="border-none bg-transparent text-sm text-heading placeholder:text-muted focus:outline-none focus:ring-0"
              />
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-error text-[10px] text-white">
              3
            </span>
          </Button>
          <div className="relative ml-2">
            <Avatar className="h-8 w-8 cursor-pointer">
              <AvatarFallback className="bg-primary text-white text-xs">
                {user.initials}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-void pd-4 md:hidden">
          <nav className="space-y-1 p-3">
            {[
              { label: "Dashboard", href: "/dashboard" },
              { label: "WhatsApp", href: "/dashboard/whatsapp" },
              { label: "Conversations", href: "/dashboard/conversations" },
              { label: "Contacts", href: "/dashboard/contacts" },
              { label: "Templates", href: "/dashboard/templates" },
              { label: "Team", href: "/dashboard/team" },
              { label: "Settings", href: "/dashboard/settings" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? "bg-primary-bg text-primary-dim"
                    : "text-subtle hover:bg-base hover:text-heading"
                }`}
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <hr className="my-2 border-border" />
            <Link
              href="/login"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-error hover:bg-error-bg"
              onClick={() => setMobileOpen(false)}
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
