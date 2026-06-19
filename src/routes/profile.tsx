import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store/app-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Calendar, DollarSign } from "lucide-react";

export default function ProfilePage() {
  const { currentUser, bookings, updateUserName } = useAppStore();
  const navigate = useNavigate();
  const [name, setName] = useState("");

  useEffect(() => {
    document.title = "Profile — CourtClub";
  }, []);

  if (!currentUser) {
    navigate("/");
    return null;
  }

  const myBookings = bookings.filter((b) => b.userId === currentUser.id);
  const confirmed = myBookings.filter((b) => b.status === "confirmed");
  const revenue = confirmed.reduce((s, b) => s + b.price, 0);

  const handleSave = () => {
    if (!name.trim()) return;
    updateUserName(name.trim());
    setName("");
  };

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="mt-1 text-muted-foreground">Manage your account and view stats.</p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 text-xl font-bold text-primary">
            {currentUser.name[0]?.toUpperCase() ?? "?"}
          </div>
          <div>
            <p className="text-lg font-semibold text-foreground">{currentUser.name}</p>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              {currentUser.role}
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <Stat icon={Calendar} label="Total bookings" value={myBookings.length} />
          <Stat icon={User} label="Confirmed" value={confirmed.length} />
          <Stat icon={DollarSign} label="Spent" value={`$${revenue}`} />
        </div>

        <div className="mt-6 border-t border-border pt-6">
          <h2 className="text-sm font-medium text-foreground">Change name</h2>
          <div className="mt-3 flex gap-2">
            <Input
              placeholder={currentUser.name}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="max-w-xs"
            />
            <Button disabled={!name.trim()} onClick={handleSave}>
              Save
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof User;
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-lg border border-border bg-muted/50 p-4">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <p className="mt-2 text-lg font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
