import type { Booking, BookingStatus } from "@/store/app-store";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

const statusStyles: Record<BookingStatus, string> = {
  pending_payment: "bg-accent/30 text-accent-foreground border-accent",
  confirmed: "bg-primary/15 text-primary border-primary/30",
  cancelled: "bg-destructive/15 text-destructive border-destructive/30",
};

const statusLabel: Record<BookingStatus, string> = {
  pending_payment: "Pending payment",
  confirmed: "Confirmed",
  cancelled: "Cancelled",
};

export function BookingCard({ booking, actions }: { booking: Booking; actions?: React.ReactNode }) {
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
          <p className="mt-0.5 text-sm text-muted-foreground">{booking.slot}</p>
        </div>
        <Badge
          variant="outline"
          className={`${statusStyles[booking.status]} rounded-full px-3 py-1 text-xs font-medium`}
        >
          {statusLabel[booking.status]}
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
