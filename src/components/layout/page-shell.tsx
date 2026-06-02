"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/app-store";
import { initDefaultGardenMappings } from "@/store/garden-store";
import { Sidebar } from "./sidebar";
import { Header } from "./header";

export function PageShell({ children }: { children: React.ReactNode }) {
  const { sidebarOpen } = useAppStore();

  useEffect(() => {
    initDefaultGardenMappings();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div
        className={cn(
          "flex min-h-screen flex-col transition-all duration-300",
          sidebarOpen ? "ml-60" : "ml-16"
        )}
      >
        <Header />
        <main className="flex-1">
          <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 page-enter">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
