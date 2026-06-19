import { Link, useNavigate } from "@tanstack/react-router";
import { useAppStore } from "@/store/app-store";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function Navbar() {
  const { currentUser, login, logout } = useAppStore();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  const linkCls =
    "px-3 py-2 rounded-md text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-secondary transition-colors";
  const activeCls = "text-foreground bg-secondary";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
            C
          </div>
          <span className="font-semibold tracking-tight">CourtClub</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <Link to="/" className={linkCls} activeProps={{ className: activeCls }} activeOptions={{ exact: true }}>
            Home
          </Link>
          <Link to="/booking" className={linkCls} activeProps={{ className: activeCls }}>
            Book
          </Link>
          {currentUser?.role === "user" && (
            <>
              <Link to="/my-bookings" className={linkCls} activeProps={{ className: activeCls }}>
                My Bookings
              </Link>
              <Link to="/chat" className={linkCls} activeProps={{ className: activeCls }}>
                Chat
              </Link>
            </>
          )}
          {currentUser?.role === "admin" && (
            <Link to="/admin" className={linkCls} activeProps={{ className: activeCls }}>
              Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {currentUser ? (
            <>
              <span className="hidden sm:inline text-sm text-muted-foreground">
                {currentUser.name}
                <span className="ml-1 text-xs uppercase tracking-wide text-primary">
                  · {currentUser.role}
                </span>
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  logout();
                  navigate({ to: "/" });
                }}
              >
                Sign out
              </Button>
            </>
          ) : (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size="sm">Sign in</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Sign in</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  <Label htmlFor="name">Your name</Label>
                  <Input
                    id="name"
                    placeholder="e.g. Alex"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <DialogFooter className="gap-2 sm:gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      login("Admin", "admin");
                      setOpen(false);
                      navigate({ to: "/admin" });
                    }}
                  >
                    Sign in as Admin
                  </Button>
                  <Button
                    disabled={!name.trim()}
                    onClick={() => {
                      login(name.trim(), "user");
                      setOpen(false);
                      setName("");
                      navigate({ to: "/booking" });
                    }}
                  >
                    Continue
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </header>
  );
}