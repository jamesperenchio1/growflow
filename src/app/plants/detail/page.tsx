"use client";

import { Suspense, useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Leaf, ArrowLeft, Trash2, Sprout, Droplets, Sun, CalendarDays, StickyNote,
  Beaker, TrendingUp, BookOpen, Camera, Scale, Plus, X, Milestone,
  Ruler, Bug, FlaskConical, Eye, NotebookPen, FileImage, Carrot, Apple, Flower
} from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select } from "@/components/ui/select";
import { usePlantDetail } from "@/hooks/use-plant-detail";
import { usePlants } from "@/hooks/use-plants";
import { useTasks } from "@/hooks/use-tasks";
import { db } from "@/lib/db";
import { getSeedPlantByName } from "@/data/seed-plants";
import { getPlantImage } from "@/data/plant-images";
import { getNutrientTarget } from "@/data/nutrients";
import { getYieldReference } from "@/data/yield-references";
import { getMoonPhase } from "@/lib/api/moon";
import { cn } from "@/lib/utils";
import type { PlantReference, Task } from "@/types";
import { GrowthChart } from "@/components/charts/growth-chart";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const TABS = ["overview", "journal", "photos", "yield", "charts"] as const;
type TabId = (typeof TABS)[number];

const tabLabels: Record<TabId, string> = {
  overview: "Overview",
  journal: "Journal",
  photos: "Photos",
  yield: "Yield",
  charts: "Charts",
};

const logTypeOptions = ["observation", "measurement", "treatment", "issue", "milestone"] as const;

