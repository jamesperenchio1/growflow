"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Leaf, Search, Plus, ArrowLeft, Sprout, Flower2, Check,
  Carrot, Apple, Flower, Trash2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PageShell } from "@/components/layout/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePlants } from "@/hooks/use-plants";
import { useSpaces } from "@/hooks/use-spaces";
import { useGardenStore } from "@/store/garden-store";
import { seedPlants } from "@/data/seed-plants";
import { getPlantImage } from "@/data/plant-images";
import { generateTasksForPlant } from "@/lib/notifications";
import type { PlantCategory, GrowingMethod } from "@/types";
import { cn } from "@/lib/utils";

const categories: PlantCategory[] = ["vegetable", "herb", "fruit", "flower"];
const methods: GrowingMethod[] = ["soil", "hydroponic", "aeroponic", "aquaponic"];

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

interface PlantConfig {
  quantity: number;
  method: GrowingMethod;
  plantedDate: string;
  spaceId?: number;
  category?: PlantCategory;
}

export default function NewPlantPage() {
  const router = useRouter();
  const { addPlant } = usePlants();
  const { spaces } = useSpaces();
  const { gardens, activeGardenId } = useGardenStore();
  const activeGarden = gardens.find((g) => g.id === activeGardenId);
  const [query, setQuery] = useState("");
  const [step, setStep] = useState<"search" | "config">("search");
  const [selectedNames, setSelectedNames] = useState<string[]>([]);
  const [configs, setConfigs] = useState<Record<string, PlantConfig>>({});

  const filtered = seedPlants.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  const isSelected = (name: string) => selectedNames.includes(name);

  const toggleSelect = (plantName: string) => {
    setSelectedNames((prev) => {
      const exists = prev.includes(plantName);
      if (exists) {
        // remove config too
        setConfigs((c) => {
          const next = { ...c };
          delete next[plantName];
          return next;
        });
        return prev.filter((n) => n !== plantName);
      }
      const seed = seedPlants.find((p) => p.name === plantName);
      setConfigs((c) => ({
        ...c,
        [plantName]: {
          quantity: 1,
          method: seed?.methods[0] ?? "soil",
          plantedDate: new Date().toISOString().split("T")[0],
          spaceId: undefined,
        },
      }));
      return [...prev, plantName];
    });
  };

  const updateConfig = (name: string, patch: Partial<PlantConfig>) => {
    setConfigs((c) => ({
      ...c,
      [name]: { ...c[name], ...patch },
    }));
  };

  const handleSubmitAll = async () => {
    if (selectedNames.length === 0) return;
    const dbModule = await import("@/lib/db");
    for (const name of selectedNames) {
      const cfg = configs[name];
      const seed = seedPlants.find((p) => p.name === name);
      if (!cfg) continue;
      const qty = cfg.quantity || 1;
      const ids = await addPlant({
        name: name.trim(),
        category: seed?.category ?? cfg.category ?? "vegetable",
        growingMethod: cfg.method,
        plantedDate: new Date(cfg.plantedDate),
        healthTags: [],
        tags: [],
        photoUrl: seed?.imageUrl,
        spaceId: cfg.spaceId,
        quantity: qty,
      });
      for (const id of ids) {
        const plant = await dbModule.db.plants.get(id);
        if (plant) {
          await generateTasksForPlant(plant);
        }
      }
    }
    router.push("/plants");
  };

  const selectedCount = selectedNames.length;

  return (
    <PageShell>
      <div className="mx-auto max-w-3xl space-y-5 page-enter">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.push("/plants")} className="text-muted-foreground">
            <ArrowLeft className="size-4" />
          </Button>
          <h2 className="text-2xl font-bold tracking-tight">Add Plant</h2>
          {selectedCount > 0 && (
            <Badge className="ml-2 bg-emerald-600 text-white">
              Selected ({selectedCount})
            </Badge>
          )}
        </div>

        {activeGarden && (
          <div className="flex items-center gap-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-300">
            <Flower2 className="size-4" />
            <span className="font-medium">Adding to:</span>
            <span>{activeGarden.name}</span>
          </div>
        )}

        {step === "search" && (
          <>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search plant database..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9 h-11"
                autoFocus
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {filtered.slice(0, 18).map((plant) => {
                const img = getPlantImage(plant.name)?.url;
                const CategoryIcon = categoryIcons[plant.category] ?? Leaf;
                const selected = isSelected(plant.name);
                return (
                  <button
                    key={plant.name}
                    onClick={() => toggleSelect(plant.name)}
                    className={cn(
                      "relative flex items-center gap-4 w-full rounded-xl border px-4 py-4 text-left transition-all hover:bg-accent hover:border-muted-foreground",
                      selected && "ring-2 ring-emerald-500 ring-offset-2 bg-emerald-50 dark:bg-emerald-950"
                    )}
                  >
                    {selected && (
                      <div className="absolute top-2 right-2 size-5 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                        <Check className="size-3" />
                      </div>
                    )}
                    <div className="shrink-0">
                      {img ? (
                        <img
                          src={img}
                          alt={plant.name}
                          className="size-14 rounded-xl object-cover aspect-square"
                        />
                      ) : (
                        <div className="icon-circle size-14 bg-emerald-50 dark:bg-emerald-950/30">
                          <Leaf className="size-6 text-emerald-500" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm">{plant.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className={cn("text-[10px] h-5 capitalize gap-0.5", categoryColors[plant.category])}>
                          <CategoryIcon className="size-3" />
                          {plant.category}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground">
                          {plant.daysToHarvest}d to harvest
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-8 text-muted-foreground text-sm">No plants match your search.</div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                className="flex-1 gap-2 h-11"
                onClick={() => {
                  // Add custom: start config step with empty custom plant
                  setSelectedNames(["Custom Plant"]);
                  setConfigs({
                    "Custom Plant": {
                      quantity: 1,
                      method: "soil",
                      plantedDate: new Date().toISOString().split("T")[0],
                      spaceId: undefined,
                    },
                  });
                  setStep("config");
                }}
              >
                <Plus className="size-4" />
                Add Custom Plant
              </Button>
              {selectedCount > 0 && (
                <Button
                  className="flex-1 gap-2 h-11 bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => setStep("config")}
                >
                  <Sprout className="size-4" />
                  Configure ({selectedCount})
                </Button>
              )}
            </div>
          </>
        )}

        {step === "config" && (
          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <Button variant="outline" className="h-11" onClick={() => setStep("search")}>
                Back to Selection
              </Button>
              <Button
                className="flex-1 h-11 bg-emerald-600 hover:bg-emerald-700 gap-2"
                onClick={handleSubmitAll}
                disabled={selectedNames.length === 0}
              >
                <Sprout className="size-4" />
                Add All Plants
              </Button>
            </div>

            <div className="space-y-4">
              {selectedNames.map((name) => {
                const cfg = configs[name];
                const seed = seedPlants.find((p) => p.name === name);
                const isCustom = !seed;
                const img = seed ? getPlantImage(seed.name)?.url : undefined;
                const CategoryIcon = seed ? (categoryIcons[seed.category] ?? Leaf) : Leaf;
                return (
                  <Card key={name} className="shadow-sm">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {img ? (
                            <img src={img} alt={name} className="size-12 rounded-xl object-cover aspect-square" />
                          ) : (
                            <div className="icon-circle size-12 bg-emerald-50 dark:bg-emerald-950/30">
                              <Leaf className="size-5 text-emerald-500" />
                            </div>
                          )}
                          <div>
                            <CardTitle className="text-base">{name}</CardTitle>
                            {seed && (
                              <Badge variant="secondary" className={cn("text-[10px] h-5 capitalize gap-0.5 mt-1", categoryColors[seed.category])}>
                                <CategoryIcon className="size-3" />
                                {seed.category}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground/50 hover:text-destructive"
                          onClick={() => toggleSelect(name)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-0">
                      {isCustom && (
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Name</label>
                          <Input
                            value={name === "Custom Plant" ? "" : name}
                            onChange={(e) => {
                              const newName = e.target.value.trim() || "Custom Plant";
                              if (newName === name) return;
                              setSelectedNames((prev) => prev.map((n) => (n === name ? newName : n)));
                              setConfigs((c) => {
                                const next = { ...c };
                                next[newName] = next[name];
                                delete next[name];
                                return next;
                              });
                            }}
                            placeholder="Plant name"
                            className="h-11"
                          />
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Quantity</label>
                          <Input
                            type="number"
                            min={1}
                            value={cfg?.quantity ?? 1}
                            onChange={(e) => updateConfig(name, { quantity: Math.max(1, Number(e.target.value)) })}
                            className="h-11"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Planted Date</label>
                          <Input
                            type="date"
                            value={cfg?.plantedDate ?? new Date().toISOString().split("T")[0]}
                            onChange={(e) => updateConfig(name, { plantedDate: e.target.value })}
                            className="h-11"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Growing Method</label>
                        <div className="flex flex-wrap gap-2">
                          {(isCustom ? methods : seed?.methods ?? methods).map((m) => (
                            <button
                              key={m}
                              onClick={() => updateConfig(name, { method: m })}
                              className={cn(
                                "rounded-full border-2 px-4 py-2 text-sm font-medium capitalize transition-all",
                                cfg?.method === m
                                  ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300"
                                  : "border-border hover:bg-accent hover:text-foreground"
                              )}
                            >
                              {m}
                            </button>
                          ))}
                        </div>
                      </div>

                      {isCustom && (
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Category</label>
                          <div className="flex flex-wrap gap-2">
                            {categories.map((c) => (
                              <button
                                key={c}
                                onClick={() => {
                                  // For custom plants we don't store category in config,
                                  // but we need to pass it on submit. We'll use a temporary field.
                                  updateConfig(name, { category: c as any });
                                }}
                                className={cn(
                                  "rounded-full border-2 px-4 py-2 text-sm font-medium capitalize transition-all",
                                  cfg?.category === c
                                    ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300"
                                    : "border-border hover:bg-accent hover:text-foreground"
                                )}
                              >
                                {c}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Space</label>
                        <select
                          value={cfg?.spaceId ?? ""}
                          onChange={(e) => updateConfig(name, { spaceId: e.target.value ? Number(e.target.value) : undefined })}
                          className="w-full h-11 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                          <option value="">Unassigned</option>
                          {spaces.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.name} ({s.type.replace("_", " ")})
                            </option>
                          ))}
                        </select>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </PageShell>
  );
}
