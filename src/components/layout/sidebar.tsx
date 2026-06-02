"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/app-store";
import {
  LayoutDashboard,
  Grid3x3,
  Leaf,
  CheckCircle2,
  CalendarDays,
  FlaskConical,
  Pipette,
  Cpu,
  CloudSun,
  BookOpen,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/" },
  { label: "Planner", icon: Grid3x3, href: "/planner" },
  { label: "My Plants", icon: Leaf, href: "/plants" },
  { label: "Tasks", icon: CheckCircle2, href: "/tasks" },
  { label: "Calendar", icon: CalendarDays, href: "/calendar" },
  { label: "Nutrients", icon: FlaskConical, href: "/nutrients" },
  { label: "Systems", icon: Pipette, href: "/systems" },
  { label: "IoT", icon: Cpu, href: "/iot" },
  { label: "Weather", icon: CloudSun, href: "/weather" },
  { label: "Learn", icon: BookOpen, href: "/learn" },
  { label: "Settings", icon: Settings, href: "/settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen } = useAppStore();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r bg-sidebar transition-all duration-300",
        sidebarOpen ? "w-64" : "w-12"
      )}
    >
      <div className="flex h-14 items-center border-b px-3">
        <Link
          href="/"
          className={cn(
            "flex items-center gap-2 font-semibold text-sidebar-primary transition-opacity",
            !sidebarOpen && "opacity-0"
          )}
        >
          <Leaf className="size-5 shrink-0 text-emerald-500" />
          <span className="truncate">GrowFlow</span>
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={cn(
            "ml-auto flex size-7 items-center justify-center rounded-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            !sidebarOpen && "mx-auto ml-0"
          )}
          aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {sidebarOpen ? (
            <ChevronLeft className="size-4" />
          ) : (
            <ChevronRight className="size-4" />
          )}
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-2 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                !sidebarOpen && "justify-center px-0"
              )}
              title={!sidebarOpen ? item.label : undefined}
            >
              <Icon className="size-4 shrink-0" />
              <span
                className={cn(
                  "truncate transition-opacity",
                  !sidebarOpen && "hidden"
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
