import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "COSMOS — Mission Operations",
  description:
    "Mission Operations & Spacecraft Health Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-[#0B0E14] text-white antialiased`}
      >
        <ConvexClientProvider>
          <SidebarProvider>
            <AppSidebar />

            <SidebarInset className="bg-[#0B0E14]">
              <header className="flex h-14 items-center gap-3 border-b border-zinc-800 px-4">
                <SidebarTrigger />

                <div className="h-4 w-px bg-zinc-800" />

                <div className="flex items-center gap-2 text-sm">
                  <span className="text-zinc-500">
                    RVCE
                  </span>

                  <span className="text-zinc-700">
                    /
                  </span>

                  <span className="text-zinc-300">
                    RVCE CubeSat-01
                  </span>

                  <span className="text-zinc-700">
                    /
                  </span>

                  <span className="text-cyan-400">
                    COSMOS-SAT-01
                  </span>
                </div>

                <div className="ml-auto flex items-center gap-2 text-xs text-emerald-400">
                  <span className="size-2 rounded-full bg-emerald-400" />
                  SYSTEM ONLINE
                </div>
              </header>

              <main className="min-h-[calc(100vh-3.5rem)]">
                {children}
              </main>
            </SidebarInset>
          </SidebarProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}