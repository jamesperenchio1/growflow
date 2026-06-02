"use client";

import { useState } from "react";
import { CheckCircle2, Circle, Clock, Calendar, AlertCircle, Trash2, Sprout, Droplets, Scissors, Pickaxe, Beaker, Shovel, Bug } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTasks } from "@/hooks/use-tasks";
import { cn } from "@/lib/utils";

type Filter = "today" | "week" | "overdue" | "completed";

const filters: { value: Filter; label: string; icon: typeof Clock }[] = [
  { value: "today", label: "Today", icon: Clock },
  { value: "week", label: "This Week", icon: Calendar },
  { value: "overdue", label: "Overdue", icon: AlertCircle },
  { value: "completed", label: "Completed", icon: CheckCircle2 },
];

const taskTypeConfig: Record<string, { icon: typeof Sprout; color: string; bg: string }> = {
  water: { icon: Droplets, color: "text-blue-600 dark:text-blue-300", bg: "bg-blue-50 dark:bg-blue-950/20" },
  feed: { icon: Sprout, color: "text-emerald-600 dark:text-emerald-300", bg: "bg-emerald-50 dark:bg-emerald-950/20" },
  prune: { icon: Scissors, color: "text-amber-600 dark:text-amber-300", bg: "bg-amber-50 dark:bg-amber-950/20" },
  harvest: { icon: Pickaxe, color: "text-purple-600 dark:text-purple-300", bg: "bg-purple-50 dark:bg-purple-950/20" },
  check_ph_ec: { icon: Beaker, color: "text-cyan-600 dark:text-cyan-300", bg: "bg-cyan-50 dark:bg-cyan-950/20" },
  transplant: { icon: Shovel, color: "text-orange-600 dark:text-orange-300", bg: "bg-orange-50 dark:bg-orange-950/20" },
  pest_control: { icon: Bug, color: "text-red-600 dark:text-red-300", bg: "bg-red-50 dark:bg-red-950/20" },
};

export default function TasksPage() {
  const [filter, setFilter] = useState<Filter>("today");
  const { tasks, loading, completeTask, deleteTask } = useTasks(filter);

  return (
    <PageShell>
      <div className="space-y-5">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Tasks</h2>
          <p className="text-sm text-muted-foreground mt-1">Stay on top of your garden care schedule.</p>
        </div>

        {/* Tabs */}
        <div className="inline-flex rounded-xl bg-muted/60 p-1">
          {filters.map((f) => {
            const Icon = f.icon;
            return (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all",
                  filter === f.value
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="size-4" />
                <span className="hidden sm:inline">{f.label}</span>
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="h-20 animate-pulse bg-muted border-0" />
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <Card className="shadow-sm">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="icon-circle size-16 bg-emerald-100 dark:bg-emerald-950/30 mb-4">
                <CheckCircle2 className="size-8 text-emerald-500" />
              </div>
              <p className="text-base font-medium text-muted-foreground">
                {filter === "completed" ? "No completed tasks yet" : `No ${filter} tasks`}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {filter === "today" && "All caught up for today!"}
                {filter === "overdue" && "Nothing overdue — great job!"}
                {filter === "week" && "No tasks scheduled this week"}
                {filter === "completed" && "Complete a task to see it here"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2.5">
            {tasks.map((task) => {
              const config = taskTypeConfig[task.type] || taskTypeConfig.custom || { icon: Sprout, color: "text-slate-600", bg: "bg-slate-50" };
              const Icon = config.icon;
              return (
                <Card
                  key={task.id}
                  className={cn("shadow-sm transition-colors hover:bg-accent/30", task.completed && "opacity-50")}
                >
                  <CardContent className="flex items-center gap-4 p-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="shrink-0 size-9"
                      onClick={() => !task.completed && task.id && completeTask(task.id)}
                      disabled={task.completed}
                    >
                      {task.completed ? (
                        <CheckCircle2 className="size-5 text-emerald-500" />
                      ) : (
                        <Circle className="size-5 text-muted-foreground/40 hover:text-emerald-500 transition-colors" />
                      )}
                    </Button>

                    <div className="min-w-0 flex-1">
                      <p className={cn("text-sm font-medium", task.completed && "line-through text-muted-foreground")}>
                        {task.title}
                      </p>
                      {task.description && (
                        <p className="text-xs text-muted-foreground truncate">{task.description}</p>
                      )}
                      <div className="mt-1.5 flex items-center gap-2">
                        <span className={cn("inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium", config.bg, config.color)}>
                          <Icon className="size-3" />
                          {task.type.replace("_", " ")}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          {new Date(task.dueDate).toLocaleDateString(undefined, {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                        {task.recurring && (
                          <Badge variant="outline" className="text-[10px] h-5">
                            Every {task.recurring.intervalDays}d
                          </Badge>
                        )}
                      </div>
                    </div>

                    {!task.completed && task.id && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="shrink-0 size-8 text-muted-foreground/50 hover:text-destructive"
                        onClick={() => deleteTask(task.id!)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </PageShell>
  );
}
