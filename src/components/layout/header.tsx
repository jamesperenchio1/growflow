"use client";

import { PanelLeft, Bell, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/app-store";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { CommandPalette, useCommandPalette } from "@/components/search/command-palette";

const pageTitles: Record<string, { title: string; subtitle?: string }> = {
  "/": { title: "Dashboard", subtitle: "Your garden at a glance" },
  "/planner": { title: "Planner", subtitle: "Manage your growing spaces" },
  "/plants": { title: "My Plants", subtitle: "Track and manage your crops" },
  "/tasks": { title: "Tasks", subtitle: "Stay on top of your garden care" },
  "/calendar": { title: "Calendar", subtitle: "Tasks and plantings schedule" },
  "/nutrients": { title: "Nutrients", subtitle: "EC, pH, and NPK guidance" },
  "/systems": { title: "Systems", subtitle: "Compare growing methods" },
  "/iot": { title: "IoT Monitoring", subtitle: "Sensor tracking" },
  "/weather": { title: "Weather", subtitle: "Forecast and conditions" },
  "/learn": { title: "Learn", subtitle: "Guides and references" },
  "/settings": { title: "Settings", subtitle: "Preferences and configuration" },
};

export function Header() {
  const { sidebarOpen, setSidebarOpen } = useAppStore();
  const pathname = usePathname();
  const info = pageTitles[pathname] || { title: "GrowFlow" };
  const { open, setOpen } = useCommandPalette();

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-card/80 backdrop-blur-xl px-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-muted-foreground hover:text-foreground"
          aria-label="Toggle sidebar"
        >
          <PanelLeft className="size-5" />
        </Button>

        <div className="flex flex-col">
          <h1 className="text-sm font-semibold leading-tight">{info.title}</h1>
          {info.subtitle && (
            <span className="text-[11px] text-muted-foreground leading-tight">{info.subtitle}</span>
          )}
        </div>

        <div className="ml-auto flex items-center gap-1">
          <Button
            variant="ghost"
            onClick={() => setOpen(true)}
            className="text-muted-foreground hover:text-foreground gap-2 px-2.5 h-8"
            aria-label="Search"
          >
            <Search className="size-4" />
            <span className="hidden sm:inline text-sm">Search</span>
            <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 text-[10px] font-medium text-muted-foreground">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground relative" aria-label="Notifications">
            <Bell className="size-5" />
            <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-emerald-500 ring-2 ring-background" />
          </Button>
          <ThemeToggle />
        </div>
      </header>
      <CommandPalette open={open} onOpenChange={setOpen} />
    </>
  );
}
