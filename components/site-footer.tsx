import Link from "next/link";
import { Sparkles } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/5 bg-black/40 mt-20">
      <div className="container mx-auto px-4 py-10 grid md:grid-cols-3 gap-8 text-sm">
        <div>
          <Link href="/" className="flex items-center gap-2 font-bold tracking-tight">
            <Sparkles className="h-4 w-4 text-rose-500" />
            <span className="text-rose-500">Crucio</span>
          </Link>
          <p className="mt-2 text-muted-foreground italic">crucify the interview</p>
          <p className="mt-3 text-xs text-muted-foreground">
            MPA 2026 — Agentic AI startup project · Bucharest
          </p>
        </div>

        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
            Product
          </div>
          <ul className="space-y-1">
            <li><Link href="/problems" className="hover:text-rose-300">Problems</Link></li>
            <li><Link href="/leaderboard" className="hover:text-rose-300">Leaderboard</Link></li>
            <li><Link href="/profile" className="hover:text-rose-300">Profile</Link></li>
            <li><Link href="/#pricing" className="hover:text-rose-300">Pricing</Link></li>
          </ul>
        </div>

        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
            MPA 2026 deliverables
          </div>
          <ul className="space-y-1">
            <li>
              <Link href="/business-foundation" className="hover:text-rose-300">
                Business foundation
              </Link>
            </li>
            <li>
              <Link href="/pitch" className="hover:text-rose-300">
                Pitch deck
              </Link>
            </li>
            <li>
              <Link href="/" className="hover:text-rose-300">
                Landing page
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/5">
        <div className="container mx-auto px-4 py-4 text-xs text-muted-foreground flex flex-col md:flex-row justify-between gap-2">
          <span>© {new Date().getFullYear()} Crucio. Built with Next.js, Gemini, vibes.</span>
          <span>Made for MPA 2026 · Universitatea din București</span>
        </div>
      </div>
    </footer>
  );
}
