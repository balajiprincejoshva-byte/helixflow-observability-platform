"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, Database, LayoutDashboard, Settings, ActivitySquare, Cpu, TestTubeDiagonal } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Overview", href: "/", icon: LayoutDashboard },
  { name: "Sequencing Runs", href: "/runs", icon: ActivitySquare },
  { name: "QC Analytics", href: "/qc", icon: Activity },
  { name: "Sample Explorer", href: "/samples", icon: TestTubeDiagonal },
  { name: "Compute Nodes", href: "/nodes", icon: Cpu },
  { name: "Data Storage", href: "/storage", icon: Database },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col w-64 bg-sidebar border-r border-sidebar-border h-full">
      <div className="p-6 flex items-center gap-3 border-b border-sidebar-border/50">
        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/50 shadow-[0_0_10px_rgba(0,255,255,0.2)]">
          <Activity className="w-5 h-5 text-primary" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-lg leading-tight tracking-tight text-foreground">HelixFlow</span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">Operations</span>
        </div>
      </div>
      
      <div className="flex-1 py-6 px-3 overflow-y-auto space-y-1">
        <div className="px-3 mb-2 text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider">
          Platform
        </div>
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-200 group",
              pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href))
                ? "bg-sidebar-accent text-primary font-medium" 
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
            )}
          >
            <item.icon className={cn(
              "w-4 h-4", 
              pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href))
                ? "text-primary" 
                : "text-sidebar-foreground/50 group-hover:text-sidebar-foreground"
            )} />
            {item.name}
          </Link>
        ))}
      </div>
      
      <div className="p-4 border-t border-sidebar-border/50">
        <button className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent/50 w-full transition-colors">
          <Settings className="w-4 h-4 text-sidebar-foreground/50" />
          Settings
        </button>
      </div>
    </div>
  );
}
