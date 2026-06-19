import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useAppStore, TIME_SLOTS, COURTS, COURT_PRICE } from "@/store/app-store";
import { format } from "date-fns";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, CalendarDays, MessageCircle, CreditCard, ShieldCheck } from "lucide-react";

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

const steps = [
  { label: "Pick slots", icon: CalendarDays },
  { label: "Confirm", icon: CreditCard },
  { label: "Chat & pay", icon: MessageCircle },
];

export default function BookingPage() {
  const { currentUser, bookings, addBooking, login } = useAppStore();
  const navigate = useNavigate();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedSlots, setSelectedSlots] = useState<Set<string>>(new Set());
  const [courtId, setCourtId] = useState(COURTS[0].id);
  const [isLoading, setIsLoading] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);
  const [signInName, setSignInName] = useState("");

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

  const handleConfirm = async () => {
    if (!currentUser) {
      setSignInOpen(true);
      return;
    }
    if (currentUser.role !== "user") {
      toast.error("Switch to a user account to make a booking.");
      return;
    }
    if (!dateStr || selectedSlots.size === 0) return;
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    for (const { range, hours } of mergedRanges) {
      addBooking({
        userId: currentUser.id,
        userName: currentUser.name,
        date: dateStr,
        slot: range,
        price: COURT_PRICE * hours,
        court: courtId,
      });
    }
    setIsLoading(false);
    const count = mergedRanges.length;
    toast.success(
      `${count} ${count === 1 ? "booking" : "bookings"} created. Chat with admin to confirm payment.`,
      { action: { label: "View", onClick: () => navigate("/my-bookings") } },
    );
    navigate("/booking/confirmation");
  };

  const currentStep = isLoading ? 2 : selectedSlots.size > 0 ? 1 : 0;

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <Toaster />
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Reserve the court</h1>
        <p className="mt-1 text-muted-foreground">
          Pick a date, choose a court, then select one or more time slots.
        </p>
      </div>

      <div className="mb-8 flex items-center justify-center gap-0">
        {steps.map((step, i) => {
          const StepIcon = step.icon;
          const active = i <= currentStep;
          return (
            <div key={step.label} className="flex items-center">
              <div
                className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                <StepIcon className="h-3.5 w-3.5" />
                {step.label}
              </div>
              {i < steps.length - 1 && (
                <div className={`mx-2 h-px w-8 ${active ? "bg-primary" : "bg-border"}`} />
              )}
            </div>
          );
        })}
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
              <p className="mt-1 text-xl font-semibold">${COURT_PRICE}/hr</p>
            </div>
          </div>

          <div className="mt-4">
            <label className="text-xs uppercase tracking-wider text-muted-foreground">Court</label>
            <Select value={courtId} onValueChange={setCourtId}>
              <SelectTrigger className="mt-1 w-full sm:w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {COURTS.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    <span className="font-medium">{c.name}</span>
                    <span className="ml-2 text-xs text-muted-foreground">{c.desc}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="mt-6">
            <p className="mb-3 text-sm font-medium text-foreground">Available slots</p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {TIME_SLOTS.map((s) => {
                if (s === "__LUNCH__") {
                  return (
                    <div
                      key="lunch"
                      className="col-span-full flex items-center gap-2 py-1"
                    >
                      <span className="h-px flex-1 bg-border" />
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Lunch break
                      </span>
                      <span className="h-px flex-1 bg-border" />
                    </div>
                  );
                }
                const taken = takenSlots.has(s);
                const selected = selectedSlots.has(s);
                return (
                  <button
                    key={s}
                    type="button"
                    disabled={taken}
                    onClick={() => toggleSlot(s)}
                    className={`rounded-lg border py-3 px-3 text-sm font-medium transition-colors ${
                      taken
                        ? "cursor-not-allowed border-border bg-muted text-muted-foreground/50 line-through"
                        : selected
                          ? "border-primary bg-primary text-primary-foreground shadow-sm"
                          : "border-border bg-background hover:border-primary hover:bg-primary/20 active:bg-primary/10"
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
            <Button
              size="lg"
              disabled={selectedSlots.size === 0 || !date || isLoading}
              onClick={handleConfirm}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirm booking{mergedRanges.length > 1 ? "s" : ""}
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-2xl rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center text-sm dark:border-emerald-800 dark:bg-emerald-950/20">
        <ShieldCheck className="mx-auto h-5 w-5 text-emerald-600 dark:text-emerald-400" />
        <p className="mt-1 font-medium text-emerald-800 dark:text-emerald-300">Protected Booking</p>
        <p className="text-emerald-600 dark:text-emerald-400">
          Your booking is protected by our money-back guarantee. If something goes wrong, we'll fix it or refund you within 24 hours.
        </p>
      </div>

      <Dialog open={signInOpen} onOpenChange={setSignInOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign in to book</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Label htmlFor="booking-signin-name">Your name</Label>
            <Input
              id="booking-signin-name"
              placeholder="e.g. Alex"
              value={signInName}
              onChange={(e) => setSignInName(e.target.value)}
            />
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setSignInOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={!signInName.trim()}
              onClick={() => {
                login(signInName.trim(), "user");
                setSignInOpen(false);
                setSignInName("");
              }}
            >
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
