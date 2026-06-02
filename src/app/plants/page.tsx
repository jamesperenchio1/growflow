"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Leaf, Search, Plus, Droplets, Sun } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePlants } from "@/hooks/use-plants";
import { cn } from "@/lib/utils";

const categories = ["all", "vegetable", "herb", "fruit", "flower"] as const;

export default function PlantsPage() {
  const router = useRouter();
  const { plants, loading } = usePlants();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof categories)[number]>("all");

  const filtered = plants.filter((p) => {
    const matchesQuery = p.name.toLowerCase().includes(query.toLowerCase()) ||
      (p.variety?.toLowerCase().includes(query.toLowerCase()) ?? false);
    const matchesCategory = category === "all" || p.category === category;
    return matchesQuery && matchesCategory;
  });

  return (
    <PageShell>
      <div className="space-y-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">My Plants</h2>
            <p className="text-muted-foreground">
              {plants.length} plant{plants.length !== 1 ? "s" : ""} in your garden
            </p>
          </div>
          <Button onClick={() => router.push("/plants/new")} className="gap-2">
            <Plus className="size-4" />
            Add Plant
          </Button>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search plants..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Tabs value={category} onValueChange={(v) => setCategory(v as (typeof categories)[number])}>
            <TabsList>
              {categories.map((c) => (
                <TabsTrigger key={c} value={c} className="capitalize">
                  {c}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="h-32 animate-pulse bg-muted" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Leaf className="size-10 text-muted-foreground/50" />
              <p className="mt-3 text-sm text-muted-foreground">No plants found</p>
              <p className="text-xs text-muted-foreground">
                {plants.length === 0 ? "Add your first plant to get started" : "Try a different search or filter"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((plant) => (
              <Card
                key={plant.id}
                className="cursor-pointer transition-shadow hover:shadow-md"
                onClick={() => router.push(`/plants/detail?id=${plant.id}`)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/30">
                        <Leaf className="size-5 text-emerald-500" />
                      </div>
                      <div>
                        <p className="font-medium">{plant.name}</p>
                        {plant.variety && (
                          <p className="text-xs text-muted-foreground">{plant.variety}</p>
                        )}
                      </div>
                    </div>
                    <Badge variant="outline" className="capitalize">
                      {plant.category}
                    </Badge>
                  </div>
                  <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Droplets className="size-3" />
                      {plant.growingMethod}
                    </span>
                    <span className="flex items-center gap-1">
                      <Sun className="size-3" />
                      {new Date(plant.plantedDate).toLocaleDateString()}
                    </span>
                  </div>
                  {plant.healthTags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
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
