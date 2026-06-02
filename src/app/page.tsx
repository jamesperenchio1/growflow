"use client";

import { Leaf, Droplets, Sun, Thermometer, Sprout, Calendar, ArrowRight, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePlants } from "@/hooks/use-plants";
import { useTasks } from "@/hooks/use-tasks";
import { useWeather } from "@/hooks/use-weather";
import { getWeatherIcon, getWeatherDescription } from "@/lib/api/weather";
import { getMoonPhase } from "@/lib/api/moon";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const router = useRouter();
  const { plants, loading: plantsLoading } = usePlants();
  const { tasks: todayTasks, loading: tasksLoading } = useTasks("today");
  const { weather, loading: weatherLoading } = useWeather();
  const moon = getMoonPhase(new Date());

  const overdueTasks = todayTasks.filter((t) => new Date(t.dueDate) < new Date() && !t.completed);

  return (
    <PageShell>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Welcome back</h2>
          <p className="text-muted-foreground">Here is what is happening in your garden today.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Plants</CardTitle>
              <Leaf className="size-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{plantsLoading ? "--" : plants.length}</div>
              <p className="text-xs text-muted-foreground">
                {plants.length === 0 ? "Add your first plant to get started" : `${plants.filter(p => p.category === 'vegetable').length} vegetables, ${plants.filter(p => p.category === 'herb').length} herbs`}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Today&apos;s Tasks</CardTitle>
              <Calendar className="size-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tasksLoading ? "--" : todayTasks.filter(t => !t.completed).length}</div>
              <p className="text-xs text-muted-foreground">
                {overdueTasks.length > 0 ? `${overdueTasks.length} overdue` : "All caught up"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Temperature</CardTitle>
              <Thermometer className="size-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {weatherLoading || !weather ? "--" : `${Math.round(weather.current.temperature)}°C`}
              </div>
              <p className="text-xs text-muted-foreground">
                {weather ? `Feels like ${Math.round(weather.current.feelsLike)}°C` : "Optimal: 18-26°C"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Moon Phase</CardTitle>
              <Sun className="size-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{moon.name}</div>
              <p className="text-xs text-muted-foreground">{Math.round(moon.illumination * 100)}% illuminated</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Upcoming Tasks</CardTitle>
                <CardDescription>Your scheduled garden tasks</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="gap-1" onClick={() => router.push("/tasks")}>
                View all <ArrowRight className="size-3" />
              </Button>
            </CardHeader>
            <CardContent>
              {tasksLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-10 animate-pulse rounded bg-muted" />
                  ))}
                </div>
              ) : todayTasks.filter(t => !t.completed).length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <CheckCircle2 className="size-8 text-muted-foreground/50" />
                  <p className="mt-2 text-sm text-muted-foreground">No tasks for today</p>
                  <p className="text-xs text-muted-foreground">Add plants to generate care tasks</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {todayTasks.filter(t => !t.completed).slice(0, 5).map((task) => (
                    <div
                      key={task.id}
                      className={cn(
                        "flex items-center justify-between rounded-lg border px-3 py-2",
                        overdueTasks.includes(task) && "border-red-200 bg-red-50/50 dark:border-red-900/30 dark:bg-red-950/10"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <Sprout className="size-4 text-emerald-500" />
                        <span className="text-sm">{task.title}</span>
                      </div>
                      <Badge variant="secondary" className="text-xs capitalize">
                        {task.type.replace("_", " ")}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Weather</CardTitle>
                <CardDescription>Current conditions</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="gap-1" onClick={() => router.push("/weather")}>
                Details <ArrowRight className="size-3" />
              </Button>
            </CardHeader>
            <CardContent>
              {weatherLoading || !weather ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Sun className="size-8 text-muted-foreground/50" />
                  <p className="mt-2 text-sm text-muted-foreground">Loading weather...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{getWeatherIcon(weather.current.weatherCode)}</span>
                    <div>
                      <p className="text-2xl font-bold">{Math.round(weather.current.temperature)}°C</p>
                      <p className="text-sm text-muted-foreground">{getWeatherDescription(weather.current.weatherCode)}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Droplets className="size-4 text-blue-500" />
                      <span>Humidity {weather.current.humidity}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Thermometer className="size-4 text-orange-500" />
                      <span>Wind {weather.current.windSpeed} km/h</span>
                    </div>
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {weather.daily.time.slice(0, 5).map((t, i) => (
                      <div key={t} className="flex min-w-[60px] flex-col items-center rounded-lg border p-2 text-center">
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(t).toLocaleDateString(undefined, { weekday: "short" })}
                        </span>
                        <span className="text-lg">{getWeatherIcon(weather.daily.weatherCode[i])}</span>
                        <span className="text-xs">{Math.round(weather.daily.temperatureMax[i])}°</span>
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
