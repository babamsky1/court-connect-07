import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { CalendarDays, MessageCircle, ShieldCheck, Clock } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CourtClub — Book your court in seconds" },
      { name: "description", content: "Pick a date, grab a slot, and we'll confirm your booking over chat." },
      { property: "og:title", content: "CourtClub — Book your court in seconds" },
      { property: "og:description", content: "Pick a date, grab a slot, and we'll confirm your booking over chat." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 lg:grid-cols-2 lg:py-28">
          <div className="flex flex-col justify-center">
            <span className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-primary" />
              Court available today
            </span>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Reserve your court in seconds.
            </h1>
            <p className="mt-5 max-w-lg text-lg text-muted-foreground">
              Pick a date, choose a time slot, and finalize payment over chat with our admin team. Simple, fast, and reliable.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/booking">Book a slot</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/my-bookings">My bookings</Link>
              </Button>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-4 max-w-md">
              <Stat label="Open" value="7 — 21h" />
              <Stat label="Price" value="$25/hr" />
              <Stat label="Court" value="Indoor" />
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-tr from-primary/20 to-accent/20 blur-2xl" />
            <div className="rounded-3xl border border-border bg-card p-8 shadow-xl">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Court A · Premium
              </h3>
              <p className="mt-2 text-2xl font-semibold">Indoor hardwood · climate controlled</p>
              <ul className="mt-6 space-y-3 text-sm">
                <Feature icon={<Clock className="h-4 w-4" />} text="60-minute booking slots" />
                <Feature icon={<CalendarDays className="h-4 w-4" />} text="Reserve up to 30 days ahead" />
                <Feature icon={<MessageCircle className="h-4 w-4" />} text="Live chat for payment confirmation" />
                <Feature icon={<ShieldCheck className="h-4 w-4" />} text="Admin-verified bookings" />
              </ul>
              <div className="mt-8 rounded-xl bg-muted p-4 text-sm">
                <p className="font-medium text-foreground">How it works</p>
                <ol className="mt-2 list-decimal space-y-1 pl-5 text-muted-foreground">
                  <li>Sign in with your name</li>
                  <li>Pick a date &amp; slot</li>
                  <li>Message admin to confirm payment</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 font-semibold text-foreground">{value}</p>
    </div>
  );
}

function Feature({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <li className="flex items-center gap-3 text-foreground">
      <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/15 text-primary">
        {icon}
      </span>
      {text}
    </li>
  );
}
