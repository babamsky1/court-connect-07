import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/app-store";
import { format } from "date-fns";
import { Send } from "lucide-react";

export function ChatWindow({
  threadUserId,
  threadUserName,
}: {
  threadUserId: string;
  threadUserName: string;
}) {
  const { currentUser, getThread, sendMessage } = useAppStore();
  const messages = useAppStore((s) =>
    s.messages
      .filter((m) => m.threadUserId === threadUserId)
      .sort((a, b) => a.createdAt - b.createdAt),
  );
  const [text, setText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  if (!currentUser) return null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    sendMessage(threadUserId, text);
    setText("");
  };

  return (
    <div className="flex h-[70vh] flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-center gap-3 border-b border-border px-5 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 font-semibold text-primary">
          {threadUserName[0]?.toUpperCase() ?? "?"}
        </div>
        <div>
          <p className="font-medium text-foreground">{threadUserName}</p>
          <p className="text-xs text-muted-foreground">
            {currentUser.role === "admin" ? "Customer thread" : "Talk with admin about payment"}
          </p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-muted/30 p-5">
        {messages.length === 0 && (
          <div className="flex h-full items-center justify-center text-center">
            <p className="text-sm text-muted-foreground">
              No messages yet. Send the first one to start the conversation.
            </p>
          </div>
        )}
        {messages.map((m) => {
          const mine = m.fromRole === currentUser.role;
          return (
            <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[75%] ${mine ? "items-end" : "items-start"} flex flex-col`}>
                <div
                  className={`rounded-2xl px-4 py-2 text-sm leading-relaxed ${
                    mine
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-card border border-border text-foreground rounded-bl-sm"
                  }`}
                >
                  {m.text}
                </div>
                <span className="mt-1 px-1 text-[10px] uppercase tracking-wide text-muted-foreground">
                  {m.fromName} · {format(m.createdAt, "HH:mm")}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <form onSubmit={submit} className="flex items-center gap-2 border-t border-border p-3">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message…"
          className="flex-1"
        />
        <Button type="submit" size="icon" disabled={!text.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
