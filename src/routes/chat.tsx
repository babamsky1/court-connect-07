import { useEffect } from "react";
import { useAppStore } from "@/store/app-store";
import { ChatWindow } from "@/components/ChatWindow";

export default function ChatPage() {
  const { currentUser, bookings } = useAppStore();

  useEffect(() => {
    document.title = "Chat with admin — CourtClub";
  }, []);

  if (!currentUser) {
    return (
      <main className="mx-auto mt-20 max-w-md px-4 text-center">
        <h1 className="text-xl font-semibold">Sign in to chat</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Sign in to send messages to the admin about your bookings.
        </p>
      </main>
    );
  }

  if (currentUser.role === "admin") {
    return (
      <main className="mx-auto mt-20 max-w-md px-4 text-center">
        <h1 className="text-xl font-semibold">Admin chat dashboard</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage user conversations from the admin dashboard.
        </p>
      </main>
    );
  }

  const hasBookings = bookings.some((b) => b.userId === currentUser.id);

  if (!hasBookings) {
    return (
      <main className="mx-auto mt-20 max-w-md px-4 text-center">
        <h1 className="text-xl font-semibold">No bookings yet</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Book a court first, then come here to chat with the admin about
          payment or any questions.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Chat with admin</h1>
        <p className="mt-1 text-muted-foreground">
          Confirm payment details and ask any questions about your booking.
        </p>
      </div>
      <ChatWindow threadUserId={currentUser.id} threadUserName="Admin" />
    </main>
  );
}
