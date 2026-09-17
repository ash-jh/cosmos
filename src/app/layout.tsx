import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "COSMOS — Mission Operations & Spacecraft Health",
  description:
    "Mission operations, realtime telemetry, edge AI anomaly detection, root-cause analysis, and digital twin simulation for small satellite missions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.className} min-h-screen bg-[#0B0E14] text-slate-100 antialiased`}
      >
        <Providers>
          {children}
          <Toaster
            theme="dark"
            position="bottom-right"
            richColors
          />
        </Providers>
      </body>
    </html>
  );
}