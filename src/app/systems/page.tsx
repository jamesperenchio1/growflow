"use client";

import { useState, useMemo } from "react";
import {
  Pipette,
  Check,
  X,
  Star,
  DollarSign,
  Wrench,
  Sprout,
  Plus,
  Trash2,
  ChevronDown,
  ArrowRightLeft,
  ClipboardList,
  Package,
  Hammer,
  BarChart3,
} from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
} from "@/components/ui/select";
import { growingSystems, getSystemsByDifficulty } from "@/data/systems-guide";
import { useSystemsStore } from "@/store/systems-store";
import type { SystemDifficulty, UserSystemStatus, GrowingSystem } from "@/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const difficulties: SystemDifficulty[] = ["beginner", "intermediate", "advanced"];

const difficultyColors: Record<string, string> = {
  beginner: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300",
  intermediate: "bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300",
  advanced: "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-300",
};

const costIcons: Record<string, string> = {
  low: "$",
  medium: "$$",
  high: "$$$",
};

const yieldLabels: Record<string, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

const statusOptions: UserSystemStatus[] = ["planning", "building", "active"];

const statusConfig: Record<UserSystemStatus, { label: string; color: string }> = {
  planning: { label: "Planning", color: "bg-slate-100 text-slate-700 dark:bg-slate-950/30 dark:text-slate-300" },
  building: { label: "Building", color: "bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300" },
  active: { label: "Active", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300" },
};

function SetupGuideDialog({
  system,
  open,
  onOpenChange,
  onAdd,
}: {
  system: GrowingSystem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (system: GrowingSystem) => void;
}) {
  const [checkedMaterials, setCheckedMaterials] = useState<Set<number>>(new Set());
  const [checkedSteps, setCheckedSteps] = useState<Set<number>>(new Set());

  if (!system) return null;

  const toggleMaterial = (i: number) => {
    const next = new Set(checkedMaterials);
    if (next.has(i)) next.delete(i);
    else next.add(i);
    setCheckedMaterials(next);
  };

  const toggleStep = (i: number) => {
    const next = new Set(checkedSteps);
    if (next.has(i)) next.delete(i);
    else next.add(i);
    setCheckedSteps(next);
  };

  const allMaterialsDone = checkedMaterials.size === system.materials.length;
  const allStepsDone = checkedSteps.size === system.setupSteps.length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="secondary" className={cn("text-[10px] h-5 capitalize", difficultyColors[system.difficulty])}>
              {system.difficulty}
            </Badge>
            <Badge variant="secondary" className="text-[10px] h-5">
              {costIcons[system.setupCost]} Setup Cost
            </Badge>
            <Badge variant="secondary" className="text-[10px] h-5 capitalize">
              {system.maintenanceLevel} Maintenance
            </Badge>
          </div>
          <DialogTitle className="text-xl">{system.name}</DialogTitle>
          <DialogDescription>{system.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-2">
          {/* Materials */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Package className="size-4 text-blue-500" />
              <h4 className="text-sm font-semibold">Required Materials</h4>
              <span className="text-xs text-muted-foreground ml-auto">
                {checkedMaterials.size}/{system.materials.length}
              </span>
            </div>
            <div className="space-y-2">
              {system.materials.map((mat, i) => (
                <label
                  key={i}
                  className={cn(
                    "flex items-start gap-3 rounded-lg border px-3 py-2.5 cursor-pointer transition-colors",
                    checkedMaterials.has(i)
                      ? "bg-emerald-50 border-emerald-200 dark:bg-emerald-950 dark:border-emerald-900/30"
                      : "bg-muted border-transparent hover:bg-muted"
                  )}
                >
                  <Checkbox
                    checked={checkedMaterials.has(i)}
                    onCheckedChange={() => toggleMaterial(i)}
                    className="mt-0.5"
                  />
                  <span className={cn("text-sm", checkedMaterials.has(i) && "line-through opacity-60")}>
                    {mat}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <ClipboardList className="size-4 text-amber-500" />
              <h4 className="text-sm font-semibold">Setup Instructions</h4>
              <span className="text-xs text-muted-foreground ml-auto">
                {checkedSteps.size}/{system.setupSteps.length}
              </span>
            </div>
            <div className="space-y-2">
              {system.setupSteps.map((step, i) => (
                <label
                  key={i}
                  className={cn(
                    "flex items-start gap-3 rounded-lg border px-3 py-2.5 cursor-pointer transition-colors",
                    checkedSteps.has(i)
                      ? "bg-emerald-50 border-emerald-200 dark:bg-emerald-950 dark:border-emerald-900/30"
                      : "bg-muted border-transparent hover:bg-muted"
                  )}
                >
                  <Checkbox
                    checked={checkedSteps.has(i)}
                    onCheckedChange={() => toggleStep(i)}
                    className="mt-0.5"
                  />
                  <div className="flex-1">
                    <span className="text-xs font-medium text-muted-foreground">Step {i + 1}</span>
                    <p className={cn("text-sm", checkedSteps.has(i) && "line-through opacity-60")}>
                      {step}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Recommended plants */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Sprout className="size-4 text-emerald-500" />
              <h4 className="text-sm font-semibold">Recommended Plants</h4>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {system.idealCrops.map((crop) => (
                <Badge key={crop} variant="outline" className="text-xs font-normal">
                  {crop}
                </Badge>
              ))}
            </div>
          </div>

          {(allMaterialsDone && allStepsDone) && (
            <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/30 p-3 text-sm text-emerald-700 dark:text-emerald-300">
              All materials checked and all steps completed! You are ready to build.
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button
            className="bg-emerald-600 hover:bg-emerald-700 gap-1"
            onClick={() => {
              onAdd(system);
              onOpenChange(false);
            }}
          >
            <Plus className="size-4" />
            Add to My Systems
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CompareDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSystem = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((s) => s !== id);
      }
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  };

  const comparedSystems = useMemo(
    () => growingSystems.filter((s) => selectedIds.includes(s.id)),
    [selectedIds]
  );

  const rows = [
    { label: "Difficulty", key: "difficulty" as const, format: (v: string) => v },
    { label: "Setup Cost", key: "setupCost" as const, format: (v: string) => costIcons[v] || v },
    { label: "Maintenance", key: "maintenanceLevel" as const, format: (v: string) => v },
    { label: "Yield Potential", key: "yieldPotential" as const, format: (v: string) => yieldLabels[v] || v },
    { label: "Best For", key: "idealCrops" as const, format: (v: string[]) => v.slice(0, 3).join(", ") + (v.length > 3 ? "..." : "") },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowRightLeft className="size-5" />
            Compare Systems
          </DialogTitle>
          <DialogDescription>Select 2–3 systems to compare side-by-side.</DialogDescription>
        </DialogHeader>

        <div className="space-y-5 mt-2">
          {/* Selection */}
          <div className="flex flex-wrap gap-2">
            {growingSystems.map((s) => {
              const selected = selectedIds.includes(s.id);
              return (
                <button
                  key={s.id}
                  onClick={() => toggleSystem(s.id)}
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm font-medium border transition-all",
                    selected
                      ? "bg-emerald-600 text-white border-emerald-600"
                      : "bg-card border-border hover:bg-muted"
                  )}
                >
                  {s.name}
                </button>
              );
            })}
          </div>

          {comparedSystems.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 pr-4 font-medium text-muted-foreground">Feature</th>
                    {comparedSystems.map((s) => (
                      <th key={s.id} className="text-left py-2 px-4 font-semibold min-w-[160px]">
                        {s.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.key} className="border-b border-border/50">
                      <td className="py-2.5 pr-4 font-medium text-muted-foreground">{row.label}</td>
                      {comparedSystems.map((s) => (
                        <td key={s.id} className="py-2.5 px-4">
                          {row.format(((s as unknown) as Record<string, unknown>)[row.key] as never)}
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr>
                    <td className="py-2.5 pr-4 font-medium text-muted-foreground align-top">Pros</td>
                    {comparedSystems.map((s) => (
                      <td key={s.id} className="py-2.5 px-4 align-top">
                        <ul className="space-y-1">
                          {s.pros.slice(0, 3).map((p) => (
                            <li key={p} className="flex items-start gap-1.5">
                              <Check className="size-3 mt-0.5 shrink-0 text-emerald-500" />
                              <span className="text-xs">{p}</span>
                            </li>
                          ))}
                        </ul>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 font-medium text-muted-foreground align-top">Cons</td>
                    {comparedSystems.map((s) => (
                      <td key={s.id} className="py-2.5 px-4 align-top">
                        <ul className="space-y-1">
                          {s.cons.slice(0, 3).map((c) => (
                            <li key={c} className="flex items-start gap-1.5">
                              <X className="size-3 mt-0.5 shrink-0 text-red-500" />
                              <span className="text-xs">{c}</span>
                            </li>
                          ))}
                        </ul>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function SystemsPage() {
  const [difficulty, setDifficulty] = useState<SystemDifficulty | "all">("all");
  const [guideOpen, setGuideOpen] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);
  const [selectedSystem, setSelectedSystem] = useState<GrowingSystem | null>(null);

  const { mySystems, addSystem, updateStatus, deleteSystem } = useSystemsStore();

  const systems = difficulty === "all" ? growingSystems : getSystemsByDifficulty(difficulty);

  const handleOpenGuide = (system: GrowingSystem) => {
    setSelectedSystem(system);
    setGuideOpen(true);
  };

  const handleAddToMySystems = (system: GrowingSystem) => {
    addSystem(system.id, system.name);
    toast.success(`${system.name} added to My Systems`);
  };

  return (
    <PageShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Growing Systems</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Compare hydroponic and aquaponic system types.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => setCompareOpen(true)}
          >
            <ArrowRightLeft className="size-4" />
            Compare Systems
          </Button>
        </div>

        {/* My Systems */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            My Systems
          </h3>
          {mySystems.length === 0 ? (
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6 text-center">
                <p className="text-sm text-muted-foreground">
                  No systems added yet. Browse below and add one.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {mySystems.map((userSys) => {
                const system = growingSystems.find((s) => s.id === userSys.systemId);
                const status = statusConfig[userSys.status];
                return (
                  <Card key={userSys.id} className="border-0 shadow-sm">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-semibold text-sm truncate">{userSys.name}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Added {new Date(userSys.dateAdded).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge className={cn("text-[10px] h-5 shrink-0", status.color)}>
                          {status.label}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        <Select
                          value={userSys.status}
                          onChange={(e) =>
                            updateStatus(userSys.id, e.target.value as UserSystemStatus)
                          }
                          className="h-8 text-xs"
                        >
                          {statusOptions.map((s) => (
                            <option key={s} value={s}>
                              {statusConfig[s].label}
                            </option>
                          ))}
                        </Select>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => deleteSystem(userSys.id)}
                          title="Remove"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Difficulty filter */}
        <div className="inline-flex rounded-xl bg-muted p-1 flex-wrap">
          <button
            onClick={() => setDifficulty("all")}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium transition-all",
              difficulty === "all" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            All
          </button>
          {difficulties.map((d) => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className={cn(
                "rounded-lg px-4 py-2 text-sm font-medium capitalize transition-all",
                difficulty === d ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {d}
            </button>
          ))}
        </div>

        {/* System Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {systems.map((system) => (
            <Card key={system.id} className="border-0 shadow-sm flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="icon-circle size-10 bg-emerald-50 dark:bg-emerald-950/30">
                      <Pipette className="size-5 text-emerald-500" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{system.name}</CardTitle>
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className={cn("text-[10px] h-5 capitalize shrink-0", difficultyColors[system.difficulty])}
                  >
                    {system.difficulty}
                  </Badge>
                </div>
                <CardDescription className="mt-2 leading-relaxed">
                  {system.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                <div className="flex flex-wrap gap-1.5">
                  {system.idealCrops.slice(0, 5).map((crop) => (
                    <Badge key={crop} variant="outline" className="text-[10px] h-5 font-normal">
                      {crop}
                    </Badge>
                  ))}
                  {system.idealCrops.length > 5 && (
                    <Badge variant="outline" className="text-[10px] h-5 font-normal">
                      +{system.idealCrops.length - 5}
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl bg-muted px-3 py-2">
                    <p className="flex items-center gap-1 text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">
                      <DollarSign className="size-3" /> Setup Cost
                    </p>
                    <p className="font-semibold mt-0.5">{costIcons[system.setupCost]}</p>
                  </div>
                  <div className="rounded-xl bg-muted px-3 py-2">
                    <p className="flex items-center gap-1 text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">
                      <Wrench className="size-3" /> Maintenance
                    </p>
                    <p className="font-semibold mt-0.5 capitalize">{system.maintenanceLevel}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
                    Pros
                  </p>
                  <ul className="space-y-1.5">
                    {system.pros.slice(0, 3).map((pro) => (
                      <li key={pro} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Check className="mt-0.5 size-3.5 shrink-0 text-emerald-500" />
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold text-red-700 dark:text-red-300 uppercase tracking-wider">
                    Cons
                  </p>
                  <ul className="space-y-1.5">
                    {system.cons.slice(0, 3).map((con) => (
                      <li key={con} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <X className="mt-0.5 size-3.5 shrink-0 text-red-500" />
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="pt-0 flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 gap-1"
                  onClick={() => handleOpenGuide(system)}
                >
                  <Hammer className="size-4" />
                  Setup Guide
                </Button>
                <Button
                  className="bg-emerald-600 hover:bg-emerald-700 gap-1"
                  onClick={() => handleAddToMySystems(system)}
                >
                  <Plus className="size-4" />
                  Add
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      <SetupGuideDialog
        system={selectedSystem}
        open={guideOpen}
        onOpenChange={setGuideOpen}
        onAdd={handleAddToMySystems}
      />

      <CompareDialog open={compareOpen} onOpenChange={setCompareOpen} />
    </PageShell>
  );
}
