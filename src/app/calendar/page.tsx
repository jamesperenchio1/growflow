"use client";

import { useState, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Sprout,
  Droplets,
  Scissors,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTasks } from "@/hooks/use-tasks";
import { usePlants } from "@/hooks/use-plants";
import { cn } from "@/lib/utils";

function getDaysInMonth(year: number, month: number): Date[] {
  const days: Date[] = [];
  const date = new Date(year, month, 1);
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
}

function getMonthStartOffset(year: number, month: number): number {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1; // Monday start
}

const taskIcons: Record<string, typeof Sprout> = {
  water: Droplets,
  feed: Sprout,
  prune: Scissors,
  harvest: CheckCircle2,
  default: AlertCircle,
};

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const { tasks } = useTasks();
  const { plants } = usePlants();

  const days = getDaysInMonth(year, month);
  const offset = getMonthStartOffset(year, month);

  const monthName = currentDate.toLocaleString("default", { month: "long", year: "numeric" });

  const tasksByDay = useMemo(() => {
    const map = new Map<string, typeof tasks>();
    tasks.forEach((task) => {
      const key = new Date(task.dueDate).toDateString();
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(task);
    });
    return map;
  }, [tasks]);

  const plantingsByDay = useMemo(() => {
    const map = new Map<string, typeof plants>();
    plants.forEach((plant) => {
      const key = new Date(plant.plantedDate).toDateString();
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(plant);
    });
    return map;
  }, [plants]);

  return (
    <PageShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Calendar</h2>
            <p className="text-muted-foreground">Tasks and plantings at a glance</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <span className="min-w-[140px] text-center font-medium">{monthName}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted-foreground">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                <div key={d} className="py-2">
                  {d}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: offset }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {days.map((day) => {
                const key = day.toDateString();
                const dayTasks = tasksByDay.get(key) ?? [];
                const dayPlantings = plantingsByDay.get(key) ?? [];
                const isToday = day.toDateString() === new Date().toDateString();

                return (
                  <div
                    key={key}
                    className={cn(
                      "min-h-[80px] rounded-md border p-1 text-xs transition-colors hover:bg-accent",
                      isToday && "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20"
                    )}
                  >
                    <div className={cn("text-right font-medium", isToday && "text-emerald-600")}>
                      {day.getDate()}
                    </div>
                    <div className="mt-1 space-y-0.5">
                      {dayTasks.slice(0, 2).map((task) => {
                        const Icon = taskIcons[task.type] ?? taskIcons.default;
                        return (
                          <div
                            key={task.id}
                            className={cn(
                              "flex items-center gap-1 rounded px-1 py-0.5",
                              task.completed
                                ? "bg-muted text-muted-foreground line-through"
                                : "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300"
                            )}
                          >
                            <Icon className="size-2.5" />
                            <span className="truncate">{task.title}</span>
                          </div>
                        );
                      })}
                      {dayTasks.length > 2 && (
                        <div className="text-[10px] text-muted-foreground">+{dayTasks.length - 2} more</div>
                      )}
                      {dayPlantings.slice(0, 1).map((plant) => (
                        <div
                          key={plant.id}
                          className="flex items-center gap-1 rounded bg-emerald-50 px-1 py-0.5 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300"
                        >
                          <Sprout className="size-2.5" />
                          <span className="truncate">{plant.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="size-3 rounded bg-blue-50 dark:bg-blue-950/30" />
            <span>Task</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="size-3 rounded bg-emerald-50 dark:bg-emerald-950/30" />
            <span>Planted</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="size-3 rounded border border-emerald-500" />
            <span>Today</span>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
