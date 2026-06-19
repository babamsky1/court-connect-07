import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useAppStore, type BookingStatus } from "@/store/app-store";
import { BookingCard } from "@/components/BookingCard";
import { ChatWindow } from "@/components/ChatWindow";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { format } from "date-fns";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — CourtClub" },
      { name: "description", content: "Manage bookings and respond to customer messages." },
      { property: "og:title", content: "Admin — CourtClub" },
      { property: "og:description", content: "Manage bookings and respond to customer messages." },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const { currentUser, bookings, updateBookingStatus, messages } = useAppStore();
  const [activeThread, setActiveThread] = useState<string | null>(null);

  const stats = useMemo(() => {
    const counts: Record<BookingStatus, number> = {
      pending_payment: 0,
      confirmed: 0,
      cancelled: 0,
    };
    bookings.forEach((b) => counts[b.status]++);
    return counts;
  }, [bookings]);

  const threads = useMemo(() => {
    const map = new Map<string, { userName: string; lastAt: number; preview: string }>();
    for (const m of messages) {
      const prev = map.get(m.threadUserId);
      const userName = m.fromRole === "user" ? m.fromName : (prev?.userName ?? "User");
      if (!prev || prev.lastAt < m.createdAt) {
        map.set(m.threadUserId, { userName, lastAt: m.createdAt, preview: m.text });
      }
    }
    return Array.from(map.entries())
      .map(([userId, v]) => ({ userId, ...v }))
      .sort((a, b) => b.lastAt - a.lastAt);
  }, [messages]);

  if (!currentUser || currentUser.role !== "admin") {
    return (
      <main className="mx-auto mt-20 max-w-md px-4 text-center">
        <h1 className="text-xl font-semibold">Admin access required</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Sign in as Admin from the navbar to manage bookings and chats.
        </p>
      </main>
    );
  }

  const activeThreadName =
    threads.find((t) => t.userId === activeThread)?.userName ?? "User";

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Admin dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Manage reservations and respond to customer messages.
        </p>
      </div>

      <div className="mb-8 grid gap-3 sm:grid-cols-3">
        <StatCard label="Pending payment" value={stats.pending_payment} tone="accent" />
        <StatCard label="Confirmed" value={stats.confirmed} tone="primary" />
        <StatCard label="Cancelled" value={stats.cancelled} tone="muted" />
      </div>

      <Tabs defaultValue="bookings">
        <TabsList>
          <TabsTrigger value="bookings">Bookings ({bookings.length})</TabsTrigger>
          <TabsTrigger value="chats">Chats ({threads.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="bookings" className="mt-6">
          {bookings.length === 0 ? (
            <p className="rounded-lg border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
              No bookings yet.
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {bookings.map((b) => (
                <BookingCard
                  key={b.id}
                  booking={b}
                  actions={
                    b.status === "pending_payment" ? (
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => updateBookingStatus(b.id, "confirmed")}>
                          Confirm payment
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateBookingStatus(b.id, "cancelled")}
                        >
                          Reject
                        </Button>
                      </div>
                    ) : b.status === "cancelled" ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateBookingStatus(b.id, "pending_payment")}
                      >
                        Restore
                      </Button>
                    ) : null
                  }
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="chats" className="mt-6">
          <div className="grid gap-6 md:grid-cols-[280px_1fr]">
            <div className="space-y-1 rounded-xl border border-border bg-card p-2">
              {threads.length === 0 && (
                <p className="p-4 text-sm text-muted-foreground">No messages yet.</p>
              )}
              {threads.map((t) => (
                <button
                  key={t.userId}
                  onClick={() => setActiveThread(t.userId)}
                  className={`w-full rounded-lg p-3 text-left transition-colors ${
                    activeThread === t.userId ? "bg-primary/10" : "hover:bg-muted"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-foreground">{t.userName}</p>
                    <span className="text-[10px] text-muted-foreground">
                      {format(t.lastAt, "HH:mm")}
                    </span>
                  </div>
                  <p className="mt-1 truncate text-xs text-muted-foreground">{t.preview}</p>
                </button>
              ))}
            </div>

            <div>
              {activeThread ? (
                <ChatWindow threadUserId={activeThread} threadUserName={activeThreadName} />
              ) : (
                <div className="flex h-[70vh] items-center justify-center rounded-xl border border-dashed border-border bg-card text-sm text-muted-foreground">
                  Select a conversation to reply.
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
}

function StatCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "primary" | "accent" | "muted";
}) {
  const toneCls =
    tone === "primary"
      ? "bg-primary/10 text-primary"
      : tone === "accent"
        ? "bg-accent/30 text-accent-foreground"
        : "bg-muted text-muted-foreground";
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <div className="mt-2 flex items-end justify-between">
        <p className="text-3xl font-bold">{value}</p>
        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${toneCls}`}>{label}</span>
      </div>
    </div>
  );
}