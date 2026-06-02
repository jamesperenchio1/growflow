"use client";

import { useState } from "react";
import { CheckCircle2, Circle, Clock, AlertCircle, Trash2, Calendar } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTasks } from "@/hooks/use-tasks";
import { cn } from "@/lib/utils";

type Filter = "today" | "week" | "overdue" | "completed";

const filters: { value: Filter; label: string; icon: typeof Clock }[] = [
  { value: "today", label: "Today", icon: Clock },
  { value: "week", label: "This Week", icon: Calendar },
  { value: "overdue", label: "Overdue", icon: AlertCircle },
  { value: "completed", label: "Completed", icon: CheckCircle2 },
];

const taskTypeColors: Record<string, string> = {
  water: "bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300",
  feed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300",
  prune: "bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300",
  harvest: "bg-purple-100 text-purple-700 dark:bg-purple-950/30 dark:text-purple-300",
  check_ph_ec: "bg-cyan-100 text-cyan-700 dark:bg-cyan-950/30 dark:text-cyan-300",
  transplant: "bg-orange-100 text-orange-700 dark:bg-orange-950/30 dark:text-orange-300",
  pest_control: "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-300",
};

export default function TasksPage() {
  const [filter, setFilter] = useState<Filter>("today");
  const { tasks, loading, completeTask, deleteTask } = useTasks(filter);

  return (
    <PageShell>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Tasks</h2>
          <p className="text-muted-foreground">Stay on top of your garden care schedule.</p>
        </div>

        <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
          <TabsList className="grid w-full grid-cols-4 sm:w-auto">
            {filters.map((f) => (
              <TabsTrigger key={f.value} value={f.value} className="gap-1.5">
                <f.icon className="size-3.5" />
                <span className="hidden sm:inline">{f.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="h-20 animate-pulse bg-muted" />
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <CheckCircle2 className="size-10 text-muted-foreground/50" />
              <p className="mt-3 text-sm text-muted-foreground">
                No {filter === "completed" ? "completed" : filter} tasks
              </p>
              <p className="text-xs text-muted-foreground">
                {filter === "today" && "All caught up for today!"}
                {filter === "overdue" && "Nothing overdue — great job!"}
                {filter === "week" && "No tasks scheduled this week"}
                {filter === "completed" && "Complete a task to see it here"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <Card key={task.id} className={cn(task.completed && "opacity-60")}>
                <CardContent className="flex items-center gap-4 p-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0"
                    onClick={() => !task.completed && task.id && completeTask(task.id)}
                    disabled={task.completed}
                  >
                    {task.completed ? (
                      <CheckCircle2 className="size-5 text-emerald-500" />
                    ) : (
                      <Circle className="size-5 text-muted-foreground" />
                    )}
                  </Button>

                  <div className="min-w-0 flex-1">
                    <p className={cn("font-medium", task.completed && "line-through")}>
                      {task.title}
                    </p>
                    {task.description && (
                      <p className="text-sm text-muted-foreground truncate">{task.description}</p>
                    )}
                    <div className="mt-1 flex items-center gap-2">
                      <Badge variant="secondary" className={cn("text-xs capitalize", taskTypeColors[task.type])}>
                        {task.type.replace("_", " ")}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(task.dueDate).toLocaleDateString(undefined, {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      {task.recurring && (
                        <Badge variant="outline" className="text-xs">
                          Repeats every {task.recurring.intervalDays}d
                        </Badge>
                      )}
                    </div>
                  </div>

                  {!task.completed && task.id && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="shrink-0 text-muted-foreground hover:text-destructive"
                      onClick={() => deleteTask(task.id!)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}
