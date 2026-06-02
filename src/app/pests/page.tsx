"use client";

import { useState, useMemo, useEffect } from "react";
import { PageShell } from "@/components/layout/page-shell";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  pestsAndDiseases,
  type PestDisease,
  type PestDiseaseCategory,
  type Severity,
} from "@/data/pests-diseases";
import {
  Bug,
  Sprout,
  Search,
  ShieldAlert,
  ShieldCheck,
  Shield,
  Leaf,
  X,
  AlertTriangle,
  Droplets,
  ShieldCheck as ShieldCheckIcon,
  Clock,
  ListChecks,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

type FilterCategory = "all" | PestDiseaseCategory;
type FilterSeverity = "all" | Severity;

const categoryTabs: { value: FilterCategory; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pest", label: "Pests" },
  { value: "disease", label: "Diseases" },
];

const severityFilters: { value: FilterSeverity; label: string }[] = [
  { value: "all", label: "All" },
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

const severityConfig: Record<
  Severity,
  {
    badgeClass: string;
    gradient: string;
    icon: React.ElementType;
    label: string;
    barColor: string;
    segments: number;
  }
> = {
  low: {
    badgeClass:
      "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800",
    gradient: "gradient-emerald",
    icon: ShieldCheck,
    label: "Low",
    barColor: "bg-emerald-500",
    segments: 1,
  },
  medium: {
    badgeClass:
      "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800",
    gradient: "gradient-amber",
    icon: ShieldAlert,
    label: "Medium",
    barColor: "bg-amber-500",
    segments: 2,
  },
  high: {
    badgeClass:
      "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-800",
    gradient: "gradient-rose",
    icon: Shield,
    label: "High",
    barColor: "bg-rose-500",
    segments: 3,
  },
};

function usePreventionChecks(pestId: string | null) {
  const storageKey = pestId ? `growflow-prevention-${pestId}` : null;
  const [checked, setChecked] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!storageKey) {
      setChecked(new Set());
      return;
    }
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        setChecked(new Set(JSON.parse(raw)));
      } else {
        setChecked(new Set());
      }
    } catch {
      setChecked(new Set());
    }
  }, [storageKey]);

  const toggle = (item: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(item)) next.delete(item);
      else next.add(item);
      if (storageKey) {
        localStorage.setItem(storageKey, JSON.stringify(Array.from(next)));
      }
      return next;
    });
  };

  return { checked, toggle };
}

function SeverityGauge({ severity }: { severity: Severity }) {
  const config = severityConfig[severity];
  const totalSegments = 4;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <div className="flex-1 flex gap-1">
          {Array.from({ length: totalSegments }, (_, i) => (
            <div
              key={i}
              className={cn(
                "h-2 flex-1 rounded-full transition-colors",
                i < config.segments ? config.barColor : "bg-muted"
              )}
            />
          ))}
        </div>
        <Badge variant="outline" className={cn("text-[10px] h-5 shrink-0", config.badgeClass)}>
          <config.icon className="size-3 mr-1" />
          {config.label}
        </Badge>
      </div>
    </div>
  );
}

