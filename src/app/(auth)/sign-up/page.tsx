"use client";

import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Mail, ShieldCheck, Loader2 } from "lucide-react";

export default function SignUpPage() {
  const { signIn } = useAuthActions();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      formData.append("flow", "signUp");

      await signIn("password", formData);
      router.push("/");
    } catch (err: any) {
      setError(err?.message || "Registration failed. Try another email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-slate-900/90 border-slate-800 text-slate-100 shadow-2xl backdrop-blur-xl">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-xl font-bold tracking-wide">Register Operator</CardTitle>
        <CardDescription className="text-slate-400 text-xs">
          Create an operator account for RVCE mission control
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-lg flex items-center gap-2">
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-2">
            <Label className="text-xs text-slate-300">Mission Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <Input
                type="email"
                placeholder="operator@rvce.edu.in"
                className="pl-9 bg-slate-950/60 border-slate-800 text-slate-200 text-xs"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-slate-300">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <Input
                type="password"
                placeholder="••••••••"
                className="pl-9 bg-slate-950/60 border-slate-800 text-slate-200 text-xs"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold py-2"
            disabled={loading}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Create Flight Operator Account
          </Button>
        </CardContent>

        <CardFooter className="flex justify-center border-t border-slate-800/80 pt-4">
          <p className="text-xs text-slate-400">
            Already registered?{" "}
            <Link href="/sign-in" className="text-blue-400 hover:text-blue-300 underline font-medium">
              Sign In
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
