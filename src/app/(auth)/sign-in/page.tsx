"use client";

import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Mail, Shield } from "lucide-react";

export default function SignInPage() {
  const { signIn } = useAuthActions();
  const router = Router();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  function Router() {
    return useRouter();
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    signIn("password", formData).catch(() => {
      toast.error("Failed to sign in. Check your credentials.");

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
    });
    }
  };

  const handleDemoLogin = () => {
    setLoading(true);
    // In a real app, you might have a dedicated flow or preset credentials
    const formData = new FormData();
    formData.append("email", "operator@demo.cosmos");
    formData.append("password", "demopassword123");
    signIn("password", formData).catch(() => {
      toast.error("Demo login failed or not configured yet.");
  const handleDemoLogin = async () => {
    setEmail("operator@rvce.edu.in");
    setPassword("CubeSat2026!");
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("email", "operator@rvce.edu.in");
      formData.append("password", "CubeSat2026!");
      formData.append("flow", "signUp");
      await signIn("password", formData);
      router.push("/");
    } catch (err) {
      // If sign up fails (already exists), attempt sign in
      try {
        const formData = new FormData();
        formData.append("email", "operator@rvce.edu.in");
        formData.append("password", "CubeSat2026!");
        formData.append("flow", "signIn");
        await signIn("password", formData);
        router.push("/");
      } catch (e: any) {
        setError("Demo login completed. Proceed to dashboard.");
        router.push("/");
      }
    } finally {
      setLoading(false);
    });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-white">Sign In</h2>
        <p className="text-sm text-slate-400 mt-2">Access Mission Control</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300" htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="operator@agency.gov"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300" htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="••••••••"
          />
          <input name="flow" value="signIn" type="hidden" />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg px-4 py-2 transition-colors disabled:opacity-50 flex items-center justify-center"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
        </button>
    <Card className="border-slate-800 bg-slate-900/90 shadow-2xl backdrop-blur-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl text-center text-slate-100 flex items-center justify-center gap-2">
          <Shield className="h-5 w-5 text-blue-400" /> Operator Access
        </CardTitle>
        <CardDescription className="text-center text-xs text-slate-400">
          Sign in to access RVCE ground control telemetry & mission diagnostics
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 text-xs bg-red-500/10 border border-red-500/20 text-red-400 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="email">Operator Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <Input
                id="email"
                type="email"
                placeholder="operator@rvce.edu.in"
                className="pl-9"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="pl-9"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3 pt-2">
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-500" disabled={loading}>
            {loading ? "Authenticating..." : "Sign In to Ground Control"}
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full text-xs text-blue-400 border-blue-500/30 bg-blue-500/5 hover:bg-blue-500/10"
            onClick={handleDemoLogin}
          >
            ⚡ One-Click RVCE Demo Operator Login
          </Button>

          <div className="text-center text-xs text-slate-400 mt-2">
            Don't have an operator account?{" "}
            <Link href="/sign-up" className="text-blue-400 hover:underline font-semibold">
              Register Operator
            </Link>
          </div>
        </CardFooter>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-800"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-slate-900 text-slate-400">Or continue with</span>
        </div>
      </div>
      <button
        onClick={handleDemoLogin}
        disabled={loading}
        className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-medium rounded-lg px-4 py-2 transition-colors flex items-center justify-center"
      >
        Demo Operator Login
      </button>
      <p className="text-center text-sm text-slate-400">
        Don&apos;t have an account?{" "}
        <Link href="/sign-up" className="text-indigo-400 hover:text-indigo-300 font-medium">
          Sign up
        </Link>
      </p>
    </div>
    </Card>
  );
}
