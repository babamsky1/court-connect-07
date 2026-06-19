import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAppStore, type BookingStatus } from "@/store/app-store";
import { AlertCircle, Calendar, CalendarX, CheckCircle, Clock, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const statusConfig: Record<BookingStatus, { label: string; icon: typeof Clock; cls: string }> = {
  pending_payment: {
    label: "Pending payment",
    icon: AlertCircle,
    cls: "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-700",
  },
  confirmed: {
    label: "Confirmed",
    icon: CheckCircle,
    cls: "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-700",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    cls: "bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700",
  },
};

const tabs: { label: string; value: BookingStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending_payment" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Cancelled", value: "cancelled" },
];

export default function MyBookingsPage() {
  const { currentUser, bookings, updateBookingStatus } = useAppStore();
  const [filter, setFilter] = useState<BookingStatus | "all">("all");
  const [cancelId, setCancelId] = useState<string | null>(null);

  useEffect(() => {
    document.title = "My bookings — CourtClub";
  }, []);

  if (!currentUser) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="Sign in to view your bookings"
        description="Once you sign in, your booking history will show up here."
      />
    );
  }

  const mine = bookings
    .filter((b) => b.userId === currentUser.id)
    .filter((b) => filter === "all" || b.status === filter);

  const confirmCancel = () => {
    if (cancelId) {
      updateBookingStatus(cancelId, "cancelled");
      setCancelId(null);
    }
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My bookings</h1>
          <p className="mt-1 text-muted-foreground">
            {mine.length} {mine.length === 1 ? "reservation" : "reservations"}
          </p>
        </div>
        <Button asChild variant="outline">
          <Link to="/booking">+ New booking</Link>
        </Button>
      </div>

      <div className="mb-6 flex gap-1 rounded-lg bg-muted p-1 w-fit">
        {tabs.map((t) => (
          <button
            key={t.value}
            onClick={() => setFilter(t.value)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              filter === t.value
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {mine.length === 0 ? (
        <EmptyState
          icon={CalendarX}
          title="No bookings yet"
          description={
            filter === "all"
              ? "Reserve a court slot to get started."
              : `No ${filter.replace("_", " ")} bookings found.`
          }
          action={
            <Button asChild>
              <Link to="/booking">Book a slot</Link>
            </Button>
          }
        />
      ) : (
        <div className="rounded-xl border border-border bg-card shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Court</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mine.map((b) => {
                const { label, icon: StatusIcon, cls } = statusConfig[b.status];
                return (
                  <TableRow key={b.id}>
                    <TableCell className="font-medium">{formatDate(b.date)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                        {b.slot}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {b.court ?? "—"}
                    </TableCell>
                    <TableCell className="font-medium">${b.price}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`${cls} rounded-full px-3 py-1 text-xs font-medium gap-1`}
                      >
                        <StatusIcon className="h-3.5 w-3.5" />
                        {label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {b.status === "pending_payment" ? (
                        <div className="flex justify-end gap-2">
                          <Button asChild size="sm" variant="default">
                            <Link to="/chat">Pay via chat</Link>
                          </Button>
                          <Dialog
                            open={cancelId === b.id}
                            onOpenChange={(open) => !open && setCancelId(null)}
                          >
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline" onClick={() => setCancelId(b.id)}>
                                Cancel
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Cancel booking?</DialogTitle>
                                <DialogDescription>
                                  This will cancel your {b.slot} booking on {formatDate(b.date)}.
                                  his This action can be undone by an admin.
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter className="gap-2">
                                <Button variant="outline" onClick={() => setCancelId(null)}>
                                  Keep booking
                                </Button>
                                <Button variant="destructive" onClick={confirmCancel}>
                                  Yes, cancel
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </main>
  );
}

function formatDay(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", { weekday: "short" });
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: typeof Calendar;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mx-auto mt-20 max-w-md rounded-xl border border-dashed border-border bg-card p-10 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        <Icon className="h-6 w-6 text-muted-foreground" />
      </div>
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
