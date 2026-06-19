import { useEffect, useState, useMemo } from "react";
import { useAppStore, type BookingStatus } from "@/store/app-store";
import { BookingCard } from "@/components/BookingCard";
import { ChatWindow } from "@/components/ChatWindow";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { format } from "date-fns";
import { toast } from "sonner";
import { DollarSign, TrendingUp, CalendarCheck, AlertTriangle } from "lucide-react";

export default function AdminPage() {
  const { currentUser, bookings, updateBookingStatus, messages, lastReadTimestamps } = useAppStore();
  const [activeThread, setActiveThread] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [rejectId, setRejectId] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Admin — CourtClub";
  }, []);

  const unreadCount = useMemo(
    () => messages.filter(
      (m) => m.fromRole !== "admin" && m.createdAt > (lastReadTimestamps[m.threadUserId] ?? 0),
    ).length,
    [messages, lastReadTimestamps],
  );

  const stats = useMemo(() => {
    const counts: Record<BookingStatus, number> = {
      pending_payment: 0,
      confirmed: 0,
      cancelled: 0,
    };
    let revenue = 0;
    bookings.forEach((b) => {
      counts[b.status]++;
      if (b.status === "confirmed") revenue += b.price;
    });
    return { ...counts, revenue, total: bookings.length };
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

  const confirmPayment = () => {
    if (confirmId) {
      updateBookingStatus(confirmId, "confirmed");
      setConfirmId(null);
    }
  };

  const confirmReject = () => {
    if (rejectId) {
      updateBookingStatus(rejectId, "cancelled");
      setRejectId(null);
    }
  };

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

  const activeThreadName = threads.find((t) => t.userId === activeThread)?.userName ?? "User";

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Admin dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Manage reservations and respond to customer messages.
        </p>
      </div>

      <div className="mb-8 grid gap-3 sm:grid-cols-4">
        <MetricCard
          icon={CalendarCheck}
          label="Total bookings"
          value={stats.total}
          sub="All time"
        />
        <MetricCard
          icon={DollarSign}
          label="Revenue"
          value={`$${stats.revenue}`}
          sub="Confirmed only"
        />
        <MetricCard
          icon={AlertTriangle}
          label="Pending"
          value={stats.pending_payment}
          sub="Awaiting payment"
          highlight
        />
        <MetricCard icon={TrendingUp} label="Confirmed" value={stats.confirmed} sub="Completed" />
      </div>

      <Tabs defaultValue="bookings">
        <TabsList>
          <TabsTrigger value="bookings">Bookings ({bookings.length})</TabsTrigger>
          <TabsTrigger value="chats" className="relative">
            Chats ({threads.length})
            {unreadCount > 0 && (
              <span className="ml-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1.5 text-[10px] font-bold text-destructive-foreground">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </TabsTrigger>
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
                        <Dialog
                          open={confirmId === b.id}
                          onOpenChange={(open) => !open && setConfirmId(null)}
                        >
                          <DialogTrigger asChild>
                            <Button size="sm" onClick={() => setConfirmId(b.id)}>
                              Confirm payment
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Confirm payment?</DialogTitle>
                              <DialogDescription>
                                This will mark {b.userName}'s {b.slot} booking as confirmed and paid.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter className="gap-2">
                              <Button variant="outline" onClick={() => setConfirmId(null)}>
                                Cancel
                              </Button>
                              <Button onClick={confirmPayment}>
                                Yes, confirm
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <Dialog
                          open={rejectId === b.id}
                          onOpenChange={(open) => !open && setRejectId(null)}
                        >
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline" onClick={() => setRejectId(b.id)}>
                              Reject
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Reject booking?</DialogTitle>
                              <DialogDescription>
                                This will cancel {b.userName}'s {b.slot} booking.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter className="gap-2">
                              <Button variant="outline" onClick={() => setRejectId(null)}>
                                Keep
                              </Button>
                              <Button variant="destructive" onClick={confirmReject}>
                                Yes, reject
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    ) : b.status === "cancelled" ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          updateBookingStatus(b.id, "pending_payment");
                          toast.success("Booking restored to pending.");
                        }}
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
                <div className="flex h-[50vh] sm:h-[70vh] items-center justify-center rounded-xl border border-dashed border-border bg-card text-sm text-muted-foreground">
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

function MetricCard({
  icon: Icon,
  label,
  value,
  sub,
  highlight,
}: {
  icon: typeof DollarSign;
  label: string;
  value: string | number;
  sub: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg ${
            highlight
              ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
              : "bg-primary/10 text-primary"
          }`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-[10px] text-muted-foreground">{sub}</p>
        </div>
      </div>
    </div>
  );
}
