"use client";

import { useState, useMemo } from "react";
import { PageShell } from "@/components/layout/page-shell";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  }
> = {
  low: {
    badgeClass:
      "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800",
    gradient: "gradient-emerald",
    icon: ShieldCheck,
    label: "Low",
  },
  medium: {
    badgeClass:
      "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800",
    gradient: "gradient-amber",
    icon: ShieldAlert,
    label: "Medium",
  },
  high: {
    badgeClass:
      "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-800",
    gradient: "gradient-rose",
    icon: Shield,
    label: "High",
  },
};

function DetailDialog({
  item,
  open,
  onOpenChange,
}: {
  item: PestDisease | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
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

        <div className="space-y-5 mt-2">
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

          <div>
            <h4 className="text-sm font-semibold flex items-center gap-2 mb-2">
              <ShieldCheckIcon className="size-4 text-emerald-500" />
              Prevention
            </h4>
            <ul className="space-y-1.5">
              {item.prevention.map((p, i) => (
                <li
                  key={i}
                  className="text-sm text-muted-foreground flex gap-2"
                >
                  <span className="text-emerald-500 mt-0.5 shrink-0">•</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
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
      <div className="space-y-5">
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
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item) => {
              const sev = severityConfig[item.severity];
              const CategoryIcon = item.category === "pest" ? Bug : Sprout;

              return (
                <Card
                  key={item.id}
                  className={cn(
                    "border-0 shadow-sm flex flex-col card-hover",
                    sev.gradient
                  )}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            "icon-circle size-9",
                            item.category === "pest"
                              ? "bg-red-100 text-red-600 dark:bg-red-950/30"
                              : "bg-purple-100 text-purple-600 dark:bg-purple-950/30"
                          )}
                        >
                          <CategoryIcon className="size-4" />
                        </div>
                        <div>
                          <CardTitle className="text-base">
                            {item.name}
                          </CardTitle>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={cn("text-[10px] h-5", sev.badgeClass)}
                      >
                        <sev.icon className="size-3 mr-1" />
                        {sev.label}
                      </Badge>
                    </div>
                    <div className="mt-2 space-y-1">
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
                  <CardContent className="mt-auto pt-0">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
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
                        className="bg-emerald-600 hover:bg-emerald-700 text-white h-7 text-xs"
                        onClick={() => handleOpenDetail(item)}
                      >
                        View Details
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
