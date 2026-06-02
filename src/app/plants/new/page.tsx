"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Leaf, Search, Plus, ArrowLeft, Sprout, Flower2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PageShell } from "@/components/layout/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePlants } from "@/hooks/use-plants";
import { useGardenStore } from "@/store/garden-store";
import { seedPlants } from "@/data/seed-plants";
import { generateTasksForPlant } from "@/lib/notifications";
import type { PlantCategory, GrowingMethod } from "@/types";
import { cn } from "@/lib/utils";

const categories: PlantCategory[] = ["vegetable", "herb", "fruit", "flower", "medicinal"];
const methods: GrowingMethod[] = ["soil", "hydroponic", "aeroponic", "aquaponic"];

export default function NewPlantPage() {
  const router = useRouter();
  const { addPlant } = usePlants();
  const { gardens, activeGardenId } = useGardenStore();
  const activeGarden = gardens.find((g) => g.id === activeGardenId);
  const [query, setQuery] = useState("");
  const [step, setStep] = useState<"search" | "form">("search");
  const [name, setName] = useState("");
  const [category, setCategory] = useState<PlantCategory>("vegetable");
  const [method, setMethod] = useState<GrowingMethod>("soil");
  const [plantedDate, setPlantedDate] = useState(new Date().toISOString().split("T")[0]);

  const filtered = seedPlants.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (plantName: string) => {
    setName(plantName);
    const seed = seedPlants.find((p) => p.name === plantName);
    if (seed) {
      setCategory(seed.category);
      setMethod(seed.methods[0] ?? "soil");
    }
    setStep("form");
  };

  const handleCustom = () => {
    setStep("form");
  };

  const handleSubmit = async () => {
    if (!name.trim()) return;
    const id = await addPlant({
      name: name.trim(),
      category,
      growingMethod: method,
      plantedDate: new Date(plantedDate),
      healthTags: [],
      tags: [],
    });
    const plant = await (await import("@/lib/db")).db.plants.get(id);
    if (plant) {
      await generateTasksForPlant(plant);
    }
    router.push("/plants");
  };

  return (
    <PageShell>
      <div className="mx-auto max-w-xl space-y-5 page-enter">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.push("/plants")} className="text-muted-foreground">
            <ArrowLeft className="size-4" />
          </Button>
          <h2 className="text-2xl font-bold tracking-tight">Add Plant</h2>
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

            <div className="space-y-2">
              {filtered.slice(0, 12).map((plant) => (
                <button
                  key={plant.name}
                  onClick={() => handleSelect(plant.name)}
                  className="flex items-center gap-4 w-full rounded-xl border px-5 py-4 text-left transition-all hover:bg-accent/50 hover:border-muted-foreground/30"
                >
                  <div className="icon-circle size-10 bg-emerald-50 dark:bg-emerald-950/30">
                    <Leaf className="size-5 text-emerald-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{plant.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{plant.category}</p>
                  </div>
                  <Badge variant="outline" className="text-[10px] h-5">
                    {plant.daysToHarvest}d to harvest
                  </Badge>
                </button>
              ))}
            </div>

            <Button variant="outline" className="w-full gap-2 h-11" onClick={handleCustom}>
              <Plus className="size-4" />
              Add Custom Plant
            </Button>
          </>
        )}

        {step === "form" && (
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle>Plant Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Plant name" className="h-11" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((c) => (
                    <button
                      key={c}
                      onClick={() => setCategory(c)}
                      className={cn(
                        "rounded-full border-2 px-4 py-2 text-sm font-medium capitalize transition-all",
                        category === c
                          ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300"
                          : "border-border hover:bg-accent hover:text-foreground"
                      )}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Growing Method</label>
                <div className="flex flex-wrap gap-2">
                  {methods.map((m) => (
                    <button
                      key={m}
                      onClick={() => setMethod(m)}
                      className={cn(
                        "rounded-full border-2 px-4 py-2 text-sm font-medium capitalize transition-all",
                        method === m
                          ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300"
                          : "border-border hover:bg-accent hover:text-foreground"
                      )}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Planted Date</label>
                <Input type="date" value={plantedDate} onChange={(e) => setPlantedDate(e.target.value)} className="h-11" />
              </div>

              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1 h-11" onClick={() => setStep("search")}>
                  Back
                </Button>
                <Button className="flex-1 h-11 bg-emerald-600 hover:bg-emerald-700" onClick={handleSubmit} disabled={!name.trim()}>
                  <Sprout className="size-4 mr-2" />
                  Add Plant
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </PageShell>
  );
}
