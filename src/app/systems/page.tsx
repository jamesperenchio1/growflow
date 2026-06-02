"use client";

import { useState } from "react";
import { Pipette, Check, X, Star, DollarSign, Wrench } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { growingSystems, getSystemsByDifficulty } from "@/data/systems-guide";
import type { SystemDifficulty } from "@/types";
import { cn } from "@/lib/utils";

const difficulties: SystemDifficulty[] = ["beginner", "intermediate", "advanced"];

const costIcons = {
  low: "$",
  medium: "$$",
  high: "$$$",
};

export default function SystemsPage() {
  const [difficulty, setDifficulty] = useState<SystemDifficulty | "all">("all");
  const systems = difficulty === "all" ? growingSystems : getSystemsByDifficulty(difficulty);

  return (
    <PageShell>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Growing Systems</h2>
          <p className="text-muted-foreground">Compare hydroponic and aquaponic system types.</p>
        </div>

        <Tabs value={difficulty} onValueChange={(v) => setDifficulty(v as SystemDifficulty | "all")}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            {difficulties.map((d) => (
              <TabsTrigger key={d} value={d} className="capitalize">
                {d}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="grid gap-4 md:grid-cols-2">
          {systems.map((system) => (
            <Card key={system.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Pipette className="size-5 text-emerald-500" />
                    {system.name}
                  </CardTitle>
                  <Badge variant="outline" className="capitalize">
                    {system.difficulty}
                  </Badge>
                </div>
                <CardDescription>{system.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                <div className="flex flex-wrap gap-2">
                  {system.idealCrops.slice(0, 5).map((crop) => (
                    <Badge key={crop} variant="secondary" className="text-xs">
                      {crop}
                    </Badge>
                  ))}
                  {system.idealCrops.length > 5 && (
                    <Badge variant="secondary" className="text-xs">
                      +{system.idealCrops.length - 5}
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="flex items-center gap-1 text-muted-foreground">
                      <DollarSign className="size-3" /> Setup Cost
                    </p>
                    <p className="font-medium">{costIcons[system.setupCost]}</p>
                  </div>
                  <div>
                    <p className="flex items-center gap-1 text-muted-foreground">
                      <Wrench className="size-3" /> Maintenance
                    </p>
                    <p className="font-medium capitalize">{system.maintenanceLevel}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Pros</p>
                  <ul className="space-y-1">
                    {system.pros.slice(0, 3).map((pro) => (
                      <li key={pro} className="flex items-start gap-2 text-sm">
                        <Check className="mt-0.5 size-3 shrink-0 text-emerald-500" />
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-red-700 dark:text-red-300">Cons</p>
                  <ul className="space-y-1">
                    {system.cons.slice(0, 3).map((con) => (
                      <li key={con} className="flex items-start gap-2 text-sm">
                        <X className="mt-0.5 size-3 shrink-0 text-red-500" />
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
