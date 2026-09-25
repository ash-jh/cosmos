"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  AlertTriangle,
  BrainCircuit,
  CircleGauge,
  Radio,
  Satellite,
  Settings,
  SlidersHorizontal,
  Waypoints,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const navigation = [
  {
    title: "Mission Overview",
    href: "/dashboard",
    icon: CircleGauge,
  },
  {
    title: "Live Telemetry",
    href: "/telemetry",
    icon: Activity,
  },
  {
    title: "Anomaly Center",
    href: "/anomalies",
    icon: AlertTriangle,
  },
  {
    title: "Investigation",
    href: "/investigation",
    icon: BrainCircuit,
  },
  {
    title: "Digital Twin",
    href: "/digital-twin",
    icon: Waypoints,
  },
  {
    title: "Fault Injection",
    href: "/fault-injection",
    icon: SlidersHorizontal,
  },
  {
    title: "ML / Edge",
    href: "/models",
    icon: BrainCircuit,
  },
];

const configuration = [
  {
    title: "Mission Configuration",
    href: "/configuration",
    icon: Settings,
  },
  {
    title: "Telemetry Channels",
    href: "/telemetry/channels",
    icon: Radio,
  },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar
      variant="sidebar"
      collapsible="icon"
      className="quicksand border-r border-white/[0.07] bg-[#070a10] font-[family-name:var(--font-quicksand)]"
    >
      {/* HEADER */}
      <SidebarHeader className="border-b border-white/[0.07] bg-[#070a10] px-2 py-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="lg"
              tooltip="COSMOS"
              className="h-12 rounded-xl px-2 text-white transition-all duration-200 hover:bg-white/[0.045] hover:text-white data-[state=open]:bg-white/[0.07] data-[state=open]:text-white"
            >
              <Link href="/">
                {/* LOGO */}
                <div className="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-[10px] border border-white/[0.14]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_65%)]" />

                  <Satellite
                    className="relative size-[17px] text-white/80"
                    strokeWidth={1.5}
                  />

                  <span className="absolute right-[5px] top-[5px] size-1 rounded-full bg-white/70 shadow-[0_0_7px_rgba(255,255,255,0.5)]" />
                </div>

                {/* BRAND */}
                <div className="grid flex-1 text-left leading-none">
                  <span className="font-[family-name:var(--font-quicksand)] text-[14px] font-semibold tracking-[0.19em] text-white">
                    COSMOS
                  </span>

                  <span className="mt-1.5 font-[family-name:var(--font-quicksand)] text-[9px] font-medium tracking-[0.11em] text-white/25">
                    MISSION OPERATIONS
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* CONTENT */}
      <SidebarContent className="bg-[#070a10] px-2 py-5">
        {/* MISSION CONTROL */}
        <SidebarGroup className="p-0">
          <SidebarGroupLabel className="mb-2 h-auto px-3 font-[family-name:var(--font-quicksand)] text-[8px] font-semibold uppercase tracking-[0.28em] text-white/20">
            Mission Control
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = isActivePath(pathname, item.href);

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      tooltip={item.title}
                      className={`group relative h-10 rounded-[10px] px-3 font-[family-name:var(--font-quicksand)] text-[11px] font-medium transition-all duration-200 ${
                        active
                          ? "bg-white/[0.065] text-white"
                          : "text-white/38 hover:bg-white/[0.045] hover:text-white/80"
                      }`}
                    >
                      <Link href={item.href}>
                        {/* ACTIVE INDICATOR */}
                        <span
                          className={`absolute left-0 top-1/2 h-5 w-[2px] -translate-y-1/2 rounded-full bg-white/80 shadow-[0_0_8px_rgba(255,255,255,0.25)] transition-all duration-200 ${
                            active
                              ? "opacity-100"
                              : "opacity-0 group-hover:opacity-30"
                          }`}
                        />

                        <Icon
                          className={`size-[15px] shrink-0 transition-all duration-200 ${
                            active
                              ? "text-white/90"
                              : "text-white/25 group-hover:text-white/60"
                          }`}
                          strokeWidth={active ? 1.9 : 1.6}
                        />

                        <span className="truncate">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* CONFIGURATION */}
        <SidebarGroup className="mt-7 p-0">
          <SidebarGroupLabel className="mb-2 h-auto px-3 font-[family-name:var(--font-quicksand)] text-[8px] font-semibold uppercase tracking-[0.28em] text-white/20">
            Configuration
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {configuration.map((item) => {
                const Icon = item.icon;
                const active = isActivePath(pathname, item.href);

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      tooltip={item.title}
                      className={`group relative h-10 rounded-[10px] px-3 font-[family-name:var(--font-quicksand)] text-[11px] font-medium transition-all duration-200 ${
                        active
                          ? "bg-white/[0.065] text-white"
                          : "text-white/38 hover:bg-white/[0.045] hover:text-white/80"
                      }`}
                    >
                      <Link href={item.href}>
                        {/* ACTIVE INDICATOR */}
                        <span
                          className={`absolute left-0 top-1/2 h-5 w-[2px] -translate-y-1/2 rounded-full bg-white/80 shadow-[0_0_8px_rgba(255,255,255,0.25)] transition-all duration-200 ${
                            active
                              ? "opacity-100"
                              : "opacity-0 group-hover:opacity-30"
                          }`}
                        />

                        <Icon
                          className={`size-[15px] shrink-0 transition-all duration-200 ${
                            active
                              ? "text-white/90"
                              : "text-white/25 group-hover:text-white/60"
                          }`}
                          strokeWidth={active ? 1.9 : 1.6}
                        />

                        <span className="truncate">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* FOOTER */}
      <SidebarFooter className="border-t border-white/[0.07] bg-[#070a10] px-2 py-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="COSMOS Phase I"
              className="h-9 rounded-[10px] px-3 font-[family-name:var(--font-quicksand)] text-[9px] font-medium uppercase tracking-[0.2em] text-white/20 transition-colors duration-200 hover:bg-white/[0.035] hover:text-white/35"
            >
              <span className="relative flex size-1.5 shrink-0">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-white/10" />
                <span className="relative inline-flex size-1.5 rounded-full bg-white/45 shadow-[0_0_7px_rgba(255,255,255,0.3)]" />
              </span>

              <span>COSMOS Phase I</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}