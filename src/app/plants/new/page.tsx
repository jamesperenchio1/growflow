"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Leaf, Search, Plus, ArrowLeft } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { usePlants } from "@/hooks/use-plants";
import { seedPlants } from "@/data/seed-plants";
import { generateTasksForPlant } from "@/lib/notifications";
import type { PlantCategory, GrowingMethod } from "@/types";
import { cn } from "@/lib/utils";

const categories: PlantCategory[] = ["vegetable", "herb", "fruit", "flower", "medicinal"];
const methods: GrowingMethod[] = ["soil", "hydroponic", "aeroponic", "aquaponic"];

export default function NewPlantPage() {
  const router = useRouter();
  const { addPlant } = usePlants();
  const [query, setQuery] = useState("");
  const [step, setStep] = useState<"search" | "form">("search");
  const [selectedPlant, setSelectedPlant] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState<PlantCategory>("vegetable");
  const [method, setMethod] = useState<GrowingMethod>("soil");
  const [plantedDate, setPlantedDate] = useState(new Date().toISOString().split("T")[0]);

  const filtered = seedPlants.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (plantName: string) => {
    setSelectedPlant(plantName);
    setName(plantName);
    const seed = seedPlants.find((p) => p.name === plantName);
    if (seed) {
      setCategory(seed.category);
      setMethod(seed.methods[0] ?? "soil");
    }
    setStep("form");
  };

  const handleCustom = () => {
    setSelectedPlant(null);
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
      <div className="mx-auto max-w-xl space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.push("/plants")}>
            <ArrowLeft className="size-4" />
          </Button>
          <h2 className="text-2xl font-bold tracking-tight">Add Plant</h2>
        </div>

        {step === "search" && (
          <>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search plant database..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9"
                autoFocus
              />
            </div>

            <div className="grid gap-2">
              {filtered.slice(0, 12).map((plant) => (
                <button
                  key={plant.name}
                  onClick={() => handleSelect(plant.name)}
                  className="flex items-center gap-3 rounded-lg border px-4 py-3 text-left transition-colors hover:bg-accent"
                >
                  <Leaf className="size-5 text-emerald-500" />
                  <div className="flex-1">
                    <p className="font-medium">{plant.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{plant.category}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {plant.daysToHarvest}d
                  </Badge>
                </button>
              ))}
            </div>

            <Button variant="outline" className="w-full gap-2" onClick={handleCustom}>
              <Plus className="size-4" />
              Add Custom Plant
            </Button>
          </>
        )}

        {step === "form" && (
          <Card>
            <CardHeader>
              <CardTitle>Plant Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Plant name" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((c) => (
                    <button
                      key={c}
                      onClick={() => setCategory(c)}
                      className={cn(
                        "rounded-full border px-3 py-1 text-sm capitalize transition-colors",
                        category === c
                          ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300"
                          : "border-border hover:bg-accent"
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
                        "rounded-full border px-3 py-1 text-sm capitalize transition-colors",
                        method === m
                          ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300"
                          : "border-border hover:bg-accent"
                      )}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Planted Date</label>
                <Input type="date" value={plantedDate} onChange={(e) => setPlantedDate(e.target.value)} />
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setStep("search")}>
                  Back
                </Button>
                <Button className="flex-1" onClick={handleSubmit} disabled={!name.trim()}>
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
