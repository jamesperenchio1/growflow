"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Sprout,
  Droplets,
  Scissors,
  CheckCircle2,
  AlertCircle,
  Activity,
  Move,
  Bug,
  Settings,
  Check,
  X,
  Leaf,
  Calendar,
  Package,
  AlertTriangle,
} from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { usePlants } from "@/hooks/use-plants";
import { getSeedPlantByName } from "@/data/seed-plants";
import { completeTask as libCompleteTask } from "@/lib/notifications";
import { db } from "@/lib/db";
import { cn } from "@/lib/utils";
import type { Task, Plant } from "@/types";

/* ───────────────────────── helpers ───────────────────────── */

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
  return day === 0 ? 6 : day - 1;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function getExpectedHarvestDate(plant: Plant): Date | null {
  const ref = getSeedPlantByName(plant.name);
  if (!ref) return null;
  const d = new Date(plant.plantedDate);
  d.setDate(d.getDate() + ref.daysToHarvest);
  return d;
}

function isInHarvestWindow(day: Date, plant: Plant): boolean {
  const expected = getExpectedHarvestDate(plant);
  if (!expected) return false;
  const diff = Math.floor(
    (day.getTime() - expected.getTime()) / (1000 * 60 * 60 * 24)
  );
  return diff >= -3 && diff <= 3;
}

function isHarvestDay(day: Date, plant: Plant): boolean {
  const expected = getExpectedHarvestDate(plant);
  if (!expected) return false;
  return isSameDay(day, expected);
}

/* ───────────────────────── icons & colors ───────────────────────── */

const taskIcons: Record<string, React.ElementType> = {
  water: Droplets,
  feed: Sprout,
  prune: Scissors,
  harvest: CheckCircle2,
  check_ph_ec: Activity,
  transplant: Move,
  pest_control: Bug,
  custom: Settings,
  default: AlertCircle,
};

const taskColors: Record<string, string> = {
  water:
    "bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300",
  feed:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300",
  prune:
    "bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300",
  harvest:
    "bg-purple-100 text-purple-700 dark:bg-purple-950/30 dark:text-purple-300",
  check_ph_ec:
    "bg-cyan-100 text-cyan-700 dark:bg-cyan-950/30 dark:text-cyan-300",
  transplant:
    "bg-orange-100 text-orange-700 dark:bg-orange-950/30 dark:text-orange-300",
  pest_control:
    "bg-rose-100 text-rose-700 dark:bg-rose-950/30 dark:text-rose-300",
  custom:
    "bg-slate-100 text-slate-700 dark:bg-slate-950/30 dark:text-slate-300",
};

const harvestColor =
  "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-300 border-yellow-200 dark:border-yellow-900/30";

