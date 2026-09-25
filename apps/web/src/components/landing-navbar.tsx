"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const links = [
  {
    label: "Architecture",
    href: "#architecture",
  },
  {
    label: "Simulation",
    href: "#simulation",
  },
  {
    label: "GitHub",
    href: "#github",
  },
  {
    label: "Team",
    href: "#team",
  },
];

export default function LandingNavbar() {
  return (
    <nav className="fixed left-1/2 top-5 z-50 w-[calc(100%-32px)] max-w-6xl -translate-x-1/2">
      <div className="flex h-[62px] items-center justify-between rounded-2xl border border-white/[0.12] bg-[#080b12]/55 px-3 pl-5 shadow-[0_8px_40px_rgba(0,0,0,0.25)] backdrop-blur-2xl backdrop-saturate-150">

        {/* LOGO */}
        <Link
          href="#"
          className="group flex items-center gap-3"
        >
          <div className="flex items-center gap-2">
            <span className="text-[15px] outfit font-bold tracking-[0.2em] text-white">
              cosmos
            </span>
          </div>
        </Link>

        {/* NAVIGATION */}
        <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="rounded-lg px-3.5 py-2 text-[13px] font-medium text-white/50 transition-all duration-200 hover:bg-white/[0.06] hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* RIGHT CTA */}
        <Link
          href="/dashboard"
          className="group flex items-center gap-2 rounded-xl border border-white/10 bg-white px-3.5 py-2 text-[12px] font-semibold text-black transition-all duration-300 hover:-translate-y-[1px] hover:bg-white/90"
        >
          Launch

          <ArrowUpRight
            size={14}
            className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </Link>
      </div>
    </nav>
  );
}