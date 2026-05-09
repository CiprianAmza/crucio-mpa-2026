"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [pending, start] = useTransition();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    start(async () => {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name: name || undefined }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error ?? "Signup failed");
        return;
      }
      const sign = await signIn("credentials", { email, password, redirect: false });
      if (!sign || sign.error) {
        toast.error("Account created but sign-in failed. Try logging in.");
        router.push("/login");
        return;
      }
      toast.success("Account created. Welcome to Crucio.");
      router.push("/problems");
      router.refresh();
    });
  }

  return (
    <div className="container mx-auto max-w-md py-20 px-4">
      <Card className="border-white/10 bg-black/30">
        <CardHeader>
          <CardTitle>Create your account</CardTitle>
          <CardDescription>Start crucifying interviews. It&apos;s free for testing.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name (optional)</Label>
              <Input id="name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" autoComplete="new-password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} />
              <p className="text-xs text-muted-foreground">At least 8 characters.</p>
            </div>
            <Button type="submit" className="w-full bg-rose-600 hover:bg-rose-700" disabled={pending}>
              {pending ? "Creating…" : "Create account"}
            </Button>
          </form>
          <div className="mt-4 text-sm text-muted-foreground">
            Already have one?{" "}
            <Link href="/login" className="text-rose-300 hover:underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
