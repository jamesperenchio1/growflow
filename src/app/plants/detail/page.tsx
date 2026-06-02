"use client";

import { Suspense } from "react";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Leaf, ArrowLeft, Trash2, Sprout, Droplets, Sun, CalendarDays, StickyNote, Beaker, TrendingUp } from "lucide-react";
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
import { getMoonPhase, getMoonPhaseEmoji } from "@/lib/api/moon";
import { cn } from "@/lib/utils";

function StatPill({ icon: Icon, label, value, color }: { icon: typeof Leaf; label: string; value: string; color: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-muted/40 px-4 py-3">
      <div className={cn("icon-circle size-9", color)}>
        <Icon className="size-4 text-white" />
      </div>
      <div>
        <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">{label}</p>
        <p className="font-semibold text-sm">{value}</p>
      </div>
    </div>
  );
}

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
          <div className="h-8 w-48 rounded-xl bg-muted" />
          <div className="h-40 rounded-xl bg-muted" />
        </div>
      </PageShell>
    );
  }

  if (!plant) {
    return (
      <PageShell>
        <div className="text-center py-20">
          <div className="icon-circle size-16 bg-muted mx-auto mb-4">
            <Leaf className="size-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground font-medium">Plant not found</p>
          <Button variant="outline" className="mt-4 gap-2" onClick={() => router.push("/plants")}>
            <ArrowLeft className="size-4" /> Back to Plants
          </Button>
        </div>
      </PageShell>
    );
  }

  const yieldRef = getYieldReference(plant.name);
  const moon = getMoonPhase(new Date());

  return (
    <PageShell>
      <div className="space-y-5 page-enter">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => router.push("/plants")} className="text-muted-foreground">
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
            className="text-muted-foreground/50 hover:text-destructive"
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

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatPill icon={Leaf} label="Category" value={plant.category} color="bg-emerald-500" />
          <StatPill icon={CalendarDays} label="Age" value={`${daysSincePlanted}d`} color="bg-blue-500" />
          <StatPill icon={Sun} label="Sun" value={refData ? `${refData.sunHours}h/day` : "—"} color="bg-amber-500" />
          <StatPill icon={Sprout} label="Tasks" value={`${plantTasks.filter((t) => !t.completed).length} open`} color="bg-purple-500" />
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {/* Nutrients */}
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <div className="icon-circle size-9 bg-blue-100 dark:bg-blue-950/30">
                  <Beaker className="size-4 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-base">Nutrient Targets</CardTitle>
                  <CardDescription>Per growth stage</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {refData ? (
                <div className="space-y-2">
                  {(["seedling", "vegetative", "flowering", "fruiting"] as const).map((stage) => {
                    const target = getNutrientTarget(plant.name, stage);
                    if (!target) return null;
                    return (
                      <div key={stage} className="flex items-center justify-between rounded-xl border px-4 py-2.5 transition-colors hover:bg-accent/30">
                        <span className="text-sm font-medium capitalize">{stage}</span>
                        <div className="flex gap-2 text-xs font-semibold">
                          <span className="text-blue-600 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/20 px-2 py-0.5 rounded-full">
                            EC {target.ec[0]}-{target.ec[1]}
                          </span>
                          <span className="text-emerald-600 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-full">
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

          {/* Notes */}
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <div className="icon-circle size-9 bg-amber-100 dark:bg-amber-950/30">
                  <StickyNote className="size-4 text-amber-600" />
                </div>
                <div>
                  <CardTitle className="text-base">Notes</CardTitle>
                  <CardDescription>Observations and reminders</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                onBlur={() => updatePlant(plantId, { notes })}
                placeholder="Add observations, treatments, reminders..."
                className="min-h-[140px] resize-none"
              />
            </CardContent>
          </Card>
        </div>

        {yieldRef && (
          <Card className="border-0 shadow-sm gradient-emerald">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <div className="icon-circle size-9 bg-emerald-500 text-white">
                  <TrendingUp className="size-4" />
                </div>
                <div>
                  <CardTitle className="text-base">Yield Reference</CardTitle>
                  <CardDescription>Expected harvest for {yieldRef.plantName}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-card/60 px-4 py-3">
                  <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">Expected Yield</p>
                  <p className="font-bold text-lg mt-0.5">~{yieldRef.expectedYieldGramsPerPlant}g</p>
                  <p className="text-[10px] text-muted-foreground">per plant</p>
                </div>
                <div className="rounded-xl bg-card/60 px-4 py-3">
                  <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">First Harvest</p>
                  <p className="font-bold text-lg mt-0.5">~{yieldRef.daysToFirstHarvest}d</p>
                  <p className="text-[10px] text-muted-foreground">after planting</p>
                </div>
                <div className="rounded-xl bg-card/60 px-4 py-3">
                  <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">Harvest Window</p>
                  <p className="font-bold text-lg mt-0.5">{yieldRef.daysToFirstHarvest}-{yieldRef.daysToLastHarvest}d</p>
                  <p className="text-[10px] text-muted-foreground">total range</p>
                </div>
              </div>
              <p className="text-muted-foreground text-xs mt-2">{yieldRef.tips}</p>
            </CardContent>
          </Card>
        )}

        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Recent Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            {plantTasks.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">No tasks for this plant yet.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {plantTasks.slice(0, 8).map((task) => (
                  <div
                    key={task.id}
                    className={cn(
                      "flex items-center justify-between rounded-xl border px-4 py-3 transition-colors hover:bg-accent/30",
                      task.completed && "opacity-50 line-through"
                    )}
                  >
                    <span className="text-sm font-medium">{task.title}</span>
                    <Badge variant="secondary" className="text-[10px] h-5 capitalize">
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
    <Suspense
      fallback={
        <PageShell>
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-48 rounded-xl bg-muted" />
            <div className="h-40 rounded-xl bg-muted" />
          </div>
        </PageShell>
      }
    >
      <PlantDetailContent />
    </Suspense>
  );
}
