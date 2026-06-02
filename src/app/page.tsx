"use client";

import { useEffect, useState } from "react";
import { Leaf, Droplets, Sun, Thermometer, Sprout, Calendar, ArrowRight, Plus, Wind, Flower2, Package } from "lucide-react";
import { AlertBanner } from "@/components/weather/alert-banner";
import { useRouter } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePlants } from "@/hooks/use-plants";
import { useTasks } from "@/hooks/use-tasks";
import { useWeather } from "@/hooks/use-weather";
import { useGardenStore } from "@/store/garden-store";
import { getWeatherIcon, getWeatherDescription } from "@/lib/api/weather";
import { getMoonPhase, getMoonPhaseEmoji } from "@/lib/api/moon";
import { useSuppliesStore } from "@/store/supplies-store";
import { useOrderStore } from "@/store/order-store";
import { cn } from "@/lib/utils";
import { db } from "@/lib/db";
import { GrowthChart } from "@/components/charts/growth-chart";

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
  gradient,
  onClick,
  hasAlert,
  alertDot,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: typeof Leaf;
  color: string;
  gradient: string;
  onClick?: () => void;
  hasAlert?: boolean;
  alertDot?: boolean;
}) {
  return (
    <Card
      className={cn("card-hover cursor-pointer border-0 shadow-sm", gradient)}
      onClick={onClick}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div>
              <p className="text-3xl font-bold tracking-tight">{value}</p>
              <p className={cn("text-xs mt-0.5", hasAlert ? "text-amber-700 dark:text-amber-300 font-medium" : "text-muted-foreground")}>{subtitle}</p>
            </div>
          </div>
          <div className="relative">
            <div className={cn("icon-circle size-10", color)}>
              <Icon className="size-5 text-white" />
            </div>
            {alertDot && (
              <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const { plants, loading: plantsLoading } = usePlants();
  const { tasks: todayTasks, loading: tasksLoading } = useTasks("today");
  const { weather, loading: weatherLoading, alerts } = useWeather();
  const { gardens, activeGardenId } = useGardenStore();
  const activeGarden = gardens.find((g) => g.id === activeGardenId);
  const { items: supplyItems } = useSuppliesStore();
  const taskOrder = useOrderStore((s) => s.taskOrder);
  const moon = getMoonPhase(new Date());

  const [growthData, setGrowthData] = useState<{ plantName: string; data: { date: string; value: number }[] } | null>(null);

  useEffect(() => {
    async function loadGrowthData() {
      const allLogs = await db.logEntries.where('type').equals('measurement').toArray();
      const heightLogs = allLogs.filter((l) => l.unit === 'cm' && l.value != null);
      if (heightLogs.length === 0) return;
      const byPlant = new Map<number, typeof heightLogs>();
      for (const log of heightLogs) {
        const arr = byPlant.get(log.plantId) ?? [];
        arr.push(log);
        byPlant.set(log.plantId, arr);
      }
      let latestPlantId = 0;
      let latestDate = 0;
      for (const [pid, logs] of byPlant) {
        const maxDate = Math.max(...logs.map((l) => new Date(l.createdAt).getTime()));
        if (maxDate > latestDate) {
          latestDate = maxDate;
          latestPlantId = pid;
        }
      }
      const plant = await db.plants.get(latestPlantId);
      if (!plant) return;
      const logs = byPlant.get(latestPlantId) ?? [];
      const data = logs
        .map((l) => ({ date: new Date(l.createdAt).toISOString(), value: l.value! }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setGrowthData({ plantName: plant.name, data });
    }
    loadGrowthData();
  }, []);

  const lowStockSupplies = supplyItems.filter((i) => i.quantity <= i.minThreshold);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const overdueTasks = todayTasks.filter((t) => new Date(t.dueDate) < new Date() && !t.completed);
  const hasWeatherAlerts = alerts.length > 0;

  return (
    <PageShell>
      <div className="space-y-6">
        {/* Greeting */}
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <p className="text-sm text-muted-foreground font-medium">{today}</p>
              {activeGarden && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-300">
                  <Flower2 className="size-3" />
                  {activeGarden.name}
                </span>
              )}
            </div>
            <h2 className="text-2xl font-bold tracking-tight mt-0.5">Welcome back</h2>
            <p className="text-sm text-muted-foreground mt-1">Here is what is happening in your garden today.</p>
          </div>
          <Button onClick={() => router.push("/plants/new")} className="gap-2 bg-emerald-600 hover:bg-emerald-700">
            <Plus className="size-4" />
            Add Plant
          </Button>
        </div>

        {/* Weather Alerts */}
        {hasWeatherAlerts && (
          <AlertBanner alerts={alerts} onViewAll={() => router.push("/weather")} />
        )}

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Active Plants"
            value={plantsLoading ? "—" : String(plants.length)}
            subtitle={plants.length === 0 ? "Add your first plant" : `${plants.filter((p) => p.category === "vegetable").length} veg, ${plants.filter((p) => p.category === "herb").length} herbs`}
            icon={Leaf}
            color="bg-emerald-500"
            gradient="gradient-emerald"
            onClick={() => router.push("/plants")}
          />
          <StatCard
            title="Today's Tasks"
            value={tasksLoading ? "—" : String(todayTasks.filter((t) => !t.completed).length)}
            subtitle={overdueTasks.length > 0 ? `${overdueTasks.length} overdue` : "All caught up"}
            icon={Calendar}
            color="bg-blue-500"
            gradient="gradient-blue"
            onClick={() => router.push("/tasks")}
          />
          <StatCard
            title="Temperature"
            value={weatherLoading || !weather ? "—" : `${Math.round(weather.current.temperature)}°C`}
            subtitle={weather ? `Feels like ${Math.round(weather.current.feelsLike)}°C` : "Optimal: 18-26°C"}
            icon={Thermometer}
            color="bg-amber-500"
            gradient="gradient-amber"
            onClick={() => router.push("/weather")}
            alertDot={hasWeatherAlerts}
          />
          <StatCard
            title="Moon Phase"
            value={moon.name}
            subtitle={`${moon.illumination}% illuminated · ${getMoonPhaseEmoji(moon.phase)}`}
            icon={Sun}
            color="bg-rose-400"
            gradient="gradient-rose"
          />
          <StatCard
            title="Supplies"
            value={String(lowStockSupplies.length)}
            subtitle={lowStockSupplies.length > 0 ? `${lowStockSupplies.length} low on stock` : "All stocked up"}
            icon={Package}
            color={lowStockSupplies.length > 0 ? "bg-amber-500" : "bg-emerald-500"}
            gradient={lowStockSupplies.length > 0 ? "gradient-amber" : "gradient-emerald"}
            hasAlert={lowStockSupplies.length > 0}
            alertDot={lowStockSupplies.length > 0}
            onClick={() => router.push("/supplies")}
          />
        </div>

        {/* Main Content */}
        <div className="grid gap-5 lg:grid-cols-5">
          {/* Tasks */}
          <Card className="lg:col-span-3 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold">Upcoming Tasks</h3>
                  <p className="text-xs text-muted-foreground">Your scheduled garden tasks</p>
                </div>
                <div className="flex items-center gap-2">
                  {taskOrder.length > 0 && (
                    <span className="text-[11px] text-emerald-600 font-medium">
                      Reordered by priority
                    </span>
                  )}
                  <Button variant="ghost" size="sm" className="gap-1 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50" onClick={() => router.push("/tasks")}>
                    View all <ArrowRight className="size-3" />
                  </Button>
                </div>
              </div>

              {tasksLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-12 animate-pulse rounded-lg bg-muted" />
                  ))}
                </div>
              ) : todayTasks.filter((t) => !t.completed).length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center rounded-xl bg-muted/30">
                  <div className="icon-circle size-12 bg-emerald-100 dark:bg-emerald-950/30 mb-3">
                    <Sprout className="size-6 text-emerald-500" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">No tasks for today</p>
                  <p className="text-xs text-muted-foreground mt-1">Add plants to generate care tasks</p>
                  <Button variant="outline" size="sm" className="mt-3 gap-1" onClick={() => router.push("/plants/new")}>
                    <Plus className="size-3" /> Add Plant
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {todayTasks.filter((t) => !t.completed).slice(0, 5).map((task) => (
                    <div
                      key={task.id}
                      className={cn(
                        "flex items-center justify-between rounded-xl border px-4 py-3 transition-colors hover:bg-accent/50 cursor-pointer",
                        overdueTasks.includes(task) && "border-red-200 bg-red-50/50 dark:border-red-900/30 dark:bg-red-950/10"
                      )}
                      onClick={() => router.push("/tasks")}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={cn(
                          "icon-circle size-8 shrink-0",
                          task.type === "water" && "bg-blue-100 text-blue-600 dark:bg-blue-950/30",
                          task.type === "feed" && "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/30",
                          task.type === "prune" && "bg-amber-100 text-amber-600 dark:bg-amber-950/30",
                          task.type === "harvest" && "bg-purple-100 text-purple-600 dark:bg-purple-950/30",
                          !["water", "feed", "prune", "harvest"].includes(task.type) && "bg-slate-100 text-slate-600 dark:bg-slate-950/30"
                        )}>
                          <Sprout className="size-4" />
                        </div>
                        <span className="text-sm font-medium truncate">{task.title}</span>
                      </div>
                      <span className="text-xs text-muted-foreground capitalize shrink-0 ml-2">
                        {task.type.replace("_", " ")}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Weather */}
          <Card className="lg:col-span-2 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold">Weather</h3>
                  <p className="text-xs text-muted-foreground">Current conditions</p>
                </div>
                <Button variant="ghost" size="sm" className="gap-1 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50" onClick={() => router.push("/weather")}>
                  Details <ArrowRight className="size-3" />
                </Button>
              </div>

              {weatherLoading || !weather ? (
                <div className="flex flex-col items-center justify-center py-10 text-center rounded-xl bg-muted/30">
                  <div className="icon-circle size-12 bg-amber-100 dark:bg-amber-950/30 mb-3">
                    <Sun className="size-6 text-amber-500 animate-pulse" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">Loading weather...</p>
                  <p className="text-xs text-muted-foreground mt-1">Fetching forecast data</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="text-5xl">{getWeatherIcon(weather.current.weatherCode)}</span>
                    <div>
                      <p className="text-3xl font-bold">{Math.round(weather.current.temperature)}°C</p>
                      <p className="text-sm text-muted-foreground">{getWeatherDescription(weather.current.weatherCode)}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 rounded-lg bg-muted/40 px-3 py-2">
                      <Droplets className="size-4 text-blue-500" />
                      <span className="text-sm">{weather.current.humidity}%</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg bg-muted/40 px-3 py-2">
                      <Wind className="size-4 text-slate-500" />
                      <span className="text-sm">{weather.current.windSpeed} km/h</span>
                    </div>
                  </div>

                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {weather.daily.time.slice(0, 5).map((t, i) => (
                      <div key={t} className="flex min-w-[64px] flex-col items-center rounded-xl bg-muted/30 p-2.5 text-center">
                        <span className="text-[10px] text-muted-foreground font-medium">
                          {new Date(t).toLocaleDateString(undefined, { weekday: "short" })}
                        </span>
                        <span className="text-xl my-1">{getWeatherIcon(weather.daily.weatherCode[i])}</span>
                        <span className="text-xs font-semibold">{Math.round(weather.daily.temperatureMax[i])}°</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}
