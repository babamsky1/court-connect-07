import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Role = "user" | "admin";
export type BookingStatus = "pending_payment" | "confirmed" | "cancelled";

export interface User {
  id: string;
  name: string;
  role: Role;
}

export interface Booking {
  id: string;
  userId: string;
  userName: string;
  date: string; // yyyy-MM-dd
  slot: string; // "08:00 - 09:00"
  status: BookingStatus;
  createdAt: number;
  price: number;
}

export interface Message {
  id: string;
  threadUserId: string; // the non-admin user id this thread belongs to
  fromRole: Role;
  fromName: string;
  text: string;
  createdAt: number;
}

interface AppState {
  currentUser: User | null;
  bookings: Booking[];
  messages: Message[];
  login: (name: string, role: Role) => void;
  logout: () => void;
  addBooking: (b: Omit<Booking, "id" | "createdAt" | "status">) => Booking;
  updateBookingStatus: (id: string, status: BookingStatus) => void;
  sendMessage: (threadUserId: string, text: string) => void;
  getThread: (userId: string) => Message[];
  listUserThreads: () => { userId: string; userName: string; last: Message }[];
}

const uid = () => Math.random().toString(36).slice(2, 10);

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      bookings: [],
      messages: [],
      login: (name, role) =>
        set({
          currentUser: {
            id: role === "admin" ? "admin" : `user-${name.toLowerCase().replace(/\s+/g, "-")}`,
            name,
            role,
          },
        }),
      logout: () => set({ currentUser: null }),
      addBooking: (b) => {
        const booking: Booking = {
          ...b,
          id: uid(),
          status: "pending_payment",
          createdAt: Date.now(),
        };
        set({ bookings: [booking, ...get().bookings] });
        return booking;
      },
      updateBookingStatus: (id, status) =>
        set({
          bookings: get().bookings.map((b) => (b.id === id ? { ...b, status } : b)),
        }),
      sendMessage: (threadUserId, text) => {
        const user = get().currentUser;
        if (!user || !text.trim()) return;
        const msg: Message = {
          id: uid(),
          threadUserId,
          fromRole: user.role,
          fromName: user.name,
          text: text.trim(),
          createdAt: Date.now(),
        };
        set({ messages: [...get().messages, msg] });
      },
      getThread: (userId) =>
        get()
          .messages.filter((m) => m.threadUserId === userId)
          .sort((a, b) => a.createdAt - b.createdAt),
      listUserThreads: () => {
        const map = new Map<string, { userName: string; last: Message }>();
        for (const m of get().messages) {
          const existing = map.get(m.threadUserId);
          if (!existing || existing.last.createdAt < m.createdAt) {
            map.set(m.threadUserId, {
              userName: m.fromRole === "user" ? m.fromName : (existing?.userName ?? "User"),
              last: m,
            });
          }
        }
        return Array.from(map.entries()).map(([userId, v]) => ({
          userId,
          userName: v.userName,
          last: v.last,
        }));
      },
    }),
    { name: "court-app-store" },
  ),
);

export const TIME_SLOTS = [
  "07:00 - 08:00",
  "08:00 - 09:00",
  "09:00 - 10:00",
  "10:00 - 11:00",
  "11:00 - 12:00",
  "13:00 - 14:00",
  "14:00 - 15:00",
  "15:00 - 16:00",
  "16:00 - 17:00",
  "17:00 - 18:00",
  "18:00 - 19:00",
  "19:00 - 20:00",
  "20:00 - 21:00",
];

export const COURT_PRICE = 25;
