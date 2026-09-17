import React from 'react';
import { Rocket } from 'lucide-react';
import { Satellite } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-slate-950 opacity-20 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950" />
      <div className="z-10 flex flex-col items-center mb-8">
        <div className="bg-slate-900 p-4 rounded-full border border-slate-800 mb-4 shadow-lg shadow-indigo-500/20">
          <Rocket className="w-8 h-8 text-indigo-400" />
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background Star Grid Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-25 pointer-events-none" />

      {/* Brand Header */}
      <div className="mb-6 flex flex-col items-center text-center z-10">
        <div className="h-12 w-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-3 shadow-lg shadow-blue-500/10">
          <Satellite className="h-7 w-7" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">COSMOS</h1>
        <p className="text-slate-400 text-center max-w-sm">Mission Operations & Spacecraft Health Platform</p>
        <h1 className="text-2xl font-bold tracking-wider text-slate-100 flex items-center gap-2">
          COSMOS <span className="text-xs bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded font-mono">MISSION CONTROL</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">RVCE CubeSat Mission Operations & Diagnostics</p>
      </div>
      <div className="z-10 w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-xl overflow-hidden p-8">
        {children}
      </div>

      <div className="w-full max-w-md z-10">{children}</div>
    </div>
  );
}
