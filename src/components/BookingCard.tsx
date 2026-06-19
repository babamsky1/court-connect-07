import type { Booking, BookingStatus } from "@/store/app-store";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";

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

export function BookingCard({ booking, actions }: { booking: Booking; actions?: React.ReactNode }) {
  const { label, icon: StatusIcon, cls } = statusConfig[booking.status];

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            {format(new Date(booking.date), "EEEE")}
          </p>
          <h3 className="mt-1 text-lg font-semibold text-foreground">
            {format(new Date(booking.date), "d MMM yyyy")}
          </h3>
          <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            {booking.slot}
          </div>
          {booking.court && <p className="mt-0.5 text-xs text-muted-foreground">{booking.court}</p>}
        </div>
        <Badge
          variant="outline"
          className={`${cls} rounded-full px-3 py-1 text-xs font-medium gap-1`}
        >
          <StatusIcon className="h-3.5 w-3.5" />
          {label}
        </Badge>
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
        <div className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">${booking.price}</span> · {booking.userName}
        </div>
        {actions}
      </div>
    </div>
  );
}
