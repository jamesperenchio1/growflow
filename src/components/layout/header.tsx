"use client";

import { PanelLeft, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/app-store";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/planner": "Planner",
  "/plants": "My Plants",
  "/tasks": "Tasks",
  "/calendar": "Calendar",
  "/nutrients": "Nutrients",
  "/systems": "Systems",
  "/iot": "IoT Monitoring",
  "/weather": "Weather",
  "/learn": "Learn",
  "/settings": "Settings",
};

export function Header() {
  const { sidebarOpen, setSidebarOpen } = useAppStore();
  const pathname = usePathname();
  const title = pageTitles[pathname] || "GrowFlow";

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle sidebar"
      >
        <PanelLeft className="size-5" />
      </Button>

      <h1 className="text-sm font-semibold md:text-base">{title}</h1>

      <div className="ml-auto flex items-center gap-2">
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="size-5" />
        </Button>
        <ThemeToggle />
      </div>
    </header>
  );
}
