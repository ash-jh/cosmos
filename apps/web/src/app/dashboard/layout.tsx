import { Quicksand } from "next/font/google";

import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
});

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={`${quicksand.variable} min-h-screen bg-[#05070d] font-[family-name:var(--font-quicksand)] text-white antialiased`}
    >
      <SidebarProvider>
        <AppSidebar />

        <SidebarInset className="min-h-screen bg-[#05070d]">
          {/* TOP BAR */}

          <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-white/[0.07] bg-[#05070d]/80 px-4 backdrop-blur-xl backdrop-saturate-150 lg:px-6">
            <SidebarTrigger className="text-white/40 transition-colors hover:bg-white/[0.05] hover:text-white" />

            <div className="h-4 w-px bg-white/[0.08]" />

            <div className="hidden items-center gap-2 text-[11px] tracking-wide sm:flex">
              <span className="text-white/25">RVCE</span>

              <span className="text-white/10">/</span>

              <span className="text-white/45">
                RVCE CubeSat-01
              </span>

              <span className="text-white/10">/</span>

              <span className="font-medium text-white/75">
                COSMOS-SAT-01
              </span>
            </div>

            <div className="sm:hidden">
              <span className="text-xs font-semibold tracking-[0.16em] text-white/80">
                COSMOS
              </span>
            </div>

            <div className="ml-auto flex items-center gap-2 rounded-full border border-emerald-300/[0.08] bg-emerald-300/[0.025] px-3 py-1.5">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-300/30" />

                <span className="relative inline-flex size-1.5 rounded-full bg-emerald-300/75 shadow-[0_0_8px_rgba(110,231,183,0.45)]" />
              </span>

              <span className="text-[9px] font-medium uppercase tracking-[0.18em] text-emerald-300/65">
                System Online
              </span>
            </div>
          </header>

          <main className="min-h-[calc(100vh-4rem)]">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}