const logTypeMeta: Record<string, { label: string; icon: typeof Leaf; color: string; bg: string }> = {
  observation: { label: "Observation", icon: Eye, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950/20" },
  measurement: { label: "Measurement", icon: Ruler, color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-950/20" },
  treatment: { label: "Treatment", icon: FlaskConical, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950/20" },
  issue: { label: "Issue", icon: Bug, color: "text-red-600", bg: "bg-red-50 dark:bg-red-950/20" },
  milestone: { label: "Milestone", icon: Milestone, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-950/20" },
};

const photoTypeOptions = ["plant", "seed_packet", "issue"] as const;

const categoryColors: Record<string, string> = {
  vegetable: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300",
  herb: "bg-teal-100 text-teal-700 dark:bg-teal-950/30 dark:text-teal-300",
  fruit: "bg-rose-100 text-rose-700 dark:bg-rose-950/30 dark:text-rose-300",
  flower: "bg-violet-100 text-violet-700 dark:bg-violet-950/30 dark:text-violet-300",
};

const categoryIcons: Record<string, typeof Leaf> = {
  vegetable: Carrot,
  herb: Leaf,
  fruit: Apple,
  flower: Flower,
};

function computeGrowthStage(days: number, ref?: PlantReference): string {
  if (!ref) return "growing";
  if (days < ref.daysToGermination) return "germination";
  if (days < ref.daysToSeedling) return "seedling";
  if (days < ref.daysToVegetative) return "vegetative";
  if (days < ref.daysToFlowering) return "flowering";
  if (days < ref.daysToFruiting) return "fruiting";
  if (days < ref.daysToHarvest) return "fruiting";
  return "harvesting";
}

function StatPill({ icon: Icon, label, value, color }: { icon: typeof Leaf; label: string; value: string; color: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-muted px-4 py-3">
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

function EmptyState({ icon: Icon, title, description, action }: { icon: typeof Leaf; title: string; description: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-14 text-center">
      <div className="icon-circle size-14 bg-muted mb-4">
        <Icon className="size-7 text-muted-foreground" />
      </div>
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      <p className="text-xs text-muted-foreground mt-1 max-w-xs">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

function PlantDetailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plantId = Number(searchParams.get("id"));
  const {
    plant, space, logs, photos, yields, loading, addLog, addPhoto, deletePhoto,
    addYield, deleteYield, updatePlantNotes, refresh,
  } = usePlantDetail(plantId);
  const { tasks } = useTasks();
  const { deletePlant } = usePlants();
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [notes, setNotes] = useState("");
  const [allTasks, setAllTasks] = useState<Task[]>([]);

  // Dialog states
  const [logDialogOpen, setLogDialogOpen] = useState(false);
  const [photoDialogOpen, setPhotoDialogOpen] = useState(false);
  const [yieldDialogOpen, setYieldDialogOpen] = useState(false);
  const [enlargePhoto, setEnlargePhoto] = useState<typeof photos[number] | null>(null);

  // Form states
  const [logType, setLogType] = useState<string>("observation");
  const [logTitle, setLogTitle] = useState("");
  const [logDescription, setLogDescription] = useState("");
  const [logValue, setLogValue] = useState("");
  const [logUnit, setLogUnit] = useState("");

  const [photoType, setPhotoType] = useState<string>("plant");
  const [photoCaption, setPhotoCaption] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [yieldAmount, setYieldAmount] = useState("");
  const [yieldNotes, setYieldNotes] = useState("");
  const [yieldDate, setYieldDate] = useState(new Date().toISOString().split("T")[0]);

  const [refData, setRefData] = useState<PlantReference | undefined>(undefined);

  useEffect(() => {
    if (plant) {
      setRefData(getSeedPlantByName(plant.name));
      setNotes(plant.notes ?? "");
    }
  }, [plant]);

  useEffect(() => {
    if (!plantId) return;
    db.tasks.where('plantId').equals(plantId).toArray().then(setAllTasks);
  }, [plantId]);

  const plantTasks = tasks.filter((t) => t.plantId === plantId);
  const daysSincePlanted = plant
    ? Math.floor((Date.now() - new Date(plant.plantedDate).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const handleAddLog = async () => {
    if (!logTitle.trim()) return;
    await addLog({
      type: logType,
      title: logTitle.trim(),
      description: logDescription.trim() || undefined,
      value: logValue ? Number(logValue) : undefined,
      unit: logUnit.trim() || undefined,
    });
    setLogTitle("");
    setLogDescription("");
    setLogValue("");
    setLogUnit("");
    setLogType("observation");
    setLogDialogOpen(false);
  };

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPhotoPreview(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleAddPhoto = async () => {
    if (!photoPreview) return;
    await addPhoto({
      plantId,
      dataUrl: photoPreview,
      type: photoType as "plant" | "seed_packet" | "issue",
      caption: photoCaption.trim() || undefined,
    });
    setPhotoPreview(null);
    setPhotoCaption("");
    setPhotoType("plant");
    setPhotoDialogOpen(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAddYield = async () => {
    if (!yieldAmount.trim()) return;
    await addYield({
      amountGrams: Number(yieldAmount),
      notes: yieldNotes.trim() || undefined,
      harvestedAt: new Date(yieldDate),
    });
    setYieldAmount("");
    setYieldNotes("");
    setYieldDate(new Date().toISOString().split("T")[0]);
    setYieldDialogOpen(false);
  };

  const totalYield = yields.reduce((s, r) => s + r.amountGrams, 0);
  const avgYield = yields.length > 0 ? Math.round(totalYield / yields.length) : 0;

  const heightData = useMemo(() => {
    return logs
      .filter((l) => l.type === 'measurement' && l.unit === 'cm' && l.value != null)
      .map((l) => ({
        date: new Date(l.createdAt).toISOString(),
        value: l.value!,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [logs]);

  const phData = useMemo(() => {
    return logs
      .filter((l) => l.type === 'measurement' && l.unit?.toLowerCase() === 'ph' && l.value != null)
      .map((l) => ({
        date: new Date(l.createdAt).toISOString(),
        value: l.value!,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [logs]);

  const ecData = useMemo(() => {
    return logs
      .filter((l) => l.type === 'measurement' && (l.unit?.toLowerCase() === 'ec' || l.unit?.toLowerCase() === 'ms/cm') && l.value != null)
      .map((l) => ({
        date: new Date(l.createdAt).toISOString(),
        value: l.value!,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [logs]);

  const phEcChartData = useMemo(() => {
    const map = new Map<string, { date: string; ph?: number; ec?: number }>();
    for (const d of phData) {
      const existing = map.get(d.date) ?? { date: d.date };
      existing.ph = d.value;
      map.set(d.date, existing);
    }
    for (const d of ecData) {
      const existing = map.get(d.date) ?? { date: d.date };
      existing.ec = d.value;
      map.set(d.date, existing);
    }
    return Array.from(map.values()).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [phData, ecData]);

  const taskChartData = useMemo(() => {
    const completedTasks = allTasks.filter((t) => t.completed && t.completedAt);
    if (completedTasks.length === 0) return [];
    const weeks = new Map<string, number>();
    for (const task of completedTasks) {
      const date = new Date(task.completedAt!);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      const key = weekStart.toISOString().split('T')[0];
      weeks.set(key, (weeks.get(key) || 0) + 1);
    }
    return Array.from(weeks.entries())
      .map(([date, value]) => ({ date, value }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [allTasks]);

  const yieldChartData = useMemo(() => {
    return yields
      .map((y) => ({
        date: new Date(y.harvestedAt).toISOString(),
        value: y.amountGrams,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [yields]);

  const cumulativeYieldData = useMemo(() => {
    let sum = 0;
    return yieldChartData.map((d) => {
      sum += d.value;
      return { date: d.date, value: sum };
    });
  }, [yieldChartData]);

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

  const growthStage = computeGrowthStage(daysSincePlanted, refData);
  const yieldRef = getYieldReference(plant.name);
  const heroImage = plant.photoUrl ?? getPlantImage(plant.name)?.url;
  const CategoryIcon = categoryIcons[plant.category] ?? Leaf;

  return (
    <PageShell>
      <div className="space-y-5 page-enter">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => router.push("/plants")} className="text-muted-foreground">
              <ArrowLeft className="size-4" />
            </Button>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-2xl font-bold tracking-tight">{plant.name}</h2>
                {plant.variety && (
                  <span className="text-sm text-muted-foreground">({plant.variety})</span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className={cn("text-xs capitalize gap-1", categoryColors[plant.category])}>
                  <CategoryIcon className="size-3" />
                  {plant.category}
                </Badge>
                <Badge variant="outline" className="text-xs capitalize">
                  {growthStage}
                </Badge>
              </div>
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

        {/* Tabs */}
        <div className="border-b">
          <div className="flex gap-6">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "pb-3 text-sm font-medium border-b-2 transition-colors",
                  activeTab === tab
                    ? "border-emerald-500 text-emerald-600"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                {tabLabels[tab]}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-5">
            {/* Hero Image */}
            {heroImage ? (
              <div className="rounded-xl overflow-hidden aspect-[16/9] sm:aspect-[21/9] bg-muted">
                <img src={heroImage} alt={plant.name} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="rounded-xl overflow-hidden aspect-[16/9] sm:aspect-[21/9] bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-950/20 dark:to-teal-950/20 flex items-center justify-center">
                <Leaf className="size-16 text-emerald-300 dark:text-emerald-700" />
              </div>
            )}

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <StatPill icon={CategoryIcon} label="Category" value={plant.category} color="bg-emerald-500" />
              <StatPill icon={CalendarDays} label="Age" value={`${daysSincePlanted}d`} color="bg-blue-500" />
              <StatPill icon={Sun} label="Sun" value={refData ? `${refData.sunHours}h/day` : "—"} color="bg-amber-500" />
              <StatPill icon={Sprout} label="Tasks" value={`${plantTasks.filter((t) => !t.completed).length} open`} color="bg-purple-500" />
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <StatPill icon={Droplets} label="Growing Method" value={plant.growingMethod} color="bg-cyan-500" />
              <StatPill icon={CalendarDays} label="Planted" value={new Date(plant.plantedDate).toLocaleDateString()} color="bg-indigo-500" />
              <StatPill icon={Sprout} label="Space" value={space?.name ?? "Unassigned"} color="bg-rose-500" />
            </div>

            {plant.healthTags.length > 0 && (
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Health Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
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
                </CardContent>
              </Card>
            )}

            <div className="grid gap-5 lg:grid-cols-2">
              <Card className="border-0 shadow-sm">
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
                          <div key={stage} className="flex items-center justify-between rounded-xl border px-4 py-2.5 transition-colors hover:bg-accent">
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

              <Card className="border-0 shadow-sm">
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
                    onBlur={() => updatePlantNotes(notes)}
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
                    <div className="rounded-xl bg-card px-4 py-3">
                      <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">Expected Yield</p>
                      <p className="font-bold text-lg mt-0.5">~{yieldRef.expectedYieldGramsPerPlant}g</p>
                      <p className="text-[10px] text-muted-foreground">per plant</p>
                    </div>
                    <div className="rounded-xl bg-card px-4 py-3">
                      <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">First Harvest</p>
                      <p className="font-bold text-lg mt-0.5">~{yieldRef.daysToFirstHarvest}d</p>
                      <p className="text-[10px] text-muted-foreground">after planting</p>
                    </div>
                    <div className="rounded-xl bg-card px-4 py-3">
                      <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">Harvest Window</p>
                      <p className="font-bold text-lg mt-0.5">{yieldRef.daysToFirstHarvest}-{yieldRef.daysToLastHarvest}d</p>
                      <p className="text-[10px] text-muted-foreground">total range</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-xs mt-2">{yieldRef.tips}</p>
                </CardContent>
              </Card>
            )}

            <Card className="border-0 shadow-sm">
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
                          "flex items-center justify-between rounded-xl border px-4 py-3 transition-colors hover:bg-accent",
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
        )}

        {/* Journal Tab */}
        {activeTab === "journal" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold tracking-tight">Log Entries</h3>
              <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700" onClick={() => setLogDialogOpen(true)}>
                <Plus className="size-4" />
                Add Log Entry
              </Button>
            </div>

            {logs.length === 0 ? (
              <Card className="border-0 shadow-sm">
                <CardContent>
                  <EmptyState
                    icon={NotebookPen}
                    title="No log entries yet"
                    description="Start tracking observations, measurements, and milestones for this plant."
                    action={
                      <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700" onClick={() => setLogDialogOpen(true)}>
                        <Plus className="size-4" />
                        Add First Entry
                      </Button>
                    }
                  />
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {logs.map((log) => {
                  const meta = logTypeMeta[log.type] ?? logTypeMeta.observation;
                  const TypeIcon = meta.icon;
                  return (
                    <Card key={log.id} className="border-0 shadow-sm">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className={cn("icon-circle size-9 shrink-0", meta.bg)}>
                            <TypeIcon className={cn("size-4", meta.color)} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-semibold text-sm">{log.title}</p>
                              <Badge variant="secondary" className={cn("text-[10px] h-5", meta.bg, meta.color)}>
                                {meta.label}
                              </Badge>
                            </div>
                            {log.description && (
                              <p className="text-sm text-muted-foreground mt-1">{log.description}</p>
                            )}
                            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                              <span>{new Date(log.createdAt).toLocaleDateString()}</span>
                              {log.value !== undefined && log.unit && (
                                <span className="font-medium text-foreground">{log.value} {log.unit}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Photos Tab */}
        {activeTab === "photos" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold tracking-tight">Photo Gallery</h3>
              <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700" onClick={() => setPhotoDialogOpen(true)}>
                <Camera className="size-4" />
                Add Photo
              </Button>
            </div>

            {photos.length === 0 ? (
              <Card className="border-0 shadow-sm">
                <CardContent>
                  <EmptyState
                    icon={FileImage}
                    title="No photos yet"
                    description="Capture and save photos of your plant's progress over time."
                    action={
                      <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700" onClick={() => setPhotoDialogOpen(true)}>
                        <Camera className="size-4" />
                        Add First Photo
                      </Button>
                    }
                  />
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {photos.map((photo) => (
                  <Card key={photo.id} className="border-0 shadow-sm overflow-hidden">
                    <div
                      className="aspect-square bg-muted cursor-pointer relative group"
                      onClick={() => setEnlargePhoto(photo)}
                    >
                      <img src={photo.dataUrl} alt={photo.caption || "Plant photo"} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <Eye className="size-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                    <CardContent className="p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-[10px] h-5 capitalize">
                          {photo.type.replace("_", " ")}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(photo.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <Input
                        value={photo.caption ?? ""}
                        onChange={async (e) => {
                          if (photo.id !== undefined) {
                            await db.photos.update(photo.id, { caption: e.target.value });
                            await refresh();
                          }
                        }}
                        placeholder="Add caption..."
                        className="h-8 text-xs"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full h-7 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={async () => {
                          if (photo.id !== undefined && confirm("Delete this photo?")) {
                            await deletePhoto(photo.id);
                          }
                        }}
                      >
                        <Trash2 className="size-3 mr-1" />
                        Delete
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Yield Tab */}
        {activeTab === "yield" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold tracking-tight">Yield Tracking</h3>
              <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700" onClick={() => setYieldDialogOpen(true)}>
                <Scale className="size-4" />
                Record Yield
              </Button>
            </div>

            {yields.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-muted px-4 py-3">
                  <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">Total Yield</p>
                  <p className="font-bold text-lg mt-0.5">{totalYield}g</p>
                </div>
                <div className="rounded-xl bg-muted px-4 py-3">
                  <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">Harvests</p>
                  <p className="font-bold text-lg mt-0.5">{yields.length}</p>
                </div>
                <div className="rounded-xl bg-muted px-4 py-3">
                  <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">Average</p>
                  <p className="font-bold text-lg mt-0.5">{avgYield}g</p>
                </div>
              </div>
            )}

            {yields.length === 0 ? (
              <Card className="border-0 shadow-sm">
                <CardContent>
                  <EmptyState
                    icon={Scale}
                    title="No yield recorded yet"
                    description={
                      yieldRef
                        ? `Expected yield for ${yieldRef.plantName} is ~${yieldRef.expectedYieldGramsPerPlant}g per plant. Start recording after your first harvest.`
                        : "Start recording yields after your first harvest to track productivity over time."
                    }
                    action={
                      <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700" onClick={() => setYieldDialogOpen(true)}>
                        <Plus className="size-4" />
                        Record First Yield
                      </Button>
                    }
                  />
                </CardContent>
              </Card>
            ) : (
              <Card className="border-0 shadow-sm">
                <CardContent className="p-0">
                  <div className="divide-y">
                    {yields.map((y) => (
                      <div key={y.id} className="flex items-center justify-between px-4 py-3 hover:bg-accent transition-colors">
                        <div>
                          <p className="text-sm font-medium">{y.amountGrams}g harvested</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(y.harvestedAt).toLocaleDateString()}
                            {y.notes && ` · ${y.notes}`}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground/50 hover:text-destructive size-8"
                          onClick={async () => {
                            if (y.id !== undefined && confirm("Delete this yield record?")) {
                              await deleteYield(y.id);
                            }
                          }}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Charts Tab */}
        {activeTab === "charts" && (
          <div className="space-y-5">
            {heightData.length > 1 ? (
              <Card className="border-0 shadow-sm">
                <CardContent className="p-5">
                  <GrowthChart
                    data={heightData}
                    title="Plant Height Over Time"
                    unit="cm"
                    color="hsl(158 64% 42%)"
                    type="area"
                  />
                </CardContent>
              </Card>
            ) : (
              <Card className="border-0 shadow-sm">
                <CardContent className="py-10 text-center">
                  <p className="text-sm text-muted-foreground">No height measurements yet. Add measurement log entries with unit &quot;cm&quot; to see growth trends.</p>
                </CardContent>
              </Card>
            )}

            {(phData.length > 0 || ecData.length > 0) && (
              <Card className="border-0 shadow-sm">
                <CardContent className="p-5">
                  <p className="text-sm font-medium mb-3">pH / EC History</p>
                  <ResponsiveContainer width="100%" height={240}>
                    <LineChart data={phEcChartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                      <XAxis
                        dataKey="date"
                        tickFormatter={(d) => new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                        axisLine={{ stroke: "hsl(var(--border))" }}
                        tickLine={false}
                      />
                      <YAxis
                        yAxisId="left"
                        tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                        axisLine={false}
                        tickLine={false}
                        width={40}
                      />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                        axisLine={false}
                        tickLine={false}
                        width={50}
                      />
                      <Tooltip
                        content={({ active, payload, label }) => {
                          if (!active || !payload) return null;
                          return (
                            <div className="rounded-lg border bg-card px-3 py-2 shadow-sm">
                              <p className="text-xs text-muted-foreground mb-1">
                                {new Date(label as string).toLocaleDateString()}
                              </p>
                              {payload.map((entry: any, i: number) => (
                                <p key={i} className="text-sm font-medium" style={{ color: entry.color }}>
                                  {entry.dataKey === 'ph' ? `pH: ${entry.value}` : `EC: ${entry.value} mS/cm`}
                                </p>
                              ))}
                            </div>
                          );
                        }}
                      />
                      {phData.length > 0 && (
                        <Line
                          yAxisId="left"
                          type="monotone"
                          dataKey="ph"
                          name="pH"
                          stroke="hsl(158 64% 42%)"
                          strokeWidth={2}
                          dot={{ r: 3, fill: "hsl(158 64% 42%)", strokeWidth: 0 }}
                          activeDot={{ r: 5 }}
                        />
                      )}
                      {ecData.length > 0 && (
                        <Line
                          yAxisId="right"
                          type="monotone"
                          dataKey="ec"
                          name="EC"
                          stroke="hsl(215 20% 50%)"
                          strokeWidth={2}
                          dot={{ r: 3, fill: "hsl(215 20% 50%)", strokeWidth: 0 }}
                          activeDot={{ r: 5 }}
                        />
                      )}
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {plant.healthTags.length > 0 && (
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Health Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative py-4">
                    <div className="absolute left-0 right-0 top-6 h-0.5 bg-border" />
                    <div className="relative flex flex-wrap gap-x-6 gap-y-8">
                      {plant.healthTags.map((tag, i) => (
                        <div key={i} className="flex flex-col items-center gap-1.5 min-w-[60px]">
                          <div
                            className={cn(
                              "size-3 rounded-full border-2 border-background z-10",
                              tag.severity === "high" && "bg-red-500",
                              tag.severity === "medium" && "bg-amber-500",
                              tag.severity === "low" && "bg-emerald-500"
                            )}
                          />
                          <span className="text-[10px] text-muted-foreground">
                            {new Date(tag.addedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </span>
                          <span className="text-xs font-medium text-center max-w-[80px] leading-tight">
                            {tag.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {taskChartData.length > 0 && (
              <Card className="border-0 shadow-sm">
                <CardContent className="p-5">
                  <GrowthChart
                    data={taskChartData}
                    title="Tasks Completed Per Week"
                    unit=""
                    color="hsl(173 58% 39%)"
                    type="bar"
                  />
                </CardContent>
              </Card>
            )}

            {yields.length > 0 && (
              <>
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-5">
                    <GrowthChart
                      data={yieldChartData}
                      title="Harvest History"
                      unit="g"
                      color="hsl(158 64% 42%)"
                      type="bar"
                    />
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-5">
                    <GrowthChart
                      data={cumulativeYieldData}
                      title="Cumulative Yield"
                      unit="g"
                      color="hsl(158 64% 42%)"
                      type="area"
                    />
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        )}
      </div>

      {/* Add Log Dialog */}
      <Dialog open={logDialogOpen} onOpenChange={setLogDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Log Entry</DialogTitle>
            <DialogDescription>Record an observation, measurement, or milestone.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <Select value={logType} onChange={(e) => setLogType(e.target.value)}>
                {logTypeOptions.map((t) => (
                  <option key={t} value={t}>
                    {logTypeMeta[t].label}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input value={logTitle} onChange={(e) => setLogTitle(e.target.value)} placeholder="e.g. First true leaves appeared" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={logDescription}
                onChange={(e) => setLogDescription(e.target.value)}
                placeholder="Optional details..."
                className="min-h-[80px] resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Value</label>
                <Input type="number" value={logValue} onChange={(e) => setLogValue(e.target.value)} placeholder="e.g. 12.5" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Unit</label>
                <Input value={logUnit} onChange={(e) => setLogUnit(e.target.value)} placeholder="e.g. cm, pH" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLogDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleAddLog} disabled={!logTitle.trim()}>
              Save Entry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Photo Dialog */}
      <Dialog open={photoDialogOpen} onOpenChange={setPhotoDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Photo</DialogTitle>
            <DialogDescription>Upload a photo of your plant.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Photo Type</label>
              <Select value={photoType} onChange={(e) => setPhotoType(e.target.value)}>
                {photoTypeOptions.map((t) => (
                  <option key={t} value={t}>
                    {t.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Caption</label>
              <Input value={photoCaption} onChange={(e) => setPhotoCaption(e.target.value)} placeholder="Optional caption..." />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Image</label>
              <Input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="h-auto py-2"
              />
            </div>
            {photoPreview && (
              <div className="rounded-lg border overflow-hidden">
                <img src={photoPreview} alt="Preview" className="w-full h-40 object-cover" />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setPhotoDialogOpen(false); setPhotoPreview(null); }}>
              Cancel
            </Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleAddPhoto} disabled={!photoPreview}>
              Save Photo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Record Yield Dialog */}
      <Dialog open={yieldDialogOpen} onOpenChange={setYieldDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record Yield</DialogTitle>
            <DialogDescription>Log a new harvest from this plant.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Amount (grams)</label>
              <Input type="number" value={yieldAmount} onChange={(e) => setYieldAmount(e.target.value)} placeholder="e.g. 150" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Harvest Date</label>
              <Input type="date" value={yieldDate} onChange={(e) => setYieldDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Notes</label>
              <Textarea
                value={yieldNotes}
                onChange={(e) => setYieldNotes(e.target.value)}
                placeholder="Optional notes about this harvest..."
                className="min-h-[80px] resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setYieldDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleAddYield} disabled={!yieldAmount.trim()}>
              Save Yield
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Enlarge Photo Dialog */}
      <Dialog open={!!enlargePhoto} onOpenChange={() => setEnlargePhoto(null)}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden">
          {enlargePhoto && (
            <div className="space-y-0">
              <div className="relative">
                <img src={enlargePhoto.dataUrl} alt={enlargePhoto.caption || "Plant photo"} className="w-full max-h-[70vh] object-contain bg-black" />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-black/50 text-white hover:bg-black/70 hover:text-white"
                  onClick={() => setEnlargePhoto(null)}
                >
                  <X className="size-4" />
                </Button>
              </div>
              <div className="p-4 flex items-center justify-between">
                <div>
                  {enlargePhoto.caption && <p className="text-sm font-medium">{enlargePhoto.caption}</p>}
                  <p className="text-xs text-muted-foreground">
                    {enlargePhoto.type.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())} · {new Date(enlargePhoto.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
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
