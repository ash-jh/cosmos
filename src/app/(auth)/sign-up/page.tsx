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
import { Lock, Mail, ShieldCheck } from "lucide-react";

export default function SignUpPage() {
  const { signIn } = useAuthActions();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    signIn("password", formData).catch(() => {
      toast.error("Failed to sign up.");

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
    });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-white">Create Account</h2>
        <p className="text-sm text-slate-400 mt-2">Join Mission Control</p>
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
          <input name="flow" value="signUp" type="hidden" />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg px-4 py-2 transition-colors disabled:opacity-50 flex items-center justify-center"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign Up"}
        </button>
    <Card className="border-slate-800 bg-slate-900/90 shadow-2xl backdrop-blur-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl text-center text-slate-100 flex items-center justify-center gap-2">
          <ShieldCheck className="h-5 w-5 text-emerald-400" /> Register Operator Account
        </CardTitle>
        <CardDescription className="text-center text-xs text-slate-400">
          Create an operator login for RVCE CubeSat-01 ground operations
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
            <Label htmlFor="email">Work / Academic Email</Label>
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
            {loading ? "Creating Account..." : "Register Operator"}
          </Button>

          <div className="text-center text-xs text-slate-400 mt-2">
            Already registered?{" "}
            <Link href="/sign-in" className="text-blue-400 hover:underline font-semibold">
              Sign In
            </Link>
          </div>
        </CardFooter>
      </form>
      <p className="text-center text-sm text-slate-400">
        Already have an account?{" "}
        <Link href="/sign-in" className="text-indigo-400 hover:text-indigo-300 font-medium">
          Sign in
        </Link>
      </p>
    </div>
    </Card>
  );
}
