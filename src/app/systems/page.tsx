"use client";

import { useState } from "react";
import { Pipette, Check, X, Star, DollarSign, Wrench, Sprout } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { growingSystems, getSystemsByDifficulty } from "@/data/systems-guide";
import type { SystemDifficulty } from "@/types";
import { cn } from "@/lib/utils";

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

export default function SystemsPage() {
  const [difficulty, setDifficulty] = useState<SystemDifficulty | "all">("all");
  const systems = difficulty === "all" ? growingSystems : getSystemsByDifficulty(difficulty);

  return (
    <PageShell>
      <div className="space-y-5">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Growing Systems</h2>
          <p className="text-sm text-muted-foreground mt-1">Compare hydroponic and aquaponic system types.</p>
        </div>

        <div className="inline-flex rounded-xl bg-muted/60 p-1 flex-wrap">
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

        <div className="grid gap-4 md:grid-cols-2">
          {systems.map((system) => (
            <Card key={system.id} className="card-hover shadow-sm flex flex-col">
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
                  <Badge variant="secondary" className={cn("text-[10px] h-5 capitalize shrink-0", difficultyColors[system.difficulty])}>
                    {system.difficulty}
                  </Badge>
                </div>
                <CardDescription className="mt-2 leading-relaxed">{system.description}</CardDescription>
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
                  <div className="rounded-xl bg-muted/40 px-3 py-2">
                    <p className="flex items-center gap-1 text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">
                      <DollarSign className="size-3" /> Setup Cost
                    </p>
                    <p className="font-semibold mt-0.5">{costIcons[system.setupCost]}</p>
                  </div>
                  <div className="rounded-xl bg-muted/40 px-3 py-2">
                    <p className="flex items-center gap-1 text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">
                      <Wrench className="size-3" /> Maintenance
                    </p>
                    <p className="font-semibold mt-0.5 capitalize">{system.maintenanceLevel}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">Pros</p>
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
                  <p className="text-xs font-semibold text-red-700 dark:text-red-300 uppercase tracking-wider">Cons</p>
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
            </Card>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
