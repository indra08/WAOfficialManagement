
export default function DashboardPage() {
  return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-heading">Dashboard</h1>
          <p className="text-sm text-muted-text">Your WhatsApp Business overview at a glance.</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Total Contacts", value: "1,284", change: "+12%", trend: "up" },
            { label: "Active Conversations", value: "47", change: "+5", trend: "up" },
            { label: "Messages Sent", value: "8,932", change: "+18%", trend: "up" },
            { label: "WhatsApp Accounts", value: "2", change: "Active", trend: "neutral" },
          ].map((stat) => (
            <div key={stat.label} className="card">
              <p className="text-xs font-medium text-muted-text uppercase tracking-wide">{stat.label}</p>
              <p className="mt-2 text-3xl font-extrabold text-heading">{stat.value}</p>
              <p
                className={`mt-1 text-xs font-medium ${
                  stat.trend === "up"
                    ? "text-success"
                    : stat.trend === "down"
                    ? "text-error"
                    : "text-subtle"
                }`}
              >
                {stat.change} {stat.trend === "up" ? "from last month" : ""}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="card">
            <h2 className="mb-4 text-base font-bold text-heading">Connection Status</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success-bg">
                    <span className="h-2 w-2 rounded-full bg-success" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-heading">+62 812-3456-7890</p>
                    <p className="text-xs text-muted-text">Connected since 2 days ago</p>
                  </div>
                </div>
                <span className="badge badge-success">Online</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-bg">
                    <span className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-heading">+62 876-5432-1098</p>
                    <p className="text-xs text-muted-text">Pending verification</p>
                  </div>
                </div>
                <span className="badge badge-warning">Pending</span>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="mb-4 text-base font-bold text-heading">Recent Conversations</h2>
            <div className="space-y-3">
              {[
                { name: "Budi Santoso", lastMsg: "Thank you for the quick response!", time: "2m ago" },
                { name: "Siti Rahayu", lastMsg: "Can I get an update on my order?", time: "15m ago" },
                { name: "Andi Wijaya", lastMsg: "Yes, I would like to proceed.", time: "1h ago" },
                { name: "Dewi Lestari", lastMsg: "The product arrived safely.", time: "3h ago" },
              ].map((conv) => (
                <div key={conv.name} className="flex items-center gap-3 border-b border-border pb-3 last:border-0 last:pb-0">
                  <div className="avatar-initials sm h-8 w-8 flex-shrink-0">
                    {conv.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-heading">{conv.name}</p>
                    <p className="truncate text-xs text-muted-text">{conv.lastMsg}</p>
                  </div>
                  <span className="text-xs text-muted-text">{conv.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
  );
}
