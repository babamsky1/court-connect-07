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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Menu } from "lucide-react";

export function Navbar() {
  const { currentUser, login, logout, getUnreadCount } = useAppStore();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const unread = currentUser ? getUnreadCount(currentUser.id, currentUser.role) : 0;

  const linkCls =
    "px-3 py-2 rounded-md text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-secondary transition-colors";
  const activeCls = "text-foreground bg-secondary";

  const mobileLinkCls =
    "flex w-full rounded-md px-3 py-2 text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-secondary transition-colors";
  const mobileActiveCls = "text-foreground bg-secondary";

  const closeMobile = () => setMobileOpen(false);

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
                {unread > 0 && (
                  <span className="ml-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1.5 text-[10px] font-bold text-destructive-foreground">
                    {unread > 9 ? "9+" : unread}
                  </span>
                )}
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
          {currentUser && (
            <NavLink
              to="/profile"
              className={({ isActive }) => `${linkCls} ${isActive ? activeCls : ""}`}
            >
              Profile
            </NavLink>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>CourtClub</SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-1">
                <SheetClose asChild>
                  <NavLink
                    to="/"
                    end
                    onClick={closeMobile}
                    className={({ isActive }) =>
                      `${mobileLinkCls} ${isActive ? mobileActiveCls : ""}`
                    }
                  >
                    Home
                  </NavLink>
                </SheetClose>
                <SheetClose asChild>
                  <NavLink
                    to="/booking"
                    onClick={closeMobile}
                    className={({ isActive }) =>
                      `${mobileLinkCls} ${isActive ? mobileActiveCls : ""}`
                    }
                  >
                    Book
                  </NavLink>
                </SheetClose>
                {currentUser?.role === "user" && (
                  <>
                    <SheetClose asChild>
                      <NavLink
                        to="/my-bookings"
                        onClick={closeMobile}
                        className={({ isActive }) =>
                          `${mobileLinkCls} ${isActive ? mobileActiveCls : ""}`
                        }
                      >
                        My Bookings
                      </NavLink>
                    </SheetClose>
                    <SheetClose asChild>
                      <NavLink
                        to="/chat"
                        onClick={closeMobile}
                        className={({ isActive }) =>
                          `${mobileLinkCls} ${isActive ? mobileActiveCls : ""}`
                        }
                      >
                        <span className="flex items-center gap-2">
                          Chat
                          {unread > 0 && (
                            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1.5 text-[10px] font-bold text-destructive-foreground">
                              {unread > 9 ? "9+" : unread}
                            </span>
                          )}
                        </span>
                      </NavLink>
                    </SheetClose>
                  </>
                )}
                {currentUser?.role === "admin" && (
                  <SheetClose asChild>
                    <NavLink
                      to="/admin"
                      onClick={closeMobile}
                      className={({ isActive }) =>
                        `${mobileLinkCls} ${isActive ? mobileActiveCls : ""}`
                      }
                    >
                      Admin
                    </NavLink>
                  </SheetClose>
                )}
                {currentUser && (
                  <SheetClose asChild>
                    <NavLink
                      to="/profile"
                      onClick={closeMobile}
                      className={({ isActive }) =>
                        `${mobileLinkCls} ${isActive ? mobileActiveCls : ""}`
                      }
                    >
                      Profile
                    </NavLink>
                  </SheetClose>
                )}
              </nav>
              <div className="mt-6 border-t border-border pt-4">
                {currentUser ? (
                  <div className="space-y-3 px-3">
                    <p className="text-sm text-muted-foreground">
                      Signed in as{" "}
                      <span className="font-medium text-foreground">{currentUser.name}</span>
                      <span className="ml-1 text-xs uppercase tracking-wide text-primary">
                        · {currentUser.role}
                      </span>
                    </p>
                    <SheetClose asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          logout();
                          navigate("/");
                        }}
                      >
                        Sign out
                      </Button>
                    </SheetClose>
                  </div>
                ) : (
                  <div className="space-y-2 px-3">
                    <SheetClose asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          login("Admin", "admin");
                          navigate("/admin");
                        }}
                      >
                        Sign in as Admin
                      </Button>
                    </SheetClose>
                    <p className="text-xs text-center text-muted-foreground">
                      <SheetClose asChild>
                        <Link to="/booking" className="underline hover:text-foreground">
                          Continue as guest
                        </Link>
                      </SheetClose>
                    </p>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>

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
