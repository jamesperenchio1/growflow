"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Heart,
  X,
  ChevronDown,
  ChevronUp,
  Flower2,
  Sprout,
  Leaf,
  Info,
} from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { seedPlants } from "@/data/seed-plants";
import {
  companionPairs,
  getPlantCompanionInfo,
  getAllPlantNames,
  type CompanionPair,
} from "@/data/companions";

const categoryConfig: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  vegetable: { label: "Vegetable", color: "text-green-600", bg: "bg-green-100", icon: Sprout },
  herb: { label: "Herb", color: "text-emerald-600", bg: "bg-emerald-100", icon: Leaf },
  fruit: { label: "Fruit", color: "text-blue-600", bg: "bg-blue-100", icon: Flower2 },
  flower: { label: "Flower", color: "text-pink-600", bg: "bg-pink-100", icon: Flower2 },
};

function getPlantCategory(plantName: string): string {
  const plant = seedPlants.find((p) => p.name.toLowerCase() === plantName.toLowerCase());
  return plant?.category ?? "vegetable";
}

function getCategoryStyle(category: string) {
  return categoryConfig[category] ?? categoryConfig.vegetable;
}

function PlantIcon({ category, className }: { category: string; className?: string }) {
  const style = getCategoryStyle(category);
  const Icon = style.icon;
  return <Icon className={cn("shrink-0", style.color, className)} />;
}

function RelationshipBadge({ relationship }: { relationship: CompanionPair["relationship"] }) {
  if (relationship === "beneficial") {
    return (
      <Badge className="gap-1 bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0 dark:bg-emerald-950/30 dark:text-emerald-300">
        <Heart className="size-3 fill-emerald-600" />
        Beneficial
      </Badge>
    );
  }
  return (
    <Badge className="gap-1 bg-rose-100 text-rose-700 hover:bg-rose-100 border-0 dark:bg-rose-950/30 dark:text-rose-300">
      <X className="size-3" />
      Harmful
    </Badge>
  );
}

function StrengthDots({ strength }: { strength: CompanionPair["strength"] }) {
  const count = strength === "strong" ? 3 : strength === "moderate" ? 2 : 1;
  const color = strength === "strong" ? "bg-emerald-500" : strength === "moderate" ? "bg-amber-400" : "bg-slate-300";
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3].map((i) => (
        <span
          key={i}
          className={cn("size-1.5 rounded-full", i <= count ? color : "bg-muted")}
        />
      ))}
      <span className="text-[10px] text-muted-foreground ml-0.5 capitalize">{strength}</span>
    </div>
  );
}

