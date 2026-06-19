import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { useAppStore, TIME_SLOTS, COURT_PRICE } from "@/store/app-store";
import { format } from "date-fns";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

function mergeConsecutive(slots: string[]): { range: string; hours: number }[] {
  if (slots.length === 0) return [];
  const sorted = [...slots].sort();
  const result: { range: string; hours: number }[] = [];
  let [start, end] = sorted[0].split(" - ");
  let hours = 1;
  for (let i = 1; i < sorted.length; i++) {
    const [s, e] = sorted[i].split(" - ");
    if (s === end) {
      end = e;
      hours++;
    } else {
      result.push({ range: `${start} - ${end}`, hours });
      start = s;
      end = e;
      hours = 1;
    }
  }
  result.push({ range: `${start} - ${end}`, hours });
  return result;
}

export default function BookingPage() {
  const { currentUser, bookings, addBooking } = useAppStore();
  const navigate = useNavigate();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedSlots, setSelectedSlots] = useState<Set<string>>(new Set());

  useEffect(() => {
    document.title = "Book a court — CourtClub";
  }, []);

  const dateStr = date ? format(date, "yyyy-MM-dd") : null;

  const takenSlots = useMemo(
    () =>
      new Set(
        bookings.filter((b) => b.date === dateStr && b.status !== "cancelled").map((b) => b.slot),
      ),
    [bookings, dateStr],
  );

  const toggleSlot = (s: string) => {
    setSelectedSlots((prev) => {
      const next = new Set(prev);
      if (next.has(s)) next.delete(s);
      else next.add(s);
      return next;
    });
  };

  const sortedSelected = [...selectedSlots].sort();

  const mergedRanges = useMemo(() => mergeConsecutive(sortedSelected), [sortedSelected]);

  const totalHours = sortedSelected.length;

  const handleConfirm = () => {
    if (!currentUser) {
      toast.error("Please sign in to book a slot.");
      return;
    }
    if (currentUser.role !== "user") {
      toast.error("Switch to a user account to make a booking.");
      return;
    }
    if (!dateStr || selectedSlots.size === 0) return;
    for (const { range, hours } of mergedRanges) {
      addBooking({
        userId: currentUser.id,
        userName: currentUser.name,
        date: dateStr,
        slot: range,
        price: COURT_PRICE * hours,
      });
    }
    const count = mergedRanges.length;
    toast.success(
      `${count} ${count === 1 ? "booking" : "bookings"} created. Chat with admin to confirm payment.`,
    );
    navigate("/my-bookings");
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <Toaster />
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Reserve the court</h1>
        <p className="mt-1 text-muted-foreground">
          Pick a date, then choose one or more time slots.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[auto_1fr]">
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm h-fit">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(d) => {
              setDate(d);
              setSelectedSlots(new Set());
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
                const selected = selectedSlots.has(s);
                return (
                  <button
                    key={s}
                    type="button"
                    disabled={taken}
                    onClick={() => toggleSlot(s)}
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
              {totalHours > 0 ? (
                <>
                  <span className="font-medium text-foreground">{totalHours}h</span> ($
                  {COURT_PRICE * totalHours}) on{" "}
                  <span className="font-medium text-foreground">
                    {date && format(date, "d MMM yyyy")}
                  </span>
                  <span className="block mt-1 text-xs">
                    {mergedRanges.map((r) => `${r.range} (${r.hours}h)`).join(", ")}
                  </span>
                </>
              ) : (
                "Select one or more slots to continue."
              )}
            </p>
            <Button size="lg" disabled={selectedSlots.size === 0 || !date} onClick={handleConfirm}>
              Confirm booking{mergedRanges.length > 1 ? "s" : ""}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
