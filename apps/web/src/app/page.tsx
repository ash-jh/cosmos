"use client";

import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Activity,
  Cpu,
  Radio,
  Users,
} from "lucide-react";

import Balatro from "@/components/background";
import LandingNavbar from "@/components/landing-navbar";

const architectureSteps = [
  {
    number: "01",
    title: "Telemetry",
    description: "Ingest & normalize spacecraft data",
    // Deep crimson/red gradient setup
    accentColor: "from-rose-500/20 via-red-500/10 to-transparent",
    borderColor: "hover:border-rose-500/40",
    glowColor: "group-hover:bg-rose-500/10",
    badgeColor: "text-rose-400 bg-rose-500/10 border-rose-500/20",
  },
  {
    number: "02",
    title: "Detection",
    description: "Identify abnormal behaviour",
    // Vibrant blue gradient setup
    accentColor: "from-blue-500/20 via-indigo-500/10 to-transparent",
    borderColor: "hover:border-blue-500/40",
    glowColor: "group-hover:bg-blue-500/10",
    badgeColor: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  },
  {
    number: "03",
    title: "Correlation",
    description: "Connect multi-parameter anomalies",
    // Cyan/teal-blue gradient setup
    accentColor: "from-cyan-500/20 via-blue-500/10 to-transparent",
    borderColor: "hover:border-cyan-500/40",
    glowColor: "group-hover:bg-cyan-500/10",
    badgeColor: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
  },
  {
    number: "04",
    title: "RCA",
    description: "Trace probable system causes",
    // Dark violet-blue to indigo setup
    accentColor: "from-indigo-500/20 via-purple-500/10 to-transparent",
    borderColor: "hover:border-indigo-500/40",
    glowColor: "group-hover:bg-indigo-500/10",
    badgeColor: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
  },
];

