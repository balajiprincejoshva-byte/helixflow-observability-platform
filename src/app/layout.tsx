import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { AppShell } from "@/components/layout/AppShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HelixFlow | Distributed Systems Observability",
  description: "A production-grade, deterministic operational intelligence and telemetry platform for high-throughput genomic sequencing pipelines.",
  keywords: ["distributed systems", "observability", "genomics", "simulation", "nextjs", "zustand", "telemetry", "SaaS"],
  authors: [{ name: "Systems Engineer" }],
  openGraph: {
    title: "HelixFlow | Distributed Systems Observability",
    description: "Real-time telemetry, queue backpressure simulation, and AI-assisted operational intelligence for distributed processing systems.",
    siteName: "HelixFlow",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "HelixFlow Architecture" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HelixFlow | Distributed Systems Observability",
    description: "Real-time telemetry, queue backpressure simulation, and AI-assisted operational intelligence for distributed processing systems.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col">
        <TooltipProvider>
          <AppShell>{children}</AppShell>
        </TooltipProvider>
        <Toaster theme="dark" />
      </body>
    </html>
  );
}
