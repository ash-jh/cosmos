"use client";

import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Mail, Shield, Loader2 } from "lucide-react";

export default function SignInPage() {
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
      formData.append("flow", "signIn");

      await signIn("password", formData);
      router.push("/");
    } catch (err: any) {
      setError(err?.message || "Invalid credentials or login failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail("operator@rvce.edu.in");
    setPassword("CubeSat2026!");
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("email", "operator@rvce.edu.in");
      formData.append("password", "CubeSat2026!");
      formData.append("flow", "signIn");
      await signIn("password", formData);
      router.push("/");
    } catch {
      try {
        const formData = new FormData();
        formData.append("email", "operator@rvce.edu.in");
        formData.append("password", "CubeSat2026!");
        formData.append("flow", "signUp");
        await signIn("password", formData);
        router.push("/");
      } catch (e: any) {
        setError(e?.message || "Demo login completed.");
        router.push("/");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-slate-900/90 border-slate-800 text-slate-100 shadow-2xl backdrop-blur-xl">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-xl font-bold tracking-wide">Operator Sign In</CardTitle>
        <CardDescription className="text-slate-400 text-xs">
          Authenticate to access RVCE telemetry and spacecraft control
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-lg flex items-center gap-2">
              <Shield className="h-4 w-4 shrink-0" />
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
                className="pl-9 bg-slate-950/60 border-slate-800 text-slate-200 text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-slate-300">Security Key / Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <Input
                type="password"
                placeholder="••••••••"
                className="pl-9 bg-slate-950/60 border-slate-800 text-slate-200 text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
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
            Authenticate Session
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={handleDemoLogin}
            className="w-full border-slate-800 bg-slate-950/40 hover:bg-slate-900 text-slate-300 text-xs font-medium"
            disabled={loading}
          >
            Quick Demo Login (RVCE Operator)
          </Button>
        </CardContent>

        <CardFooter className="flex justify-center border-t border-slate-800/80 pt-4">
          <p className="text-xs text-slate-400">
            Need credentials?{" "}
            <Link href="/sign-up" className="text-blue-400 hover:text-blue-300 underline font-medium">
              Register Operator
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
