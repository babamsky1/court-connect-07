import { Lock, Mail, MapPin, ShieldCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

export function Footer() {
  const navigate = useNavigate();
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
                C
              </div>
              <span className="font-semibold">CourtClub</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Make court booking simple, affordable, and reliable.
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5" /> support@courtclub.app
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5" /> Quezon City, Philippines
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold">Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => { navigate("/"); setTimeout(() => scrollToSection("about"), 100); }}
                  className="text-muted-foreground hover:text-foreground text-left"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => { navigate("/"); setTimeout(() => scrollToSection("faq"), 100); }}
                  className="text-muted-foreground hover:text-foreground text-left"
                >
                  FAQ
                </button>
              </li>
              <li>
                <Link to="/booking" className="text-muted-foreground hover:text-foreground">
                  Book a court
                </Link>
              </li>
              <li>
                <Link to="/my-bookings" className="text-muted-foreground hover:text-foreground">
                  My bookings
                </Link>
              </li>
              <li>
                <button
                  onClick={() => { navigate("/"); setTimeout(() => scrollToSection("review"), 100); }}
                  className="text-muted-foreground hover:text-foreground text-left"
                >
                  Leave a review
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold">Security & Privacy</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Lock className="h-3.5 w-3.5" /> SSL Encrypted
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5" /> Data Protected
              </li>
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
              <li>Refund Policy</li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} CourtClub PH Inc. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
