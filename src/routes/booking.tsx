import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { useAppStore, TIME_SLOTS, COURT_PRICE } from "@/store/app-store";
import { format } from "date-fns";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/booking")({
  head: () => ({
    meta: [
      { title: "Book a court — CourtClub" },
      { name: "description", content: "Choose your date and time slot and reserve the court." },
      { property: "og:title", content: "Book a court — CourtClub" },
      { property: "og:description", content: "Choose your date and time slot and reserve the court." },
    ],
  }),
  component: BookingPage,
});

function BookingPage() {
  const { currentUser, bookings, addBooking } = useAppStore();
  const navigate = useNavigate();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [slot, setSlot] = useState<string | null>(null);

  const dateStr = date ? format(date, "yyyy-MM-dd") : null;

  const takenSlots = useMemo(
    () =>
      new Set(
        bookings
          .filter((b) => b.date === dateStr && b.status !== "cancelled")
          .map((b) => b.slot),
      ),
    [bookings, dateStr],
  );

  const handleConfirm = () => {
    if (!currentUser) {
      toast.error("Please sign in to book a slot.");
      return;
    }
    if (currentUser.role !== "user") {
      toast.error("Switch to a user account to make a booking.");
      return;
    }
    if (!dateStr || !slot) return;
    addBooking({
      userId: currentUser.id,
      userName: currentUser.name,
      date: dateStr,
      slot,
      price: COURT_PRICE,
    });
    toast.success("Booking created. Chat with admin to confirm payment.");
    navigate({ to: "/my-bookings" });
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <Toaster />
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Reserve the court</h1>
        <p className="mt-1 text-muted-foreground">
          Pick a date, then choose an available time slot.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[auto_1fr]">
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm h-fit">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(d) => {
              setDate(d);
              setSlot(null);
            }}
            disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
            className="pointer-events-auto"
          />
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                Selected date
              </p>
              <h2 className="mt-1 text-xl font-semibold">
                {date ? format(date, "EEEE, d MMMM yyyy") : "Pick a date"}
              </h2>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Price</p>
              <p className="mt-1 text-xl font-semibold">${COURT_PRICE}</p>
            </div>
          </div>

          <div className="mt-6">
            <p className="mb-3 text-sm font-medium text-foreground">Available slots</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
              {TIME_SLOTS.map((s) => {
                const taken = takenSlots.has(s);
                const selected = slot === s;
                return (
                  <button
                    key={s}
                    type="button"
                    disabled={taken}
                    onClick={() => setSlot(s)}
                    className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                      taken
                        ? "cursor-not-allowed border-border bg-muted text-muted-foreground line-through"
                        : selected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background hover:border-primary hover:bg-primary/10"
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
            <p className="text-sm text-muted-foreground">
              {slot ? (
                <>
                  Reserving <span className="font-medium text-foreground">{slot}</span> on{" "}
                  <span className="font-medium text-foreground">
                    {date && format(date, "d MMM")}
                  </span>
                </>
              ) : (
                "Select a time slot to continue."
              )}
            </p>
            <Button size="lg" disabled={!slot || !date} onClick={handleConfirm}>
              Confirm booking
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}