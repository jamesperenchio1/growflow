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
        sidebarOpen ? "w-60" : "w-16"
      )}
    >
      <div className="flex h-16 items-center border-b px-3">
        <Link
          href="/"
          className={cn(
            "flex items-center gap-2.5 font-bold text-lg tracking-tight transition-opacity",
            !sidebarOpen && "opacity-0 pointer-events-none"
          )}
        >
          <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500 text-white">
            <Leaf className="size-5" />
          </div>
          <span className="truncate text-sidebar-foreground">GrowFlow</span>
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={cn(
            "ml-auto flex size-8 items-center justify-center rounded-md text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors",
            !sidebarOpen && "mx-auto ml-0"
          )}
          aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {sidebarOpen ? <ChevronLeft className="size-4" /> : <ChevronRight className="size-4" />}
        </button>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-2 py-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-2.5 py-2.5 text-sm font-medium transition-all relative",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
                !sidebarOpen && "justify-center px-0"
              )}
              title={!sidebarOpen ? item.label : undefined}
            >
              {isActive && sidebarOpen && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-[3px] rounded-r-full bg-emerald-500" />
              )}
              <Icon
                className={cn(
                  "size-[18px] shrink-0 transition-colors",
                  isActive ? "text-emerald-600 dark:text-emerald-400" : "text-sidebar-foreground/50 group-hover:text-sidebar-foreground"
                )}
              />
              <span
                className={cn(
                  "truncate transition-opacity duration-200",
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
