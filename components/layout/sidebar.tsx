import {
  MessageSquare,
  Users,
  Settings,
  LayoutDashboard,
  MessageCircle,
  FileText,
  Shield,
} from "lucide-react";
import Link from "next/link";

const sidebarNavItems = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "WhatsApp", href: "/dashboard/whatsapp", icon: MessageCircle },
  { title: "Conversations", href: "/dashboard/conversations", icon: MessageSquare },
  { title: "Contacts", href: "/dashboard/contacts", icon: Users },
  { title: "Templates", href: "/dashboard/templates", icon: FileText },
  { title: "Team", href: "/dashboard/team", icon: Shield },
  { title: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  return (
    <aside className="hidden w-64 flex-col border-r border-border bg-deep md:flex">
      <div className="flex h-14 items-center border-b border-border px-6">
        <span className="font-bold text-heading text-sm">WA Management</span>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {sidebarNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-subtle transition-colors hover:bg-base hover:text-heading"
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.title}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
