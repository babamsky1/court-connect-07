import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/app-store";
import {
  ArrowRight,
  CheckCircle,
  Clock,
  Flame,
  Lock,
  MapPin,
  Send,
  ShieldCheck,
  Star,
  Trophy,
  Users,
  Zap,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const faqs = [
  {
    q: "How do I book a court?",
    a: "Sign in with your name, pick a date and time slot, select your preferred court, and submit your booking. Then chat with our admin team to confirm payment.",
  },
  {
    q: "How do I pay?",
    a: "Payment is handled manually through chat with our admin team after you submit a booking. They'll guide you through the payment process.",
  },
  {
    q: "What if the court is locked when I arrive?",
    a: "Contact our admin team through the chat. They'll let you in within 10 minutes.",
  },
  {
    q: "Can I reschedule if I can't make it?",
    a: "Yes! You can reschedule free of charge up to 24 hours before your booking. Contact us through the chat to arrange a new time.",
  },
  {
    q: "What if someone else is using my reserved court?",
    a: "Immediately notify admin through the chat. They'll resolve the situation or refund you.",
  },
  {
    q: "Are courts maintained regularly?",
    a: "Yes. Daily cleaning, weekly deep cleaning, and quarterly refinishing to ensure the best playing experience.",
  },
  {
    q: "What is your cancellation policy?",
    a: "Cancel 24+ hours before for a full refund, 6-24 hours before for 50% refund, and less than 6 hours before no refund is available. No-shows are not refunded.",
  },
  {
    q: "Is my data safe?",
    a: "Absolutely. Our site uses SSL encryption to protect your data. We never share your personal information with third parties.",
  },
];

export default function Index() {
  const { currentUser, bookings, addReview } = useAppStore();
  const totalBookings = Math.max(bookings.length, 2500);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const confirmed = bookings.filter(
    (b) => b.userId === currentUser?.id && b.status === "confirmed",
  );

  useEffect(() => {
    document.title = "CourtClub — Book your court in seconds";
  }, []);

  const handleSubmitReview = () => {
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    addReview({
      bookingId: confirmed[0].id,
      userId: currentUser!.id,
      userName: currentUser!.name,
      rating,
      comment,
    });
    setSubmitted(true);
    toast.success("Review submitted! Thank you for your feedback.");
  };

  return (
    <main className="overflow-hidden">
      {/* HERO SECTION - Trust-Focused */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 -z-10">
          <img
            src="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&q=80"
            alt="Professional badminton court"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-primary/40" />
        </div>

        <div className="mx-auto w-full max-w-6xl px-4 py-20 grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Copy */}
          <div className="z-10">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-700/40 bg-indigo-800/15 px-4 py-2.5 text-sm backdrop-blur-sm w-fit">
                <Flame className="h-4 w-4 text-indigo-400" />
                <span className="text-indigo-200 font-semibold">
                  Trusted by 2,500+ Quezon City players
                </span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-slate-900 leading-tight tracking-tight">
                Book Your Court with Confidence
              </h1>

              <p className="text-lg sm:text-xl text-slate-700 max-w-xl leading-relaxed font-light">
                Join thousands of players in Quezon City who've ditched the
                phone calls. Transparent pricing, secure booking, and admin that
                actually responds.
              </p>

              {/* Trust Indicators */}
              <div className="flex flex-col gap-3 pt-4">
                <div className="flex items-center gap-3 text-slate-700">
                  <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                  <span>4.8★ rating from 127 verified players</span>
                </div>
                <div className="flex items-center gap-3 text-slate-700">
                  <Lock className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                  <span>SSL encrypted • Money-back guarantee</span>
                </div>
                <div className="flex items-center gap-3 text-slate-700">
                  <Users className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                  <span>Response time: under 2 hours</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 pt-6">
                <Button asChild size="lg" className="gap-2">
                  <Link to="/booking">
                    Book Now
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" className="gap-2">
                  <Link to="/faq">
                    See how it works
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
          {/* Right: Stats */}
          <div className="z-10 grid gap-4 sm:grid-cols-2">
            <TrustStat
              icon={<Trophy className="h-6 w-6" />}
              value="2,500+"
              label="Bookings Made"
            />
            <TrustStat
              icon={<Star className="h-6 w-6 fill-amber-400 text-amber-400" />}
              value="4.8★"
              label="Average Rating"
            />
            <TrustStat
              icon={<Clock className="h-6 w-6" />}
              value="< 2hrs"
              label="Support Response"
            />
            <TrustStat
              icon={<ShieldCheck className="h-6 w-6" />}
              value="100%"
              label="Money-Back"
            />
          </div>
        </div>
      </section>
      {/* WHY COURTCLUB SECTION */}
      <section className="relative py-20 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
              Why Players Choose CourtClub
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              No hidden fees. No runaround. Just honest court booking that
              works.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1: Transparent Pricing */}
            <div className="group rounded-2xl border border-border bg-white dark:bg-slate-800 p-8 shadow-sm hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                Transparent Pricing
              </h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Every dollar explained. We show you exactly where your $25/hour
                goes.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex justify-between">
                  <span>Court maintenance</span>
                  <span className="font-medium">$5/hr</span>
                </li>
                <li className="flex justify-between">
                  <span>Utilities (AC, lights)</span>
                  <span className="font-medium">$3/hr</span>
                </li>
                <li className="flex justify-between">
                  <span>Staff & support</span>
                  <span className="font-medium">$2/hr</span>
                </li>
                <li className="flex justify-between border-t border-border pt-2 text-foreground font-bold">
                  <span>Total</span>
                  <span>$25/hr</span>
                </li>
              </ul>
            </div>

            {/* Card 2: Money-Back Guarantee */}
            <div className="group rounded-2xl border border-border bg-white dark:bg-slate-800 p-8 shadow-sm hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-6">
                <span className="text-2xl">🛡️</span>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                Money-Back Guarantee
              </h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Not happy? Full refund within 48 hours. We mean it.
              </p>
              <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground text-sm">
                      Cancellation
                    </p>
                    <p className="text-xs text-muted-foreground">
                      24+ hrs = full refund
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground text-sm">
                      Problems
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Contact us, we'll fix it
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: Real Support */}
            <div className="group rounded-2xl border border-border bg-white dark:bg-slate-800 p-8 shadow-sm hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-6">
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                Humans Who Actually Help
              </h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                No bots. No waiting. Our team responds within 2 hours, every
                time.
              </p>
              <div className="space-y-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-blue-200 dark:bg-blue-900 flex items-center justify-center text-sm font-bold">
                    S
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Sarah Santos
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Ops Manager · QC
                    </p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground italic pl-11">
                  "I personally check every booking. You've got this."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS - Visual */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-4xl sm:text-5xl font-bold text-center text-foreground mb-16">
            Three Steps to Your Perfect Game
          </h2>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Step 1 */}
            <div className="relative">
              <div className="absolute -top-6 -left-6 h-12 w-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg">
                1
              </div>
              <img
                src="https://images.unsplash.com/photo-1611632622046-4e1f5b24ed48?w=400&h=300&q=80"
                alt="User selecting date and time"
                className="w-full h-64 object-cover rounded-xl mb-6 border border-border"
              />
              <h3 className="text-xl font-bold text-foreground mb-2">
                Pick Your Time
              </h3>
              <p className="text-muted-foreground">
                Choose a date and time slot that works for you. See all
                available courts instantly.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="absolute -top-6 -left-6 h-12 w-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg">
                2
              </div>
              <img
                src="https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=400&h=300&q=80"
                alt="Confirmation and chat"
                className="w-full h-64 object-cover rounded-xl mb-6 border border-border"
              />
              <h3 className="text-xl font-bold text-foreground mb-2">
                Confirm Payment
              </h3>
              <p className="text-muted-foreground">
                Chat with our team to finalize payment. We'll confirm everything
                within 2 hours.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="absolute -top-6 -left-6 h-12 w-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg">
                3
              </div>
              <img
                src="https://images.unsplash.com/photo-1483389127117-b6a2102724ae?w=400&h=300&q=80"
                alt="Players enjoying the court"
                className="w-full h-64 object-cover rounded-xl mb-6 border border-border"
              />
              <h3 className="text-xl font-bold text-foreground mb-2">
                Play & Enjoy
              </h3>
              <p className="text-muted-foreground">
                Your court is ready. Show up and play. We've got your back if
                anything goes wrong.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS - Social Proof */}
      <section className="py-20 bg-slate-50 dark:bg-slate-800/50">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
              Loved by Our Community
            </h2>
            <p className="text-lg text-muted-foreground">
              Read what real players have to say
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <TestimonialCard
              image="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&q=80"
              name="Maria Santos"
              role="Badminton Player"
              bookings={12}
              rating={5}
              text="Perfect for our weekly games. The courts are always clean, booking is instant, and the admin team actually responds!"
            />
            <TestimonialCard
              image="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&q=80"
              name="Juan Dela Cruz"
              role="Tennis Enthusiast"
              bookings={18}
              rating={5}
              text="Best booking system in Manila. No hidden fees, transparent pricing, and Sarah always helps when I have questions."
            />
            <TestimonialCard
              image="https://images.unsplash.com/photo-1517070213202-1ebb88015025?w=100&h=100&q=80"
              name="Alex Rodriguez"
              role="Basketball Player"
              bookings={8}
              rating={5}
              text="I was skeptical at first, but the process was so smooth. Will definitely be a regular now."
            />
          </div>
        </div>
      </section>

      {/* TEAM - Credibility */}
      <section id="team" className="py-20 bg-white dark:bg-slate-900">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
              Meet Our Team
            </h2>
            <p className="text-lg text-muted-foreground">
              Real people who care about your experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <TeamCard
              image="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&q=80"
              name="John Reyes"
              role="Founder & CEO"
              location="Manila"
              bio="Court enthusiast who got tired of waiting on hold. Built CourtClub to make booking frictionless."
              sport="🎾 Badminton"
            />
            <TeamCard
              image="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=400&q=80"
              name="Sarah Santos"
              role="Operations Manager"
              location="Quezon City"
              bio="Makes sure every booking runs smoothly. Responds to support messages within 2 hours, guaranteed."
              sport="🎾 Tennis"
            />
            <TeamCard
              image="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=400&q=80"
              name="Mike Cruz"
              role="Lead Developer"
              location="Quezon City"
              bio="Ensures the app never breaks. If you find a bug, he's already fixed it."
              sport="🏀 Basketball"
            />
          </div>
        </div>
      </section>

      {/* FAQ - Trust */}
      <section
        id="faq"
        className="py-20 bg-slate-50 dark:bg-slate-800/50 scroll-mt-20"
      >
        <div className="mx-auto max-w-3xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
              Questions?
            </h2>
            <p className="text-lg text-muted-foreground">
              We've got answers. (And a support team standing by.)
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="border-b border-border last:border-0"
              >
                <AccordionTrigger className="text-left text-lg font-medium py-4 hover:text-primary transition-colors">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4 leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-8 rounded-xl bg-primary/10 border border-primary/20 p-6 text-center">
            <p className="text-sm text-muted-foreground mb-3">
              Still have questions? We're here to help.
            </p>
            <p className="font-semibold text-foreground">
              📧 support@courtclub.app • 💬 Chat with us
            </p>
          </div>
        </div>
      </section>

      {/* REVIEW SECTION */}
      <section
        id="review"
        className="py-20 bg-white dark:bg-slate-900 scroll-mt-20"
      >
        <div className="mx-auto max-w-lg px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Love CourtClub?
            </h2>
            <p className="text-muted-foreground">
              Help us improve by sharing your experience
            </p>
          </div>

          {!currentUser || confirmed.length === 0 ? (
            <div className="rounded-xl border-2 border-dashed border-border bg-slate-50 dark:bg-slate-800 p-12 text-center">
              <Star className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="font-semibold text-foreground mb-2">
                {!currentUser
                  ? "Sign in and complete a booking to leave a review."
                  : "Complete a confirmed booking to unlock reviews."}
              </h3>
              <Button asChild variant="default">
                <Link to="/booking">Book your first court</Link>
              </Button>
            </div>
          ) : submitted ? (
            <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200 dark:border-emerald-800 p-12 text-center">
              <div className="mx-auto h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center mb-4">
                <Star className="h-8 w-8 text-emerald-600 dark:text-emerald-400 fill-emerald-600 dark:fill-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                Thank you!
              </h3>
              <p className="text-muted-foreground mb-6">
                Your review helps us stay excellent and helps other players
                choose CourtClub.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSubmitted(false);
                  setRating(0);
                  setComment("");
                }}
              >
                Leave another review
              </Button>
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-white dark:bg-slate-800 p-8 shadow-sm">
              <div className="mb-6">
                <p className="text-sm font-semibold text-foreground mb-3">
                  Your rating
                </p>
                <div className="flex gap-2 justify-center">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setRating(n)}
                      onMouseEnter={() => setHover(n)}
                      onMouseLeave={() => setHover(0)}
                      className="p-1 transition-transform hover:scale-110"
                    >
                      <Star
                        className={`h-8 w-8 ${
                          n <= (hover || rating)
                            ? "fill-amber-400 text-amber-400"
                            : "text-muted-foreground/30"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                {rating > 0 && (
                  <p className="mt-3 text-xs text-center text-muted-foreground">
                    {rating === 1
                      ? "Poor experience"
                      : rating === 2
                        ? "Could be better"
                        : rating === 3
                          ? "Good"
                          : rating === 4
                            ? "Very good!"
                            : "Excellent! 🎉"}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="comment"
                  className="text-sm font-semibold text-foreground block mb-3"
                >
                  What did you love? (optional)
                </label>
                <textarea
                  id="comment"
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tell other players what made your experience great…"
                  className="w-full rounded-lg border border-border bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              <Button
                className="mt-6 w-full"
                disabled={rating === 0}
                onClick={handleSubmitReview}
              >
                <Send className="mr-2 h-4 w-4" />
                Submit review
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA FOOTER */}
      <section className="py-20 bg-gradient-to-br from-primary/95 to-primary-600 text-white">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            Ready to book your next game?
          </h2>
          <p className="text-lg text-white/80 mb-8 leading-relaxed">
            Join 2,500+ players who've already switched to CourtClub.
            Transparent, secure, and actually responsive.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link to="/booking">Book a slot now</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="border-white/30 text-black hover:bg-white/10"
            >
              <Link to="#faq">See how it works</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

// ============ COMPONENTS ============

function TrustStat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 p-6 text-center text-white">
      <div className="flex justify-center mb-3">
        <span className="text-4xl">{icon}</span>
      </div>
      <p className="text-3xl font-bold mb-1">{value}</p>
      <p className="text-sm text-white/80">{label}</p>
    </div>
  );
}

function TestimonialCard({
  image,
  name,
  role,
  bookings,
  rating,
  text,
}: {
  image: string;
  name: string;
  role: string;
  bookings: number;
  rating: number;
  text: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-white dark:bg-slate-700 p-8 shadow-sm hover:shadow-lg transition-shadow">
      <div className="flex gap-1 mb-4">
        {Array.from({ length: rating }).map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
        ))}
      </div>

      <p className="text-foreground leading-relaxed mb-6 italic">
        &ldquo;{text}&rdquo;
      </p>

      <div className="flex items-center gap-4">
        <img
          src={image}
          alt={name}
          className="h-12 w-12 rounded-full object-cover"
        />
        <div>
          <p className="font-semibold text-foreground">{name}</p>
          <p className="text-xs text-muted-foreground">
            {role} • {bookings} bookings ✓
          </p>
        </div>
      </div>
    </div>
  );
}

function TeamCard({
  image,
  name,
  role,
  location,
  bio,
  sport,
}: {
  image: string;
  name: string;
  role: string;
  location: string;
  bio: string;
  sport: string;
}) {
  return (
    <div className="group rounded-xl border border-border bg-white dark:bg-slate-800 overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
      <img
        src={image}
        alt={name}
        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div className="p-6">
        <h3 className="text-lg font-bold text-foreground mb-1">{name}</h3>
        <p className="text-sm text-primary font-semibold mb-3">{role}</p>
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
          {bio}
        </p>
        <div className="pt-3 border-t border-border space-y-2 text-xs text-muted-foreground">
          <p>
            <MapPin className="inline h-3 w-3 mr-1" />
            {location}
          </p>
          <p>{sport}</p>
        </div>
      </div>
    </div>
  );
}
