"use client";

import { Suspense } from "react";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Leaf, ArrowLeft, Trash2, Sprout, Droplets, Sun, CalendarDays, StickyNote } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { usePlants } from "@/hooks/use-plants";
import { useTasks } from "@/hooks/use-tasks";
import { getSeedPlantByName } from "@/data/seed-plants";
import { getNutrientTarget } from "@/data/nutrients";
import { getYieldReference } from "@/data/yield-references";
import { getMoonPhase } from "@/lib/api/moon";
import { cn } from "@/lib/utils";

function PlantDetailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plantId = Number(searchParams.get("id"));
  const { plants, loading, updatePlant, deletePlant } = usePlants();
  const { tasks } = useTasks();
  const [plant, setPlant] = useState<(typeof plants)[number] | null>(null);
  const [refData, setRefData] = useState<ReturnType<typeof getSeedPlantByName>>(undefined);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!plantId || loading) return;
    const p = plants.find((p) => p.id === plantId) ?? null;
    setPlant(p);
    if (p) {
      setRefData(getSeedPlantByName(p.name));
      setNotes(p.notes ?? "");
    }
  }, [plantId, plants, loading]);

  const plantTasks = tasks.filter((t) => t.plantId === plantId);
  const daysSincePlanted = plant
    ? Math.floor((Date.now() - new Date(plant.plantedDate).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  if (loading) {
    return (
      <PageShell>
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 rounded bg-muted" />
          <div className="h-40 rounded bg-muted" />
        </div>
      </PageShell>
    );
  }

  if (!plant) {
    return (
      <PageShell>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Plant not found</p>
          <Button variant="outline" className="mt-4 gap-2" onClick={() => router.push("/plants")}>
            <ArrowLeft className="size-4" /> Back to Plants
          </Button>
        </div>
      </PageShell>
    );
  }

  const yieldRef = getYieldReference(plant.name);

  return (
    <PageShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => router.push("/plants")}>
              <ArrowLeft className="size-4" />
            </Button>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">{plant.name}</h2>
              <p className="text-sm text-muted-foreground">
                {plant.variety && `${plant.variety} · `}
                Planted {new Date(plant.plantedDate).toLocaleDateString()} · {daysSincePlanted} days ago
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-destructive"
            onClick={async () => {
              if (confirm("Delete this plant and all related data?")) {
                await deletePlant(plantId);
                router.push("/plants");
              }
            }}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Category</CardTitle>
              <Leaf className="size-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">{plant.category}</div>
              <p className="text-xs text-muted-foreground">{plant.growingMethod}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Age</CardTitle>
              <CalendarDays className="size-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{daysSincePlanted}d</div>
              <p className="text-xs text-muted-foreground">
                {refData ? `Harvest in ~${Math.max(0, refData.daysToHarvest - daysSincePlanted)}d` : "Growing"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Sun</CardTitle>
              <Sun className="size-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{refData ? `${refData.sunHours}h` : "--"}</div>
              <p className="text-xs text-muted-foreground">Daily requirement</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Tasks</CardTitle>
              <Sprout className="size-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{plantTasks.filter((t) => !t.completed).length}</div>
              <p className="text-xs text-muted-foreground">
                {plantTasks.filter((t) => t.completed).length} completed
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Droplets className="size-5 text-blue-500" />
                Nutrient Targets
              </CardTitle>
            </CardHeader>
            <CardContent>
              {refData ? (
                <div className="space-y-2">
                  {(["seedling", "vegetative", "flowering", "fruiting"] as const).map((stage) => {
                    const target = getNutrientTarget(plant.name, stage);
                    if (!target) return null;
                    return (
                      <div key={stage} className="flex items-center justify-between rounded-lg border px-3 py-2">
                        <span className="text-sm font-medium capitalize">{stage}</span>
                        <div className="flex gap-3 text-xs">
                          <span className="text-blue-600 dark:text-blue-300">
                            EC {target.ec[0]}-{target.ec[1]}
                          </span>
                          <span className="text-emerald-600 dark:text-emerald-300">
                            pH {target.ph[0]}-{target.ph[1]}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No nutrient data available for this plant.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <StickyNote className="size-5 text-amber-500" />
                Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                onBlur={() => updatePlant(plantId, { notes })}
                placeholder="Add observations, treatments, reminders..."
                className="min-h-[120px]"
              />
            </CardContent>
          </Card>
        </div>

        {yieldRef && (
          <Card>
            <CardHeader>
              <CardTitle>Yield Reference</CardTitle>
              <CardDescription>Expected harvest for {yieldRef.plantName}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>
                <strong>Expected yield:</strong> ~{yieldRef.expectedYieldGramsPerPlant}g per plant
              </p>
              <p>
                <strong>First harvest:</strong> ~{yieldRef.daysToFirstHarvest} days after planting
              </p>
              <p>
                <strong>Harvest window:</strong> {yieldRef.daysToFirstHarvest}-{yieldRef.daysToLastHarvest} days
              </p>
              <p className="text-muted-foreground">{yieldRef.tips}</p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Recent Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            {plantTasks.length === 0 ? (
              <p className="text-sm text-muted-foreground">No tasks for this plant yet.</p>
            ) : (
              <div className="space-y-2">
                {plantTasks.slice(0, 8).map((task) => (
                  <div
                    key={task.id}
                    className={cn(
                      "flex items-center justify-between rounded-lg border px-3 py-2",
                      task.completed && "opacity-50 line-through"
                    )}
                  >
                    <span className="text-sm">{task.title}</span>
                    <Badge variant="secondary" className="text-xs capitalize">
                      {task.type.replace("_", " ")}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}

export default function PlantDetailPage() {
  return (
    <Suspense fallback={
      <PageShell>
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 rounded bg-muted" />
          <div className="h-40 rounded bg-muted" />
        </div>
      </PageShell>
    }>
      <PlantDetailContent />
    </Suspense>
  );
}
