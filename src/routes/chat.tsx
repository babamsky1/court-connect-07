import { createFileRoute } from "@tanstack/react-router";
import { useAppStore } from "@/store/app-store";
import { ChatWindow } from "@/components/ChatWindow";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "Chat with admin — CourtClub" },
      { name: "description", content: "Coordinate payment confirmation with the admin team." },
      { property: "og:title", content: "Chat with admin — CourtClub" },
      { property: "og:description", content: "Coordinate payment confirmation with the admin team." },
    ],
  }),
  component: ChatPage,
});

function ChatPage() {
  const { currentUser } = useAppStore();

  if (!currentUser || currentUser.role !== "user") {
    return (
      <main className="mx-auto mt-20 max-w-md px-4 text-center">
        <h1 className="text-xl font-semibold">Sign in as a user to chat</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Admins can manage threads from the admin dashboard.
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