function DetailDialog({
  item,
  open,
  onOpenChange,
}: {
  item: PestDisease | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { checked, toggle } = usePreventionChecks(item?.id ?? null);

  if (!item) return null;
  const sev = severityConfig[item.severity];
  const CategoryIcon = item.category === "pest" ? Bug : Sprout;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <Badge
              variant="outline"
              className={cn("text-[10px] h-5", sev.badgeClass)}
            >
              <sev.icon className="size-3 mr-1" />
              {sev.label} Severity
            </Badge>
            <Badge variant="outline" className="text-[10px] h-5">
              <CategoryIcon className="size-3 mr-1" />
              {item.category === "pest" ? "Pest" : "Disease"}
            </Badge>
          </div>
          <DialogTitle className="text-xl">{item.name}</DialogTitle>
          <DialogDescription>{item.symptoms[0]}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-2">
          <SeverityGauge severity={item.severity} />

          <div>
            <h4 className="text-sm font-semibold flex items-center gap-2 mb-2">
              <AlertTriangle className="size-4 text-amber-500" />
              Symptoms
            </h4>
            <ul className="space-y-1.5">
              {item.symptoms.map((s, i) => (
                <li
                  key={i}
                  className="text-sm text-muted-foreground flex gap-2"
                >
                  <span className="text-amber-500 mt-0.5 shrink-0">•</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Treatment Timeline */}
          <div>
            <h4 className="text-sm font-semibold flex items-center gap-2 mb-3">
              <Clock className="size-4 text-blue-500" />
              Treatment Timeline
            </h4>
            <div className="relative">
              <div className="absolute left-[11px] top-2 bottom-2 w-px bg-border" />
              <div className="space-y-3">
                {item.treatmentTimeline.map((step, i) => (
                  <div key={i} className="flex items-start gap-3 pl-1">
                    <div className="relative z-10 flex items-center justify-center size-6 rounded-full bg-blue-100 dark:bg-blue-950/30 text-blue-600 text-[10px] font-bold shrink-0">
                      {i + 1}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground">{step.day}</p>
                      <p className="text-sm text-muted-foreground">{step.action}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold flex items-center gap-2 mb-2">
              <Droplets className="size-4 text-blue-500" />
              Treatments
            </h4>
            <ul className="space-y-1.5">
              {item.treatments.map((t, i) => (
                <li
                  key={i}
                  className="text-sm text-muted-foreground flex gap-2"
                >
                  <span className="text-blue-500 mt-0.5 shrink-0">•</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Prevention Checklist */}
          <div>
            <h4 className="text-sm font-semibold flex items-center gap-2 mb-3">
              <ListChecks className="size-4 text-emerald-500" />
              Prevention Checklist
            </h4>
            <div className="space-y-2">
              {item.prevention.map((p, i) => (
                <label
                  key={i}
                  className={cn(
                    "flex items-start gap-3 rounded-lg border px-3 py-2.5 cursor-pointer transition-colors",
                    checked.has(p)
                      ? "bg-emerald-50 border-emerald-200 dark:bg-emerald-950 dark:border-emerald-900/30"
                      : "bg-muted border-transparent hover:bg-muted/80"
                  )}
                >
                  <Checkbox
                    checked={checked.has(p)}
                    onCheckedChange={() => toggle(p)}
                    className="mt-0.5"
                  />
                  <span className={cn("text-sm", checked.has(p) && "line-through opacity-60")}>
                    {p}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold flex items-center gap-2 mb-2">
              <Leaf className="size-4 text-green-500" />
              Affected Plants
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {item.affectedPlants.map((plant) => (
                <Badge key={plant} variant="secondary" className="text-xs">
                  {plant}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function PestsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<FilterCategory>("all");
  const [severity, setSeverity] = useState<FilterSeverity>("all");
  const [selectedItem, setSelectedItem] = useState<PestDisease | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const filtered = useMemo(() => {
    return pestsAndDiseases.filter((item) => {
      if (category !== "all" && item.category !== category) return false;
      if (severity !== "all" && item.severity !== severity) return false;
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.symptoms.some((s) => s.toLowerCase().includes(q)) ||
        item.affectedPlants.some((a) => a.toLowerCase().includes(q))
      );
    });
  }, [search, category, severity]);

  const handleOpenDetail = (item: PestDisease) => {
    setSelectedItem(item);
    setDialogOpen(true);
  };

  const hasActiveFilters = search || category !== "all" || severity !== "all";

  return (
    <PageShell>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Pest & Disease Guide
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Research-backed reference for identifying and managing common
            hydroponic problems.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, symptom, or plant..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Category tabs */}
            <div className="inline-flex h-9 items-center rounded-lg bg-muted p-1">
              {categoryTabs.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setCategory(tab.value)}
                  className={cn(
                    "inline-flex items-center justify-center rounded-md px-3 py-1 text-sm font-medium transition-all",
                    category === tab.value
                      ? "bg-background text-foreground shadow"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Severity filter */}
            <div className="inline-flex h-9 items-center rounded-lg bg-muted p-1">
              {severityFilters.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setSeverity(f.value)}
                  className={cn(
                    "inline-flex items-center justify-center rounded-md px-3 py-1 text-sm font-medium transition-all",
                    severity === f.value
                      ? "bg-background text-foreground shadow"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results count */}
        {hasActiveFilters && (
          <p className="text-xs text-muted-foreground">
            Showing {filtered.length} of {pestsAndDiseases.length} entries
            {search && ` for "${search}"`}
          </p>
        )}

        {/* Cards Grid */}
        {filtered.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((item) => {
              const sev = severityConfig[item.severity];
              const CategoryIcon = item.category === "pest" ? Bug : Sprout;

              return (
                <Card
                  key={item.id}
                  className={cn(
                    "border-0 shadow-sm flex flex-col card-hover p-6",
                    sev.gradient
                  )}
                >
                  <CardHeader className="pb-4 p-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={cn(
                            "icon-circle size-10 shrink-0",
                            item.category === "pest"
                              ? "bg-red-100 text-red-600 dark:bg-red-950/30"
                              : "bg-purple-100 text-purple-600 dark:bg-purple-950/30"
                          )}
                        >
                          <CategoryIcon className="size-5" />
                        </div>
                        <div className="min-w-0">
                          <CardTitle className="text-base leading-tight">
                            {item.name}
                          </CardTitle>
                          <p className="text-xs text-muted-foreground mt-0.5 capitalize">
                            {item.category} • {item.affectedPlants.length} plants affected
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3">
                      <SeverityGauge severity={item.severity} />
                    </div>
                    <div className="mt-4 space-y-1.5">
                      {item.symptoms.slice(0, 3).map((symptom, i) => (
                        <p
                          key={i}
                          className="text-sm text-muted-foreground line-clamp-1"
                        >
                          • {symptom}
                        </p>
                      ))}
                    </div>
                  </CardHeader>
                  <CardContent className="mt-auto pt-0 p-0">
                    <div className="flex items-center justify-between gap-3 mt-4">
                      <div className="flex flex-wrap gap-1 min-w-0">
                        {item.affectedPlants.slice(0, 3).map((plant) => (
                          <Badge
                            key={plant}
                            variant="secondary"
                            className="text-[10px] h-5"
                          >
                            {plant}
                          </Badge>
                        ))}
                        {item.affectedPlants.length > 3 && (
                          <Badge variant="secondary" className="text-[10px] h-5">
                            +{item.affectedPlants.length - 3}
                          </Badge>
                        )}
                      </div>
                      <Button
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white h-8 text-xs shrink-0"
                        onClick={() => handleOpenDetail(item)}
                      >
                        View Details
                        <ChevronRight className="size-3 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center gap-3 py-16">
            <div className="icon-circle size-14 bg-slate-100 dark:bg-slate-900">
              <Search className="size-7 text-slate-400" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              No pests or diseases match your search
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearch("");
                setCategory("all");
                setSeverity("all");
              }}
            >
              Clear filters
            </Button>
          </div>
        )}

        <DetailDialog
          item={selectedItem}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        />
      </div>
    </PageShell>
  );
}
