"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Leaf, Search, Plus, Droplets, Sun, BookOpen } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { usePlants } from "@/hooks/use-plants";
import { db } from "@/lib/db";
import { cn } from "@/lib/utils";

const categories = ["all", "vegetable", "herb", "fruit", "flower"] as const;

const categoryColors: Record<string, string> = {
  vegetable: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300",
  herb: "bg-teal-100 text-teal-700 dark:bg-teal-950/30 dark:text-teal-300",
  fruit: "bg-rose-100 text-rose-700 dark:bg-rose-950/30 dark:text-rose-300",
  flower: "bg-violet-100 text-violet-700 dark:bg-violet-950/30 dark:text-violet-300",
};

export default function PlantsPage() {
  const router = useRouter();
  const { plants, loading } = usePlants();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof categories)[number]>("all");
  const [plantsWithLogs, setPlantsWithLogs] = useState<Set<number>>(new Set());

  useEffect(() => {
    db.logEntries.toArray().then((logs) => {
      const ids = new Set(logs.map((l) => l.plantId));
      setPlantsWithLogs(ids);
    });
  }, [plants]);

  const filtered = plants.filter((p) => {
    const matchesQuery =
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      (p.variety?.toLowerCase().includes(query.toLowerCase()) ?? false);
    const matchesCategory = category === "all" || p.category === category;
    return matchesQuery && matchesCategory;
  });

  return (
    <PageShell>
      <div className="space-y-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">My Plants</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {plants.length} plant{plants.length !== 1 ? "s" : ""} in your garden
            </p>
          </div>
          <Button onClick={() => router.push("/plants/new")} className="gap-2 bg-emerald-600 hover:bg-emerald-700">
            <Plus className="size-4" />
            Add Plant
          </Button>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search plants..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-1.5">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-sm font-medium capitalize transition-all",
                  category === c
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300"
                    : "border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="h-36 animate-pulse bg-muted border-0" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <Card className="shadow-sm">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="icon-circle size-16 bg-emerald-100 dark:bg-emerald-950/30 mb-4">
                <Leaf className="size-8 text-emerald-500" />
              </div>
              <p className="text-base font-medium text-muted-foreground">No plants found</p>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                {plants.length === 0
                  ? "Add your first plant to start tracking your garden's growth"
                  : "Try a different search or filter"}
              </p>
              {plants.length === 0 && (
                <Button className="mt-4 gap-2 bg-emerald-600 hover:bg-emerald-700" onClick={() => router.push("/plants/new")}>
                  <Plus className="size-4" />
                  Add Your First Plant
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((plant) => (
              <Card
                key={plant.id}
                className="card-hover cursor-pointer shadow-sm"
                onClick={() => router.push(`/plants/detail?id=${plant.id}`)}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="icon-circle size-11 bg-emerald-50 dark:bg-emerald-950/30 overflow-hidden">
                        {plant.photoUrl ? (
                          <img src={plant.photoUrl} alt={plant.name} className="size-11 object-cover" />
                        ) : (
                          <Leaf className="size-5 text-emerald-500" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold truncate">{plant.name}</p>
                        {plant.variety && (
                          <p className="text-xs text-muted-foreground truncate">{plant.variety}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <Badge variant="secondary" className={cn("text-xs capitalize shrink-0", categoryColors[plant.category])}>
                        {plant.category}
                      </Badge>
                      {plant.id !== undefined && plantsWithLogs.has(plant.id) && (
                        <Badge variant="outline" className="text-[10px] h-5 gap-1">
                          <BookOpen className="size-3" />
                          Journal
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Droplets className="size-3.5" />
                      <span className="capitalize">{plant.growingMethod}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Sun className="size-3.5" />
                      {new Date(plant.plantedDate).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                    </span>
                  </div>
                  {plant.healthTags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {plant.healthTags.map((tag, i) => (
                        <Badge
                          key={i}
                          variant="secondary"
                          className={cn(
                            "text-xs",
                            tag.severity === "high" && "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-300",
                            tag.severity === "medium" && "bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300",
                            tag.severity === "low" && "bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300"
                          )}
                        >
                          {tag.value}
                        </Badge>
                      ))}
                    </div>
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
