import { Link, useNavigate, NavLink } from "react-router-dom";
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
          <NavLink
            to="/"
            end
            className={({ isActive }) => `${linkCls} ${isActive ? activeCls : ""}`}
          >
            Home
          </NavLink>
          <NavLink
            to="/booking"
            className={({ isActive }) => `${linkCls} ${isActive ? activeCls : ""}`}
          >
            Book
          </NavLink>
          {currentUser?.role === "user" && (
            <>
              <NavLink
                to="/my-bookings"
                className={({ isActive }) => `${linkCls} ${isActive ? activeCls : ""}`}
              >
                My Bookings
              </NavLink>
              <NavLink
                to="/chat"
                className={({ isActive }) => `${linkCls} ${isActive ? activeCls : ""}`}
              >
                Chat
              </NavLink>
            </>
          )}
          {currentUser?.role === "admin" && (
            <NavLink
              to="/admin"
              className={({ isActive }) => `${linkCls} ${isActive ? activeCls : ""}`}
            >
              Admin
            </NavLink>
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
                  navigate("/");
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
                      navigate("/admin");
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
                      navigate("/booking");
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
