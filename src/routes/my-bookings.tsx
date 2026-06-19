import { createFileRoute, Link } from "@tanstack/react-router";
import { useAppStore } from "@/store/app-store";
import { BookingCard } from "@/components/BookingCard";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/my-bookings")({
  head: () => ({
    meta: [
      { title: "My bookings — CourtClub" },
      { name: "description", content: "Track the status of your court bookings." },
      { property: "og:title", content: "My bookings — CourtClub" },
      { property: "og:description", content: "Track the status of your court bookings." },
    ],
  }),
  component: MyBookingsPage,
});

function MyBookingsPage() {
  const { currentUser, bookings, updateBookingStatus } = useAppStore();

  if (!currentUser) {
    return (
      <EmptyState
        title="Sign in to view your bookings"
        description="Once you sign in, your booking history will show up here."
      />
    );
  }

  const mine = bookings.filter((b) => b.userId === currentUser.id);

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My bookings</h1>
          <p className="mt-1 text-muted-foreground">
            {mine.length} {mine.length === 1 ? "reservation" : "reservations"} on your account.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link to="/booking">+ New booking</Link>
        </Button>
      </div>

      {mine.length === 0 ? (
        <EmptyState
          title="No bookings yet"
          description="Reserve a court slot to get started."
          action={
            <Button asChild>
              <Link to="/booking">Book a slot</Link>
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {mine.map((b) => (
            <BookingCard
              key={b.id}
              booking={b}
              actions={
                b.status === "pending_payment" ? (
                  <div className="flex gap-2">
                    <Button asChild size="sm" variant="default">
                      <Link to="/chat">Pay via chat</Link>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateBookingStatus(b.id, "cancelled")}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : null
              }
            />
          ))}
        </div>
      )}
    </main>
  );
}

function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mx-auto mt-20 max-w-md rounded-xl border border-dashed border-border bg-card p-10 text-center">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}