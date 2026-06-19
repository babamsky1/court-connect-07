import { useEffect, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAppStore } from "@/store/app-store";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { CheckCircle, MessageCircle, Calendar, ArrowRight, Plus } from "lucide-react";

export default function BookingConfirmationPage() {
  const { currentUser, bookings } = useAppStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    document.title = "Booking confirmed — CourtClub";
  }, []);

  if (!currentUser) {
    navigate("/booking");
    return null;
  }

  const latestBookings = useMemo(
    () =>
      bookings
        .filter((b) => b.userId === currentUser.id)
        .sort((a, b) => b.createdAt - a.createdAt)
        .slice(0, 5),
    [bookings, currentUser],
  );

  if (latestBookings.length === 0) {
    navigate("/booking");
    return null;
  }

  const created = latestBookings.filter(
    (b) => b.createdAt > Date.now() - 30000,
  );
  const display = created.length > 0 ? created : [latestBookings[0]];
  const total = display.reduce((sum, b) => sum + b.price, 0);

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <div className="rounded-xl border border-border bg-card p-8 shadow-sm text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
          <CheckCircle className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Booking confirmed!</h1>
        <p className="mt-2 text-muted-foreground">
          Your court reservation{display.length > 1 ? "s have" : " has"} been created.
        </p>

        <div className="mt-8 space-y-3 text-left">
          {display.map((b) => (
            <div
              key={b.id}
              className="flex items-center justify-between rounded-lg border border-border bg-muted/50 p-4"
            >
              <div>
                <p className="text-sm font-medium text-foreground">
                  {format(new Date(b.date), "EEE, d MMM yyyy")}
                </p>
                <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  {b.slot}
                </div>
              </div>
              <span className="text-sm font-semibold">${b.price}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between rounded-lg bg-primary/5 px-4 py-3">
          <span className="text-sm font-medium">Total</span>
          <span className="text-lg font-bold">${total}</span>
        </div>

        <div className="mt-8 space-y-3">
          <p className="text-sm text-muted-foreground">
            Next step: chat with admin to confirm payment.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Button asChild size="lg">
              <Link to="/chat">
                <MessageCircle className="mr-2 h-4 w-4" />
                Chat with admin
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/my-bookings">
                View bookings
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="ghost" size="lg">
              <Link to="/booking">
                <Plus className="mr-2 h-4 w-4" />
                Book another
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
