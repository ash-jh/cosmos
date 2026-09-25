"use client";

import Link from "next/link";
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
    href: "/",
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

export function AppSidebar() {
  return (
    <Sidebar
      variant="sidebar"
      collapsible="icon"
      className="border-zinc-800"
    >
      <SidebarHeader className="border-b border-zinc-800">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              aschild
              className="hover:bg-zinc-900"
            >
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-cyan-400 text-black">
                  <Satellite className="size-4" />
                </div>

                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="font-semibold">
                    COSMOS
                  </span>

                  <span className="text-xs text-zinc-500">
                    Mission Operations
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            Mission Control
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => {
                const Icon = item.icon;

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton aschild>
                      <Link href={item.href}>
                        <Icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>
            Configuration
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton aschild>
                  <Link href="/configuration">
                    <Settings />
                    <span>Mission Configuration</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton aschild>
                  <Link href="/telemetry/channels">
                    <Radio />
                    <span>Telemetry Channels</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="px-2 py-3 text-xs text-zinc-600">
          COSMOS Phase I
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}