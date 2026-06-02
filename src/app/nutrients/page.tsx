"use client";

import { useState } from "react";
import { FlaskConical, Droplets, BookOpen } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { nutrientBrands, nutrientTargets, getNutrientTarget } from "@/data/nutrients";
import type { GrowthStage } from "@/types";
import { cn } from "@/lib/utils";

const stages: GrowthStage[] = ["germination", "seedling", "vegetative", "flowering", "fruiting"];

const stageLabels: Record<string, string> = {
  germination: "Germination",
  seedling: "Seedling",
  vegetative: "Vegetative",
  flowering: "Flowering",
  fruiting: "Fruiting",
};

const stageColors: Record<string, string> = {
  germination: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  seedling: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300",
  vegetative: "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-300",
  flowering: "bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300",
  fruiting: "bg-orange-100 text-orange-700 dark:bg-orange-950/30 dark:text-orange-300",
};

export default function NutrientsPage() {
  const [stage, setStage] = useState<GrowthStage>("vegetative");

  return (
    <PageShell>
      <div className="space-y-5">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Nutrients</h2>
          <p className="text-sm text-muted-foreground mt-1">EC, pH, and NPK targets for your plants.</p>
        </div>

        {/* Stage Tabs */}
        <div className="inline-flex rounded-xl bg-muted/60 p-1 flex-wrap">
          {stages.map((s) => (
            <button
              key={s}
              onClick={() => setStage(s)}
              className={cn(
                "rounded-lg px-4 py-2 text-sm font-medium transition-all",
                stage === s
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {stageLabels[s]}
            </button>
          ))}
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <div className="icon-circle size-9 bg-blue-100 dark:bg-blue-950/30">
                  <Droplets className="size-4 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-base">EC & pH Targets</CardTitle>
                  <CardDescription>Recommended ranges for {stageLabels[stage].toLowerCase()} stage</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                {Object.entries(nutrientTargets).slice(0, 16).map(([name, targets]) => {
                  const target = targets[stage];
                  if (!target) return null;
                  return (
                    <div key={name} className="flex items-center justify-between rounded-xl border px-4 py-2.5 transition-colors hover:bg-accent/30">
                      <span className="text-sm font-medium">{name}</span>
                      <div className="flex gap-3 text-xs font-semibold">
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
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <div className="icon-circle size-9 bg-purple-100 dark:bg-purple-950/30">
                  <FlaskConical className="size-4 text-purple-600" />
                </div>
                <div>
                  <CardTitle className="text-base">Nutrient Brands</CardTitle>
                  <CardDescription>Products and mixing ratios</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {nutrientBrands.map((brand) => (
                <div key={brand.name} className="rounded-xl border p-4 transition-colors hover:bg-accent/20">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-sm">{brand.name}</p>
                    <Badge variant="outline" className="text-[10px] h-5">{brand.country}</Badge>
                  </div>
                  <div className="space-y-1.5">
                    {brand.products
                      .filter((p) => p.stages.includes(stage))
                      .map((product) => (
                        <div key={product.name} className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground text-xs">
                            {product.name} {product.npk && <span className="text-[10px] opacity-60">({product.npk})</span>}
                          </span>
                          <span className="font-semibold text-xs bg-muted/60 px-2 py-0.5 rounded-full">{product.mlPerLiter} ml/L</span>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card className="border-0 shadow-sm gradient-slate">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <div className="icon-circle size-9 bg-emerald-100 dark:bg-emerald-950/30">
                <BookOpen className="size-4 text-emerald-600" />
              </div>
              <div>
                <CardTitle className="text-base">Quick Reference</CardTitle>
                <CardDescription>Understanding your nutrient metrics</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <div className="rounded-xl border bg-card/50 p-4">
              <p className="font-semibold text-foreground mb-1">EC (Electrical Conductivity)</p>
              <p>Measures total dissolved salts in your nutrient solution. Use an EC meter to ensure your plants are getting the right concentration.</p>
            </div>
            <div className="rounded-xl border bg-card/50 p-4">
              <p className="font-semibold text-foreground mb-1">pH</p>
              <p>Affects nutrient availability. Most hydroponic plants prefer pH 5.5–6.5. Check daily and adjust with pH up/down solutions.</p>
            </div>
            <div className="rounded-xl border bg-card/50 p-4">
              <p className="font-semibold text-foreground mb-1">NPK</p>
              <p>Nitrogen (N) for leaf growth, Phosphorus (P) for roots/flowers, Potassium (K) for fruit and overall health.</p>
            </div>
            <p className="text-[11px] text-muted-foreground/70 pt-1">
              Values derived from McGill University hydroponics research, NMSU Aquaponics Circular CR680, and EU TransFarm Aquaponics Report.
            </p>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
