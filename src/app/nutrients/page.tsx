"use client";

import { useState } from "react";
import { FlaskConical, Droplets, Thermometer, BookOpen } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { nutrientBrands, nutrientTargets, getNutrientTarget } from "@/data/nutrients";
import type { GrowthStage } from "@/types";

const stages: GrowthStage[] = ["germination", "seedling", "vegetative", "flowering", "fruiting"];

export default function NutrientsPage() {
  const [stage, setStage] = useState<GrowthStage>("vegetative");

  return (
    <PageShell>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Nutrients</h2>
          <p className="text-muted-foreground">EC, pH, and NPK targets for your plants.</p>
        </div>

        <Tabs value={stage} onValueChange={(v) => setStage(v as GrowthStage)}>
          <TabsList className="grid w-full grid-cols-5 sm:w-auto">
            {stages.map((s) => (
              <TabsTrigger key={s} value={s} className="capitalize text-xs sm:text-sm">
                {s}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Droplets className="size-5 text-blue-500" />
                EC & pH Targets
              </CardTitle>
              <CardDescription>Recommended ranges for {stage} stage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(nutrientTargets).slice(0, 12).map(([name, targets]) => {
                  const target = targets[stage];
                  if (!target) return null;
                  return (
                    <div key={name} className="flex items-center justify-between rounded-lg border px-3 py-2">
                      <span className="text-sm font-medium">{name}</span>
                      <div className="flex gap-3 text-xs">
                        <span className="text-blue-600 dark:text-blue-300">
                          EC {target.ec[0]}-{target.ec[1]}
                        </span>
                        <span className="text-emerald-600 dark:text-emerald-300">
                          pH {target.ph[0]}-{target.ph[1]}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FlaskConical className="size-5 text-purple-500" />
                Nutrient Brands
              </CardTitle>
              <CardDescription>Products and mixing ratios</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {nutrientBrands.map((brand) => (
                <div key={brand.name} className="rounded-lg border p-3">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{brand.name}</p>
                    <Badge variant="outline" className="text-xs">{brand.country}</Badge>
                  </div>
                  <div className="mt-2 space-y-1">
                    {brand.products
                      .filter((p) => p.stages.includes(stage))
                      .map((product) => (
                        <div key={product.name} className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            {product.name} {product.npk && <span className="text-xs">({product.npk})</span>}
                          </span>
                          <span className="font-medium">{product.mlPerLiter} ml/L</span>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="size-5 text-emerald-500" />
              Quick Reference
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              <strong className="text-foreground">EC (Electrical Conductivity):</strong> Measures total dissolved salts in your nutrient solution. Use an EC meter to ensure your plants are getting the right concentration.
            </p>
            <p>
              <strong className="text-foreground">pH:</strong> Affects nutrient availability. Most hydroponic plants prefer pH 5.5–6.5. Check daily and adjust with pH up/down solutions.
            </p>
            <p>
              <strong className="text-foreground">NPK:</strong> Nitrogen (N) for leaf growth, Phosphorus (P) for roots/flowers, Potassium (K) for fruit and overall health.
            </p>
            <p className="text-xs">
              Values derived from McGill University hydroponics research, NMSU Aquaponics Circular CR680, and EU TransFarm Aquaponics Report.
            </p>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