/* ───────────────────────── stat card ───────────────────────── */

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
  gradient,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ElementType;
  color: string;
  gradient: string;
}) {
  return (
    <Card className={cn("border-0 shadow-sm", gradient)}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div>
              <p className="text-3xl font-bold tracking-tight">{value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
            </div>
          </div>
          <div className={cn("icon-circle size-10", color)}>
            <Icon className="size-5 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ───────────────────────── page ───────────────────────── */

export default function CalendarPage() {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [tasksLoading, setTasksLoading] = useState(true);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const { plants } = usePlants();

  /* fetch ALL tasks (useTasks() defaults to today only) */
  const fetchAllTasks = useCallback(async () => {
    setTasksLoading(true);
    try {
      const data = await db.tasks.toArray();
      setAllTasks(data);
    } finally {
      setTasksLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllTasks();
  }, [fetchAllTasks]);

  const handleCompleteTask = useCallback(
    async (taskId: number) => {
      await libCompleteTask(taskId);
      await fetchAllTasks();
    },
    [fetchAllTasks]
  );

  const days = getDaysInMonth(year, month);
  const offset = getMonthStartOffset(year, month);
  const monthName = currentDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const tasksByDay = useMemo(() => {
    const map = new Map<string, Task[]>();
    allTasks.forEach((task) => {
      const key = new Date(task.dueDate).toDateString();
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(task);
    });
    return map;
  }, [allTasks]);

  const plantingsByDay = useMemo(() => {
    const map = new Map<string, Plant[]>();
    plants.forEach((plant) => {
      const key = new Date(plant.plantedDate).toDateString();
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(plant);
    });
    return map;
  }, [plants]);

  const harvestsByDay = useMemo(() => {
    const map = new Map<string, Plant[]>();
    plants.forEach((plant) => {
      const expected = getExpectedHarvestDate(plant);
      if (!expected) return;
      const key = expected.toDateString();
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(plant);
    });
    return map;
  }, [plants]);

  /* month stats */
  const monthStats = useMemo(() => {
    const tasksThisMonth = allTasks.filter(
      (t) =>
        new Date(t.dueDate).getMonth() === month &&
        new Date(t.dueDate).getFullYear() === year
    );
    const plantingsThisMonth = plants.filter(
      (p) =>
        new Date(p.plantedDate).getMonth() === month &&
        new Date(p.plantedDate).getFullYear() === year
    );
    const harvestsThisMonth = plants.filter((p) => {
      const expected = getExpectedHarvestDate(p);
      if (!expected) return false;
      return expected.getMonth() === month && expected.getFullYear() === year;
    });
    const overdue = allTasks.filter(
      (t) => !t.completed && new Date(t.dueDate) < new Date()
    );
    return {
      tasksTotal: tasksThisMonth.length,
      plantingsTotal: plantingsThisMonth.length,
      harvestsTotal: harvestsThisMonth.length,
      overdueTotal: overdue.length,
    };
  }, [allTasks, plants, month, year]);

  /* dialog content */
  const selectedDayKey = selectedDay?.toDateString() ?? "";
  const dialogTasks = tasksByDay.get(selectedDayKey) ?? [];
  const dialogPlantings = plantingsByDay.get(selectedDayKey) ?? [];
  const dialogHarvests = harvestsByDay.get(selectedDayKey) ?? [];

  return (
    <PageShell>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Calendar</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Tasks, plantings, and harvests at a glance
            </p>
          </div>
          <div className="flex items-center gap-2 bg-muted/60 rounded-xl p-1">
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <span className="min-w-[160px] text-center font-semibold text-sm">
              {monthName}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>

        {/* Calendar grid */}
        <Card className="shadow-sm">
          <CardContent className="p-5">
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-muted-foreground mb-2">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                (d) => (
                  <div key={d} className="py-2">
                    {d}
                  </div>
                )
              )}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: offset }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {days.map((day) => {
                const key = day.toDateString();
                const dayTasks = tasksByDay.get(key) ?? [];
                const dayPlantings = plantingsByDay.get(key) ?? [];
                const dayHarvests = harvestsByDay.get(key) ?? [];
                const isToday = isSameDay(day, new Date());
                const isWeekend = day.getDay() === 0 || day.getDay() === 6;
                const hasHarvestWindow = plants.some((p) =>
                  isInHarvestWindow(day, p)
                );

                /* density dots */
                const totalItems =
                  dayTasks.length + dayPlantings.length + dayHarvests.length;
                let dotCount = 0;
                if (totalItems >= 1 && totalItems <= 2) dotCount = 1;
                else if (totalItems >= 3 && totalItems <= 4) dotCount = 2;
                else if (totalItems >= 5) dotCount = 3;

                /* visible items: tasks + plantings + harvests, max 3 */
                const visibleItems: {
                  id: string;
                  type: "task" | "planting" | "harvest";
                  title: string;
                  completed?: boolean;
                  taskType?: string;
                  plantId?: number;
                }[] = [];

                dayTasks.slice(0, 3).forEach((t) =>
                  visibleItems.push({
                    id: `task-${t.id}`,
                    type: "task",
                    title: t.title,
                    completed: t.completed,
                    taskType: t.type,
                  })
                );

                dayPlantings.slice(0, 3 - visibleItems.length).forEach((p) =>
                  visibleItems.push({
                    id: `plant-${p.id}`,
                    type: "planting",
                    title: p.name,
                    plantId: p.id,
                  })
                );

                dayHarvests
                  .slice(0, 3 - visibleItems.length)
                  .forEach((p) =>
                    visibleItems.push({
                      id: `harvest-${p.id}`,
                      type: "harvest",
                      title: `${p.name} harvest`,
                      plantId: p.id,
                    })
                  );

                return (
                  <div
                    key={key}
                    onClick={() => setSelectedDay(day)}
                    className={cn(
                      "min-h-[110px] rounded-xl border p-1.5 text-xs transition-all hover:shadow-sm cursor-pointer flex flex-col",
                      isToday
                        ? "border-emerald-400 bg-emerald-50/40 dark:bg-emerald-950/10"
                        : hasHarvestWindow
                        ? "border-yellow-300/60 dark:border-yellow-700/40 bg-yellow-50/20 dark:bg-yellow-950/5 hover:bg-accent/30"
                        : "border-border hover:bg-accent/30",
                      isWeekend && !isToday && "bg-slate-50/50 dark:bg-slate-900/20"
                    )}
                  >
                    {/* Day number */}
                    <div
                      className={cn(
                        "text-right font-semibold mb-1 text-sm",
                        isToday && "text-emerald-600"
                      )}
                    >
                      {day.getDate()}
                    </div>

                    {/* Items */}
                    <div className="space-y-0.5 flex-1">
                      {visibleItems.map((item) => {
                        if (item.type === "task") {
                          const Icon =
                            taskIcons[item.taskType ?? "default"] ??
                            taskIcons.default;
                          return (
                            <div
                              key={item.id}
                              title={item.title}
                              className={cn(
                                "flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium",
                                item.completed
                                  ? "bg-muted text-muted-foreground line-through"
                                  : taskColors[item.taskType ?? ""] ||
                                      taskColors.custom
                              )}
                            >
                              <Icon className="size-2.5 shrink-0" />
                              <span className="truncate">{item.title}</span>
                              {item.completed && (
                                <Check className="size-2.5 shrink-0 ml-auto" />
                              )}
                            </div>
                          );
                        }

                        if (item.type === "planting") {
                          return (
                            <div
                              key={item.id}
                              title={item.title}
                              className="flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300"
                            >
                              <Sprout className="size-2.5 shrink-0" />
                              <span className="truncate">{item.title}</span>
                            </div>
                          );
                        }

                        /* harvest */
                        return (
                          <div
                            key={item.id}
                            title={item.title}
                            className={cn(
                              "flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium",
                              harvestColor
                            )}
                          >
                            <Scissors className="size-2.5 shrink-0" />
                            <span className="truncate">{item.title}</span>
                          </div>
                        );
                      })}

                      {totalItems > 3 && (
                        <div className="text-[9px] text-muted-foreground font-medium pl-1">
                          +{totalItems - 3} more
                        </div>
                      )}
                    </div>

                    {/* Density dots */}
                    {dotCount > 0 && (
                      <div className="flex justify-center gap-1 pt-1 mt-auto">
                        {Array.from({ length: dotCount }).map((_, i) => (
                          <div
                            key={i}
                            className={cn(
                              "size-1 rounded-full",
                              isToday
                                ? "bg-emerald-400"
                                : "bg-muted-foreground/40"
                            )}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Stats row */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Tasks This Month"
            value={tasksLoading ? "—" : String(monthStats.tasksTotal)}
            subtitle="Scheduled care tasks"
            icon={Calendar}
            color="bg-blue-500"
            gradient="gradient-blue"
          />
          <StatCard
            title="Plantings This Month"
            value={String(monthStats.plantingsTotal)}
            subtitle="New plants started"
            icon={Leaf}
            color="bg-emerald-500"
            gradient="gradient-emerald"
          />
          <StatCard
            title="Harvests Expected"
            value={String(monthStats.harvestsTotal)}
            subtitle="Ready for picking"
            icon={Package}
            color="bg-amber-500"
            gradient="gradient-amber"
          />
          <StatCard
            title="Overdue Tasks"
            value={
              tasksLoading ? "—" : String(monthStats.overdueTotal)
            }
            subtitle={
              monthStats.overdueTotal > 0 ? "Needs attention" : "All caught up"
            }
            icon={AlertTriangle}
            color={
              monthStats.overdueTotal > 0 ? "bg-rose-500" : "bg-slate-400"
            }
            gradient={
              monthStats.overdueTotal > 0 ? "gradient-rose" : "gradient-slate"
            }
          />
        </div>

        {/* Legend */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <p className="text-sm font-semibold mb-3">Legend</p>
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs">
              {(
                [
                  ["Water", "bg-blue-100 dark:bg-blue-950/30"],
                  ["Feed", "bg-emerald-100 dark:bg-emerald-950/30"],
                  ["Prune", "bg-amber-100 dark:bg-amber-950/30"],
                  ["Harvest task", "bg-purple-100 dark:bg-purple-950/30"],
                  ["Check pH / EC", "bg-cyan-100 dark:bg-cyan-950/30"],
                  ["Transplant", "bg-orange-100 dark:bg-orange-950/30"],
                  ["Pest control", "bg-rose-100 dark:bg-rose-950/30"],
                  ["Custom", "bg-slate-100 dark:bg-slate-950/30"],
                ] as [string, string][]
              ).map(([label, color]) => (
                <div key={label} className="flex items-center gap-1.5">
                  <div className={cn("size-3 rounded-full", color)} />
                  <span className="text-muted-foreground">{label}</span>
                </div>
              ))}
              <div className="flex items-center gap-1.5">
                <div className="size-3 rounded-full bg-emerald-100 dark:bg-emerald-950/30" />
                <span className="text-muted-foreground">Planted</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="size-3 rounded-full bg-yellow-100 dark:bg-yellow-950/30" />
                <span className="text-muted-foreground">Harvest</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="size-3 rounded border-2 border-emerald-400" />
                <span className="text-muted-foreground">Today</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="size-3 rounded border border-yellow-300/60 dark:border-yellow-700/40" />
                <span className="text-muted-foreground">Harvest window</span>
              </div>
              {monthStats.overdueTotal > 0 && (
                <div className="flex items-center gap-1.5">
                  <div className="size-3 rounded-full bg-rose-100 dark:bg-rose-950/30" />
                  <span className="text-muted-foreground">Overdue</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Day detail dialog */}
      <Dialog
        open={selectedDay !== null}
        onOpenChange={(open) => !open && setSelectedDay(null)}
      >
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedDay
                ? selectedDay.toLocaleDateString("default", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })
                : "Day details"}
            </DialogTitle>
            <DialogDescription>
              All tasks, plantings, and harvests for this day.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            {/* Tasks section */}
            <div>
              <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <Calendar className="size-4 text-blue-500" />
                Tasks ({dialogTasks.length})
              </h4>
              {dialogTasks.length === 0 ? (
                <p className="text-xs text-muted-foreground">
                  No tasks scheduled.
                </p>
              ) : (
                <div className="space-y-1.5">
                  {dialogTasks.map((task) => {
                    const Icon =
                      taskIcons[task.type] ?? taskIcons.default;
                    const isOverdue =
                      !task.completed && new Date(task.dueDate) < new Date();
                    return (
                      <div
                        key={task.id}
                        className={cn(
                          "flex items-center gap-2 rounded-lg border px-3 py-2",
                          isOverdue
                            ? "border-rose-200 bg-rose-50/50 dark:border-rose-900/30 dark:bg-rose-950/10"
                            : "border-border bg-card"
                        )}
                      >
                        <div
                          className={cn(
                            "icon-circle size-7 shrink-0",
                            task.completed
                              ? "bg-muted text-muted-foreground"
                              : task.type === "water" &&
                                  "bg-blue-100 text-blue-600 dark:bg-blue-950/30",
                            task.type === "feed" &&
                              "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/30",
                            task.type === "prune" &&
                              "bg-amber-100 text-amber-600 dark:bg-amber-950/30",
                            task.type === "harvest" &&
                              "bg-purple-100 text-purple-600 dark:bg-purple-950/30",
                            task.type === "check_ph_ec" &&
                              "bg-cyan-100 text-cyan-600 dark:bg-cyan-950/30",
                            task.type === "transplant" &&
                              "bg-orange-100 text-orange-600 dark:bg-orange-950/30",
                            task.type === "pest_control" &&
                              "bg-rose-100 text-rose-600 dark:bg-rose-950/30",
                            task.type === "custom" &&
                              "bg-slate-100 text-slate-600 dark:bg-slate-950/30"
                          )}
                        >
                          <Icon className="size-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className={cn(
                              "text-sm font-medium truncate",
                              task.completed &&
                                "text-muted-foreground line-through"
                            )}
                          >
                            {task.title}
                          </p>
                          <p className="text-[10px] text-muted-foreground capitalize">
                            {task.type.replace("_", " ")}
                          </p>
                        </div>
                        {!task.completed ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7 hover:bg-emerald-100 hover:text-emerald-600"
                            onClick={() =>
                              task.id && handleCompleteTask(task.id)
                            }
                          >
                            <Check className="size-3.5" />
                          </Button>
                        ) : (
                          <Check className="size-4 text-emerald-500 shrink-0" />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Plantings section */}
            <div>
              <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <Sprout className="size-4 text-emerald-500" />
                Plantings ({dialogPlantings.length})
              </h4>
              {dialogPlantings.length === 0 ? (
                <p className="text-xs text-muted-foreground">
                  No plants planted on this day.
                </p>
              ) : (
                <div className="space-y-1.5">
                  {dialogPlantings.map((plant) => (
                    <div
                      key={plant.id}
                      onClick={() =>
                        router.push(`/plants/detail?id=${plant.id}`)
                      }
                      className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 cursor-pointer hover:bg-accent/30 transition-colors"
                    >
                      <div className="icon-circle size-7 shrink-0 bg-emerald-100 text-emerald-600 dark:bg-emerald-950/30">
                        <Leaf className="size-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {plant.name}
                        </p>
                        <p className="text-[10px] text-muted-foreground capitalize">
                          {plant.category} · {plant.growingMethod.replace("_", " ")}
                        </p>
                      </div>
                      <ChevronRight className="size-3.5 text-muted-foreground shrink-0" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Harvests section */}
            <div>
              <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <Package className="size-4 text-amber-500" />
                Expected Harvests ({dialogHarvests.length})
              </h4>
              {dialogHarvests.length === 0 ? (
                <p className="text-xs text-muted-foreground">
                  No harvests expected on this day.
                </p>
              ) : (
                <div className="space-y-1.5">
                  {dialogHarvests.map((plant) => (
                    <div
                      key={plant.id}
                      onClick={() =>
                        router.push(`/plants/detail?id=${plant.id}`)
                      }
                      className="flex items-center gap-2 rounded-lg border border-yellow-200 bg-yellow-50/50 dark:border-yellow-900/30 dark:bg-yellow-950/10 px-3 py-2 cursor-pointer hover:bg-yellow-100/50 transition-colors"
                    >
                      <div className="icon-circle size-7 shrink-0 bg-yellow-100 text-yellow-600 dark:bg-yellow-950/30">
                        <Scissors className="size-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {plant.name} ready for harvest
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          Expected harvest date
                        </p>
                      </div>
                      <ChevronRight className="size-3.5 text-muted-foreground shrink-0" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
