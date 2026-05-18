import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Sparkles, LogOut } from "lucide-react";

export async function SiteHeader() {
  const session = await auth();

  return (
    <header className="border-b border-white/5 bg-black/20 backdrop-blur sticky top-0 z-40">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold tracking-tight">
          <Sparkles className="h-5 w-5 text-rose-500" />
          <span className="text-lg">
            <span className="text-rose-500">Crucio</span>
          </span>
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/problems" className="text-muted-foreground hover:text-foreground transition">
            Problems
          </Link>
          <Link href="/leaderboard" className="text-muted-foreground hover:text-foreground transition">
            Leaderboard
          </Link>
          <Link href="/#pricing" className="text-muted-foreground hover:text-foreground transition hidden sm:inline">
            Pricing
          </Link>
          <Link href="/pitch" className="text-muted-foreground hover:text-foreground transition hidden md:inline">
            Pitch
          </Link>
          {session?.user ? (
            <>
              <Link href="/profile" className="text-muted-foreground hover:text-foreground transition">
                Profile
              </Link>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <Button variant="ghost" size="sm" type="submit">
                  <LogOut className="h-4 w-4 mr-1" />
                  Sign out
                </Button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" className="bg-rose-600 hover:bg-rose-700">Sign up</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