export default function HomePage() {
  return (
    <main className="quicksand relative min-h-screen overflow-x-hidden bg-[#05070d] text-white">
      {/* ============================================================
          BACKGROUND
      ============================================================ */}

      <div className="fixed inset-0 z-0">
        <Balatro
          isRotate={false}
          mouseInteraction
          pixelFilter={745}
          color1="#DE443B"
          color2="#006BB4"
          color3="#162325"
        />
      </div>

      <div className="fixed inset-0 z-[1] bg-[#05070d]/30" />

      {/* ============================================================
          NAVBAR
      ============================================================ */}

      <LandingNavbar />

      {/* ============================================================
          HERO
      ============================================================ */}

      <section className="outfit relative z-10 flex min-h-screen items-center justify-center px-6">
        <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
          <h1 className="text-[100px] mt-20 quicksand font-semibold leading-[0.78] tracking-[-0.075em]">
            cosmos
          </h1>

          <p className="mt-9 max-w-xl text-[15px] leading-7 text-white/60 md:text-[17px]">
            Mission operations and spacecraft health, built around telemetry,
            anomaly detection, and intelligent root-cause analysis.
          </p>

          <Link
            href="/dashboard"
            className="group mt-10 flex items-center gap-3 rounded-xl border border-white/20 bg-white px-6 py-3.5 text-sm font-semibold text-black shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/90"
          >
            Try a Simulation
            <ArrowRight
              size={17}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>

          <p className="mt-5 text-[10px] uppercase tracking-[0.2em] text-white/30">
            Simulated telemetry · anomaly detection · RCA
          </p>
        </div>
      </section>

      {/* ============================================================
          ARCHITECTURE
      ============================================================ */}
      <section
        id="architecture"
        className="relative z-10 overflow-hidden border-t border-white/10 bg-[#000000] px-6 py-32 backdrop-blur-xl"
      >
        {/* Background Glow Blobs */}
        <div className="pointer-events-none absolute left-0 top-1/4 -z-10 h-96 w-96 -translate-x-1/2 rounded-full bg-rose-600/10 blur-[120px]" />
        <div className="pointer-events-none absolute right-0 bottom-10 -z-10 h-96 w-96 translate-x-1/3 rounded-full bg-blue-600/10 blur-[120px]" />

        <div className="mx-auto max-w-6xl">
          <SectionLabel icon={<Cpu size={14} />} text="01 / Architecture" />

          <div className="mt-6 grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-4xl font-semibold tracking-[-0.04em] md:text-6xl text-white">
                From telemetry
                <br />
                <span className="bg-gradient-to-r from-rose-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  to insight.
                </span>
              </h2>

              <p className="mt-6 max-w-lg text-sm leading-7 text-white/50">
                COSMOS processes spacecraft telemetry through a layered pipeline
                designed for real-time monitoring, anomaly detection,
                correlation, and root-cause analysis.
              </p>
            </div>

            {/* 4 Colored Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {architectureSteps.map((step) => (
                <div
                  key={step.number}
                  className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 ${step.borderColor}`}
                >
                  {/* Subtle Gradient Backlight */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${step.accentColor} opacity-40 transition-opacity duration-300 group-hover:opacity-100`}
                  />

                  {/* Floating Top Number Badge */}
                  <div className="relative flex items-center justify-between">
                    <span
                      className={`inline-flex items-center justify-center rounded-lg border px-2.5 py-0.5 text-[10px] font-mono font-semibold tracking-wider ${step.badgeColor}`}
                    >
                      {step.number}
                    </span>

                    {/* Top-Right Decorative Glow Indicator */}
                    <div
                      className={`h-1.5 w-1.5 rounded-full bg-white/20 transition-colors duration-300 ${step.glowColor}`}
                    />
                  </div>

                  <div className="relative z-10 mt-6">
                    <h3 className="text-base font-semibold text-white tracking-wide">
                      {step.title}
                    </h3>

                    <p className="mt-2 text-xs leading-5 text-white/60">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* ============================================================
          SIMULATION
      ============================================================ */}

      <section id="simulation" className="relative z-10 px-6 py-40">
        <div className="mx-auto max-w-6xl">
          {/* Small label */}
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-white/30" />
            <span className="text-[10px] uppercase tracking-[0.28em] text-white/40">
              02 — Simulation
            </span>
          </div>

          {/* Main copy */}
          <div className="mt-12 grid gap-12 md:grid-cols-[1.3fr_0.7fr] md:items-end">
            <div>
              <h2 className="max-w-4xl text-5xl font-medium leading-[0.95] tracking-[-0.055em] text-white md:text-7xl lg:text-[88px]">
                See what happens
                <br />
                <span className="text-white/40">when things go wrong.</span>
              </h2>
            </div>

            <div className="pb-2">
              <p className="max-w-sm text-sm leading-7 text-white/45">
                A controlled spacecraft environment where telemetry becomes
                behaviour, faults become signals, and signals become something
                you can investigate.
              </p>

              <Link
                href="/dashboard"
                className="group mt-7 inline-flex items-center gap-3 border-b border-white/20 pb-2 text-xs font-medium text-white transition hover:border-white/60"
              >
                Enter the simulation
                <ArrowUpRight
                  size={14}
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
            </div>
          </div>

          {/* Minimal feature strip */}
          <div className="relative mt-28 overflow-hidden border-y border-white/[0.5]">
            {/* Progressive blur / glass wash */}
            <div
              className="pointer-events-none absolute inset-0
              bg-gradient-to-r
            from-white/[0.01]
            via-white/[0.08]
            to-white/[0.01]
              backdrop-blur-[2px]
              [mask-image:linear-gradient(to_right,transparent_0%,black_18%,black_82%,transparent_100%)]"
            />

            <div className="relative grid md:grid-cols-3">
              {[
                {
                  number: "01",
                  title: "Telemetry",
                  text: "Observe the spacecraft in real time.",
                },
                {
                  number: "02",
                  title: "Anomalies",
                  text: "Detect deviations across its systems.",
                },
                {
                  number: "03",
                  title: "Root Cause",
                  text: "Trace how one failure affects another.",
                },
              ].map((item, index) => (
                <div
                  key={item.number}
                  className={`group px-6 py-8 md:px-8 md:py-10 ${
                    index !== 2
                      ? "border-b border-white/[0.5] md:border-b-0 md:border-r"
                      : ""
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className="font-mono text-[20px] tracking-[0.2em] text-white/[0.99]">
                      {item.number}
                    </span>

                    <ArrowUpRight
                      size={14}
                      className="text-white/15 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white/50"
                    />
                  </div>

                  <h3 className="mt-12 text-xl font-medium text-white">
                    {item.title}
                  </h3>

                  <p className="mt-2 max-w-[220px] text-xs leading-5 text-white/80">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          GITHUB
      ============================================================ */}

      <section
        id="github"
        className="relative z-10 overflow-hidden border-t border-white/10 bg-[#000000] px-6 py-32 backdrop-blur-xl"
      >
        <div className="mx-auto max-w-6xl">
          <SectionLabel icon={<ArrowUpRight size={14} />} text="03 / GitHub" />

          <div className="mt-6 flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <h2 className="text-4xl font-semibold tracking-[-0.04em] md:text-6xl">
                Built in the open.
              </h2>

              <p className="mt-6 max-w-xl text-sm leading-7 text-white/45">
                Explore the architecture, simulation engine, anomaly detection
                pipeline, and everything powering COSMOS.
              </p>
            </div>

            <Link
              href="https://github.com/ash-jh/cosmos"
              target="blank"
              className="group flex w-fit items-center gap-2 rounded-xl border border-white/10 px-5 py-3 text-sm transition hover:bg-white/5"
            >
              View Repository
              <ArrowUpRight
                size={15}
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================
          TEAM
      ============================================================ */}

      <section id="team" className="relative z-10 px-6 py-32">
        <div className="mx-auto max-w-6xl">
          <SectionLabel icon={<Users size={14} />} text="04 / Team" />

          <div className="mt-6">
            <h2 className="text-4xl font-semibold tracking-[-0.04em] md:text-6xl">
              The people
              <br />
              behind COSMOS.
            </h2>

            <p className="mt-6 max-w-xl text-sm leading-7 text-white/45">
              A student-built mission operations platform exploring the
              intersection of spacecraft systems, AI, and intelligent telemetry
              analysis.
            </p>
          </div>

          {/* Team */}
          <div className="mt-20 border-y border-white/[0.12]">
            {[
              {
                name: "Ashmita Jha",
                role: "Tech",
                linkedin: "https://www.linkedin.com/in/jha-ashmita/",
              },
              {
                name: "Lucky Sinha",
                role: "Team Lead",
                linkedin: "https://www.linkedin.com/in/lucky-sinha-65675336b/",
              },
              {
                name: "Arohi Savai",
                role: "Research",
                linkedin: "https://www.linkedin.com/in/YOUR-LINKEDIN/",
              },
              {
                name: "Lekisha Malekar",
                role: "Tech",
                linkedin:
                  "https://www.linkedin.com/in/lekisha-malekar-9aa009386/",
              },
              {
                name: "Bhavya Khandelwal",
                role: "Research",
                linkedin:
                  "https://www.linkedin.com/in/bhavya-khandelwal-640647370/",
              },
              {
                name: "Vaishnavi Bindal",
                role: "Tech",
                linkedin:
                  "https://www.linkedin.com/in/vaishnavi-bindal-204652378/",
              },
            ].map((member, index) => (
              <a
                key={member.name}
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={`group flex items-center justify-between py-6 transition-all duration-300 hover:px-3 ${
                  index !== 3 ? "border-b border-white/[0.12]" : ""
                }`}
              >
                <div className="flex items-center gap-6">
                  <span className="font-mono text-[10px] tracking-[0.2em] text-white">
                    0{index + 1}
                  </span>

                  <div>
                    <h3 className="text-lg font-medium tracking-[-0.02em] text-white transition-colors group-hover:text-white">
                      {member.name}
                    </h3>

                    <p className="mt-1 text-xs text-white">{member.role}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[10px] uppercase tracking-[0.18em] text-white/0 transition-all duration-300 group-hover:text-white/40">
                    LinkedIn
                  </span>

                  <ArrowUpRight
                    size={16}
                    strokeWidth={1.5}
                    className="text-white/20 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white/80"
                  />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          FOOTER
      ============================================================ */}

      <footer className="relative z-10 bg-black border-t border-white/[0.12] px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3">
                <span className="text-m quicksand font-semibold tracking-[0.2em] text-white">
                  cosmos
                </span>
              </div>

              <p className="mt-4 max-w-xs text-xs leading-5 text-white/60">
                Mission operations and spacecraft health, built for intelligent
                telemetry.
              </p>
            </div>

            {/* Navigation */}
            <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
              {[
                { label: "Architecture", href: "/architecture" },
                { label: "Simulation", href: "/simulation" },
                { label: "GitHub", href: "/github" },
                { label: "Team", href: "#team" },
              ].map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-xs text-white/60 transition-colors duration-200 hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Bottom line */}
          <div className="mt-12 flex flex-col gap-3 border-t border-white/[20] pt-5 text-[10px] uppercase tracking-[0.18em] text-white/60 sm:flex-row sm:items-center sm:justify-between">
            <span>© 2026 COSMOS</span>

            <span className="flex items-center gap-2">
              Built for the next mission
              <span className="h-1 w-1 rounded-full bg-white/30" />
              Bengaluru, India
            </span>
          </div>
        </div>
      </footer>
    </main>
  );
}

/* ================================================================
   SMALL COMPONENTS
================================================================ */

function SectionLabel({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.25em] text-cyan-300/60">
      {icon}
      {text}
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.045]">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/60">
        {icon}
      </div>

      <h3 className="mt-8 text-sm font-semibold">{title}</h3>

      <p className="mt-2 text-xs leading-5 text-white/35">{description}</p>
    </div>
  );
}