function PairCard({ pair }: { pair: CompanionPair }) {
  const [expanded, setExpanded] = useState(false);
  const catA = getPlantCategory(pair.plantA);
  const catB = getPlantCategory(pair.plantB);
  const styleA = getCategoryStyle(catA);
  const styleB = getCategoryStyle(catB);
  const isBeneficial = pair.relationship === "beneficial";

  return (
    <Card
      className={cn(
        "border-0 shadow-sm transition-all",
        isBeneficial ? "bg-emerald-50/50 dark:bg-emerald-950/10" : "bg-rose-50/50 dark:bg-rose-950/10"
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className={cn("icon-circle size-9", styleA.bg, "dark:opacity-90")}>
              <PlantIcon category={catA} className="size-4" />
            </div>
            <div className="flex flex-col items-center px-1">
              <div className={cn("h-px w-6", isBeneficial ? "bg-emerald-300" : "bg-rose-300")} />
              {isBeneficial ? (
                <Heart className="size-3 text-emerald-500 my-0.5 fill-emerald-500" />
              ) : (
                <X className="size-3 text-rose-500 my-0.5" />
              )}
              <div className={cn("h-px w-6", isBeneficial ? "bg-emerald-300" : "bg-rose-300")} />
            </div>
            <div className={cn("icon-circle size-9", styleB.bg, "dark:opacity-90")}>
              <PlantIcon category={catB} className="size-4" />
            </div>
          </div>
          <RelationshipBadge relationship={pair.relationship} />
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">{pair.plantA}</span>
            <span className="text-xs text-muted-foreground">+</span>
            <span className="text-sm font-semibold">{pair.plantB}</span>
          </div>
          <StrengthDots strength={pair.strength} />
        </div>

        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{pair.reason}</p>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setExpanded(!expanded)}
          className="mt-2 h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
        >
          {expanded ? (
            <>
              <ChevronUp className="size-3 mr-1" /> Less
            </>
          ) : (
            <>
              <ChevronDown className="size-3 mr-1" /> Learn More
            </>
          )}
        </Button>

        {expanded && (
          <div className="mt-2 rounded-lg border bg-card/60 p-3 text-xs text-muted-foreground space-y-1">
            <p>
              <span className="font-medium text-foreground">Category:</span>{" "}
              {styleA.label} + {styleB.label}
            </p>
            <p>
              <span className="font-medium text-foreground">Strength:</span>{" "}
              {pair.strength === "strong" ? "High impact — strongly recommended" : pair.strength === "moderate" ? "Medium impact — good practice" : "Mild impact — helpful but not critical"}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ThreeSistersCard() {
  return (
    <Card className="border-0 shadow-sm gradient-amber">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="icon-circle size-9 bg-amber-100 dark:bg-amber-950/30">
            <Sprout className="size-4 text-amber-600" />
          </div>
          <div>
            <CardTitle className="text-base">Three Sisters</CardTitle>
            <CardDescription>A classic companion trio</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-muted-foreground">
        <p>
          The ancient Native American "Three Sisters" method combines{" "}
          <strong className="text-foreground">Corn</strong>,{" "}
          <strong className="text-foreground">Beans</strong>, and{" "}
          <strong className="text-foreground">Squash</strong> in a symbiotic planting:
        </p>
        <ul className="space-y-2">
          {[
            { title: "Beans", desc: "Fix nitrogen into the soil, feeding heavy-feeding corn." },
            { title: "Corn", desc: "Provides a natural trellis for bean vines to climb." },
            { title: "Squash", desc: "Shades the soil, suppressing weeds and retaining moisture." },
          ].map((item) => (
            <li key={item.title} className="flex items-start gap-2 rounded-lg border bg-card/50 p-2.5">
              <span className="font-semibold text-foreground text-xs shrink-0 w-14">{item.title}</span>
              <span className="text-xs leading-relaxed">{item.desc}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export default function CompanionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [relationshipFilter, setRelationshipFilter] = useState<"all" | "beneficial" | "harmful">("all");
  const [strengthFilter, setStrengthFilter] = useState<"all" | "strong" | "moderate" | "weak">("all");
  const [selectedPlant, setSelectedPlant] = useState<string>("Tomato");

  const plantNames = useMemo(() => getAllPlantNames(), []);

  const filteredPairs = useMemo(() => {
    return companionPairs.filter((pair) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        pair.plantA.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pair.plantB.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRelationship =
        relationshipFilter === "all" || pair.relationship === relationshipFilter;
      const matchesStrength = strengthFilter === "all" || pair.strength === strengthFilter;
      return matchesSearch && matchesRelationship && matchesStrength;
    });
  }, [searchQuery, relationshipFilter, strengthFilter]);

  const plantInfo = useMemo(() => getPlantCompanionInfo(selectedPlant), [selectedPlant]);
  const plantCategory = getPlantCategory(selectedPlant);
  const plantStyle = getCategoryStyle(plantCategory);

  return (
    <PageShell>
      <div className="space-y-5">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Companion Planting Guide</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Discover beneficial pairings that boost growth and harmful combinations to avoid.
          </p>
        </div>

        <Tabs defaultValue="pairs" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="pairs">Pair Explorer</TabsTrigger>
            <TabsTrigger value="finder">Plant Finder</TabsTrigger>
          </TabsList>

          {/* Pair Explorer */}
          <TabsContent value="pairs" className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by plant name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select
                value={relationshipFilter}
                onChange={(e) => setRelationshipFilter(e.target.value as typeof relationshipFilter)}
                className="w-full sm:w-40"
              >
                <option value="all">All Types</option>
                <option value="beneficial">Beneficial</option>
                <option value="harmful">Harmful</option>
              </Select>
              <Select
                value={strengthFilter}
                onChange={(e) => setStrengthFilter(e.target.value as typeof strengthFilter)}
                className="w-full sm:w-40"
              >
                <option value="all">All Strengths</option>
                <option value="strong">Strong</option>
                <option value="moderate">Moderate</option>
                <option value="weak">Weak</option>
              </Select>
            </div>

            {/* Results count */}
            <p className="text-xs text-muted-foreground">
              Showing {filteredPairs.length} of {companionPairs.length} pairings
            </p>

            {/* Grid */}
            {filteredPairs.length === 0 ? (
              <Card className="border-0 shadow-sm">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <Search className="size-10 text-muted-foreground mb-3" />
                  <p className="text-base font-medium text-muted-foreground">No pairings found</p>
                  <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or filters.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredPairs.map((pair, i) => (
                  <PairCard key={`${pair.plantA}-${pair.plantB}-${i}`} pair={pair} />
                ))}
              </div>
            )}

            {/* Three Sisters */}
            <div className="pt-2">
              <ThreeSistersCard />
            </div>
          </TabsContent>

          {/* Plant Finder */}
          <TabsContent value="finder" className="space-y-5">
            {/* Plant Selector */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <label className="text-sm font-medium shrink-0">Select a plant:</label>
              <Select
                value={selectedPlant}
                onChange={(e) => setSelectedPlant(e.target.value)}
                className="w-full sm:w-64"
              >
                {plantNames.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </Select>
            </div>

            {plantInfo && (
              <div className="space-y-5">
                {/* Hub — Selected Plant */}
                <div className="flex justify-center">
                  <Card className="border-0 shadow-sm w-full max-w-sm">
                    <CardContent className="p-5 flex flex-col items-center text-center">
                      <div className={cn("icon-circle size-16", plantStyle.bg, "dark:opacity-90 mb-3")}>
                        <PlantIcon category={plantCategory} className="size-8" />
                      </div>
                      <h3 className="text-lg font-bold">{plantInfo.plantName}</h3>
                      <Badge variant="secondary" className={cn("mt-1.5 capitalize text-xs", plantStyle.bg, plantStyle.color)}>
                        {plantInfo.category}
                      </Badge>
                      {plantInfo.notes && (
                        <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{plantInfo.notes}</p>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Connection indicator */}
                <div className="flex items-center justify-center gap-2">
                  <div className="h-px flex-1 max-w-[120px] bg-emerald-200" />
                  <Leaf className="size-4 text-emerald-400" />
                  <div className="h-px flex-1 max-w-[120px] bg-emerald-200" />
                </div>

                {/* Best Companions */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Heart className="size-4 text-emerald-500 fill-emerald-500" />
                    <h4 className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Best Companions</h4>
                  </div>
                  {plantInfo.bestCompanions.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No specific companion recommendations.</p>
                  ) : (
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {plantInfo.bestCompanions.map((companion) => {
                        const cat = getPlantCategory(companion);
                        const style = getCategoryStyle(cat);
                        const pair = companionPairs.find(
                          (p) =>
                            (p.plantA.toLowerCase() === plantInfo.plantName.toLowerCase() &&
                              p.plantB.toLowerCase() === companion.toLowerCase()) ||
                            (p.plantB.toLowerCase() === plantInfo.plantName.toLowerCase() &&
                              p.plantA.toLowerCase() === companion.toLowerCase())
                        );
                        return (
                          <Card key={companion} className="border-0 shadow-sm bg-emerald-50/50 dark:bg-emerald-950/10">
                            <CardContent className="p-4">
                              <div className="flex items-center gap-2.5">
                                <div className={cn("icon-circle size-8", style.bg, "dark:opacity-90")}>
                                  <PlantIcon category={cat} className="size-4" />
                                </div>
                                <div>
                                  <p className="text-sm font-semibold">{companion}</p>
                                  <p className="text-[10px] text-muted-foreground capitalize">{cat}</p>
                                </div>
                              </div>
                              {pair && (
                                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{pair.reason}</p>
                              )}
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Plants to Avoid */}
                {plantInfo.avoid.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <X className="size-4 text-rose-500" />
                      <h4 className="text-sm font-semibold text-rose-700 dark:text-rose-300">Avoid Planting Near</h4>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {plantInfo.avoid.map((avoid) => {
                        const cat = getPlantCategory(avoid);
                        const style = getCategoryStyle(cat);
                        const pair = companionPairs.find(
                          (p) =>
                            (p.plantA.toLowerCase() === plantInfo.plantName.toLowerCase() &&
                              p.plantB.toLowerCase() === avoid.toLowerCase()) ||
                            (p.plantB.toLowerCase() === plantInfo.plantName.toLowerCase() &&
                              p.plantA.toLowerCase() === avoid.toLowerCase())
                        );
                        return (
                          <Card key={avoid} className="border-0 shadow-sm bg-rose-50/50 dark:bg-rose-950/10">
                            <CardContent className="p-4">
                              <div className="flex items-center gap-2.5">
                                <div className={cn("icon-circle size-8", style.bg, "dark:opacity-90")}>
                                  <PlantIcon category={cat} className="size-4" />
                                </div>
                                <div>
                                  <p className="text-sm font-semibold">{avoid}</p>
                                  <p className="text-[10px] text-muted-foreground capitalize">{cat}</p>
                                </div>
                              </div>
                              {pair && (
                                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{pair.reason}</p>
                              )}
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Info footer */}
        <div className="flex items-start gap-2 rounded-lg border bg-card/50 p-3 text-xs text-muted-foreground">
          <Info className="size-4 shrink-0 mt-0.5 text-muted-foreground" />
          <p>
            Companion planting recommendations are based on research from university extension services
            (UC Davis, Cornell, RHS) and traditional growing wisdom. Results may vary by climate and soil conditions.
          </p>
        </div>
      </div>
    </PageShell>
  );
}
