"use client";

import { useState } from "react";
import {
  FlaskConical,
  Droplets,
  BookOpen,
  Calculator,
  Beaker,
  CheckCircle2,
  ArrowRightLeft,
  Droplet,
  AlertTriangle,
  Package,
} from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { nutrientBrands, nutrientTargets } from "@/data/nutrients";
import { useSuppliesStore } from "@/store/supplies-store";
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

const nutrientBrandOptions = ["General Hydroponics", "Masterblend", "Canna", "Custom"];
const growthStageOptions = ["seedling", "vegetative", "flowering", "fruiting"] as const;
const growthStageLabel: Record<string, string> = {
  seedling: "Seedling",
  vegetative: "Vegetative",
  flowering: "Flowering",
  fruiting: "Fruiting",
};
const productTypeOptions = ["2-Part A+B", "3-Part (Micro/Grow/Bloom)", "Single Part"];

const dosingRates: Record<
  string,
  Record<string, Record<string, { a: number; b?: number; c?: number }>>
> = {
  "General Hydroponics": {
    "3-Part (Micro/Grow/Bloom)": {
      seedling: { a: 1.0, b: 1.0, c: 1.0 },
      vegetative: { a: 2.5, b: 2.5, c: 1.0 },
      flowering: { a: 2.5, b: 1.0, c: 2.5 },
      fruiting: { a: 2.5, b: 1.0, c: 2.5 },
    },
    "2-Part A+B": {
      seedling: { a: 1.5, b: 1.5 },
      vegetative: { a: 2.5, b: 2.0 },
      flowering: { a: 2.5, b: 2.5 },
      fruiting: { a: 2.5, b: 2.5 },
    },
    "Single Part": {
      seedling: { a: 1.0 },
      vegetative: { a: 2.0 },
      flowering: { a: 2.0 },
      fruiting: { a: 2.0 },
    },
  },
  Masterblend: {
    "2-Part A+B": {
      seedling: { a: 1.2, b: 1.2 },
      vegetative: { a: 2.0, b: 2.0 },
      flowering: { a: 2.5, b: 2.5 },
      fruiting: { a: 2.5, b: 2.5 },
    },
    "3-Part (Micro/Grow/Bloom)": {
      seedling: { a: 1.0, b: 1.0, c: 0.5 },
      vegetative: { a: 2.0, b: 2.0, c: 1.0 },
      flowering: { a: 2.0, b: 2.0, c: 1.5 },
      fruiting: { a: 2.0, b: 2.0, c: 1.5 },
    },
    "Single Part": {
      seedling: { a: 1.2 },
      vegetative: { a: 2.0 },
      flowering: { a: 2.5 },
      fruiting: { a: 2.5 },
    },
  },
  Canna: {
    "2-Part A+B": {
      seedling: { a: 2.0, b: 2.0 },
      vegetative: { a: 3.0, b: 3.0 },
      flowering: { a: 4.0, b: 4.0 },
      fruiting: { a: 4.0, b: 4.0 },
    },
    "3-Part (Micro/Grow/Bloom)": {
      seedling: { a: 1.5, b: 1.5, c: 1.0 },
      vegetative: { a: 2.5, b: 2.5, c: 1.5 },
      flowering: { a: 3.0, b: 2.0, c: 3.0 },
      fruiting: { a: 3.0, b: 2.0, c: 3.0 },
    },
    "Single Part": {
      seedling: { a: 2.0 },
      vegetative: { a: 3.0 },
      flowering: { a: 4.0 },
      fruiting: { a: 4.0 },
    },
  },
  Custom: {
    "2-Part A+B": {
      seedling: { a: 1.0, b: 1.0 },
      vegetative: { a: 2.0, b: 2.0 },
      flowering: { a: 3.0, b: 3.0 },
      fruiting: { a: 3.0, b: 3.0 },
    },
    "3-Part (Micro/Grow/Bloom)": {
      seedling: { a: 1.0, b: 1.0, c: 1.0 },
      vegetative: { a: 2.0, b: 2.0, c: 1.0 },
      flowering: { a: 2.0, b: 1.0, c: 2.0 },
      fruiting: { a: 2.0, b: 1.0, c: 2.0 },
    },
    "Single Part": {
      seedling: { a: 1.0 },
      vegetative: { a: 2.0 },
      flowering: { a: 3.0 },
      fruiting: { a: 3.0 },
    },
  },
};

function getPartLabels(brand: string, productType: string) {
  if (productType === "3-Part (Micro/Grow/Bloom)") {
    if (brand === "General Hydroponics") return { a: "FloraMicro", b: "FloraGro", c: "FloraBloom" };
    return { a: "Part A (Micro)", b: "Part B (Grow)", c: "Part C (Bloom)" };
  }
  if (productType === "2-Part A+B") {
    if (brand === "Masterblend") return { a: "4-18-38 Formula", b: "Calcium Nitrate" };
    if (brand === "Canna") return { a: "Canna Vega", b: "Canna Flores" };
    return { a: "Part A", b: "Part B" };
  }
  return { a: "Nutrient" };
}

function calcPHAdjusterMl(currentPH: number, targetPH: number, volumeL: number): { ml: number; direction: "up" | "down"; diff: number } {
  const diff = Math.abs(currentPH - targetPH);
  const direction: "up" | "down" = currentPH > targetPH ? "down" : "up";
  // ~1.5 mL per 10L per 1.0 pH unit
  const ml = Math.round((diff / 1.0) * 1.5 * (volumeL / 10) * 10) / 10;
  return { ml, direction, diff };
}

function SupplyHint({ brand, partName, amountMl }: { brand: string; partName: string; amountMl: number }) {
  const { items } = useSuppliesStore();
  const match = items.find((i) =>
    i.category === "nutrient" &&
    (i.name.toLowerCase().includes(brand.toLowerCase()) ||
     i.name.toLowerCase().includes(partName.toLowerCase().replace("flora", "").trim()))
  );
  if (!match) return null;
  const mixes = Math.floor(match.quantity / amountMl);
  return (
    <div className="flex items-start gap-2 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/30 p-3 mt-3">
      <Package className="size-4 text-blue-600 mt-0.5 shrink-0" />
      <p className="text-xs text-blue-800 dark:text-blue-200">
        You have <span className="font-semibold">{match.quantity} {match.unit}</span> of{" "}
        <span className="font-semibold">{match.name}</span> remaining — enough for{" "}
        <span className="font-semibold">{mixes} mix{mixes !== 1 ? "es" : ""}</span> at this volume.
      </p>
    </div>
  );
}

export default function NutrientsPage() {
  const [stage, setStage] = useState<GrowthStage>("vegetative");

  // Calculator state
  const [reservoirVolume, setReservoirVolume] = useState<number | "">(50);
  const [currentEC, setCurrentEC] = useState<number | "">("");
  const [targetEC, setTargetEC] = useState<number | "">("");
  const [currentPH, setCurrentPH] = useState<number | "">("");
  const [targetPH, setTargetPH] = useState<number | "">(5.8);
  const [nutrientBrand, setNutrientBrand] = useState("General Hydroponics");
  const [calcGrowthStage, setCalcGrowthStage] = useState("vegetative");
  const [productType, setProductType] = useState("3-Part (Micro/Grow/Bloom)");
  const [results, setResults] = useState<{
    partA: number;
    partB: number;
    partC?: number;
    partALabel: string;
    partBLabel: string;
    partCLabel?: string;
    phAdjuster?: { ml: number; direction: "up" | "down"; diff: number };
    estimatedPPM500: number;
    estimatedPPM700: number;
  } | null>(null);

  // Conversion tools state
  const [ecToPpm, setEcToPpm] = useState<number | "">("");
  const [ppmScale, setPpmScale] = useState<"500" | "700">("500");
  const [topOffCurrentVol, setTopOffCurrentVol] = useState<number | "">("");
  const [topOffCurrentEC, setTopOffCurrentEC] = useState<number | "">("");
  const [topOffTargetEC, setTopOffTargetEC] = useState<number | "">("");
  const [diluteConcentrateMl, setDiluteConcentrateMl] = useState<number | "">("");
  const [diluteStrength, setDiluteStrength] = useState<number | "">("");
  const [diluteVolume, setDiluteVolume] = useState<number | "">("");

  function handleCalculate() {
    const vol = typeof reservoirVolume === "number" ? reservoirVolume : 0;
    if (vol <= 0) return;

    const brandRates = dosingRates[nutrientBrand];
    const typeRates = brandRates?.[productType];
    const rate = typeRates?.[calcGrowthStage];
    if (!rate) return;

    const partA = Math.round(rate.a * vol * 10) / 10;
    const partB = rate.b !== undefined ? Math.round(rate.b * vol * 10) / 10 : 0;
    const partC = rate.c !== undefined ? Math.round(rate.c * vol * 10) / 10 : undefined;

    const labels = getPartLabels(nutrientBrand, productType);

    let phAdjuster: { ml: number; direction: "up" | "down"; diff: number } | undefined;
    if (typeof currentPH === "number" && typeof targetPH === "number" && currentPH !== targetPH) {
      phAdjuster = calcPHAdjusterMl(currentPH, targetPH, vol);
    }

    const targetEcVal = typeof targetEC === "number" ? targetEC : rate.a * 0.6; // rough estimate if not set
    const estimatedPPM500 = Math.round(targetEcVal * 500);
    const estimatedPPM700 = Math.round(targetEcVal * 700);

    setResults({
      partA,
      partB,
      partC,
      partALabel: labels.a,
      partBLabel: labels.b ?? "Part B",
      partCLabel: labels.c,
      phAdjuster,
      estimatedPPM500,
      estimatedPPM700,
    });
  }

  function applyStagePreset(s: GrowthStage) {
    setCalcGrowthStage(s);
    // Set a reasonable target EC based on the first plant's target range mid-point
    const firstPlant = Object.values(nutrientTargets)[0];
    if (firstPlant && firstPlant[s]) {
      const midEC = (firstPlant[s].ec[0] + firstPlant[s].ec[1]) / 2;
      setTargetEC(Math.round(midEC * 10) / 10);
    }
  }

  // Top-off calculation
  const topOffResult = (() => {
    const cv = typeof topOffCurrentVol === "number" ? topOffCurrentVol : 0;
    const ce = typeof topOffCurrentEC === "number" ? topOffCurrentEC : 0;
    const te = typeof topOffTargetEC === "number" ? topOffTargetEC : 0;
    if (cv <= 0 || ce <= 0 || te <= 0) return null;
    if (te < ce) {
      const addedWater = Math.round((cv * (ce - te)) / te * 10) / 10;
      return { action: "add_water", amount: addedWater } as const;
    }
    if (te > ce) {
      // Need to add nutrients — rough estimate: assuming nutrients raise EC by ~0.4 per mL/L
      // For simplicity, suggest increasing reservoir volume or adding concentrate
      const ecDiff = te - ce;
      return { action: "add_nutrient", ecDiff: Math.round(ecDiff * 100) / 100 } as const;
    }
    return { action: "no_change" } as const;
  })();

  // Dilution calculation
  const dilutionResult = (() => {
    const strength = typeof diluteStrength === "number" ? diluteStrength : 0;
    const vol = typeof diluteVolume === "number" ? diluteVolume : 0;
    const bottle = typeof diluteConcentrateMl === "number" ? diluteConcentrateMl : 0;
    if (strength <= 0 || vol <= 0) return null;
    const needed = Math.round(strength * vol * 10) / 10;
    const totalTreatable = bottle > 0 ? Math.round((bottle / strength) * 10) / 10 : null;
    return { needed, totalTreatable };
  })();

  return (
    <PageShell>
      <div className="space-y-5">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Nutrients</h2>
          <p className="text-sm text-muted-foreground mt-1">EC, pH, and NPK targets for your plants.</p>
        </div>

        {/* ===== CALCULATOR SECTION ===== */}
        <Card className="border-0 shadow-sm gradient-blue">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <div className="icon-circle size-9 bg-blue-100 dark:bg-blue-950/30">
                <Calculator className="size-4 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-base">Nutrient Mixing Calculator</CardTitle>
                <CardDescription>Calculate dosing for your reservoir volume</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-5 lg:grid-cols-2">
              {/* Form */}
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Reservoir Volume (L)</label>
                    <Input
                      type="number"
                      min={1}
                      step={1}
                      value={reservoirVolume}
                      onChange={(e) => setReservoirVolume(e.target.value === "" ? "" : Number(e.target.value))}
                    />
                    <p className="text-[11px] text-muted-foreground">Net working volume, not manufacturer capacity</p>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Nutrient Brand</label>
                    <Select
                      value={nutrientBrand}
                      onChange={(e) => setNutrientBrand(e.target.value)}
                    >
                      {nutrientBrandOptions.map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Growth Stage</label>
                    <Select
                      value={calcGrowthStage}
                      onChange={(e) => applyStagePreset(e.target.value as GrowthStage)}
                    >
                      {growthStageOptions.map((s) => (
                        <option key={s} value={s}>{growthStageLabel[s]}</option>
                      ))}
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Product Type</label>
                    <Select
                      value={productType}
                      onChange={(e) => setProductType(e.target.value)}
                    >
                      {productTypeOptions.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Current EC (mS/cm)</label>
                    <Input
                      type="number"
                      min={0}
                      step={0.1}
                      placeholder="Optional"
                      value={currentEC}
                      onChange={(e) => setCurrentEC(e.target.value === "" ? "" : Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Target EC (mS/cm)</label>
                    <Input
                      type="number"
                      min={0}
                      step={0.1}
                      placeholder="e.g. 1.8"
                      value={targetEC}
                      onChange={(e) => setTargetEC(e.target.value === "" ? "" : Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Current pH</label>
                    <Input
                      type="number"
                      min={0}
                      max={14}
                      step={0.1}
                      placeholder="Optional"
                      value={currentPH}
                      onChange={(e) => setCurrentPH(e.target.value === "" ? "" : Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Target pH</label>
                    <Input
                      type="number"
                      min={0}
                      max={14}
                      step={0.1}
                      value={targetPH}
                      onChange={(e) => setTargetPH(e.target.value === "" ? "" : Number(e.target.value))}
                    />
                  </div>
                </div>
                <Button onClick={handleCalculate} className="w-full sm:w-auto">
                  <Beaker className="size-4 mr-1" />
                  Calculate Mix
                </Button>
              </div>

              {/* Results */}
              {results ? (
                <Card className="border-0 shadow-sm gradient-emerald">
                  <CardContent className="pt-5 space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="icon-circle size-8 bg-emerald-100 dark:bg-emerald-950/30">
                        <CheckCircle2 className="size-4 text-emerald-600" />
                      </div>
                      <h3 className="font-semibold text-sm">Results</h3>
                    </div>

                    <div className="grid gap-3">
                      <div className="flex items-center justify-between rounded-xl border bg-card/60 px-4 py-2.5">
                        <span className="text-sm font-medium">{results.partALabel}</span>
                        <Badge variant="outline" className="text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/20">
                          {results.partA} mL
                        </Badge>
                      </div>
                      {results.partB > 0 && (
                        <div className="flex items-center justify-between rounded-xl border bg-card/60 px-4 py-2.5">
                          <span className="text-sm font-medium">{results.partBLabel}</span>
                          <Badge variant="outline" className="text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/20">
                            {results.partB} mL
                          </Badge>
                        </div>
                      )}
                      {results.partC !== undefined && results.partC > 0 && results.partCLabel && (
                        <div className="flex items-center justify-between rounded-xl border bg-card/60 px-4 py-2.5">
                          <span className="text-sm font-medium">{results.partCLabel}</span>
                          <Badge variant="outline" className="text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/20">
                            {results.partC} mL
                          </Badge>
                        </div>
                      )}
                      {results.phAdjuster && (
                        <div className="flex items-center justify-between rounded-xl border bg-card/60 px-4 py-2.5">
                          <span className="text-sm font-medium">
                            pH {results.phAdjuster.direction === "down" ? "Down" : "Up"}
                          </span>
                          <Badge variant="outline" className="text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/20">
                            ~{results.phAdjuster.ml} mL
                          </Badge>
                        </div>
                      )}
                      <div className="flex items-center justify-between rounded-xl border bg-card/60 px-4 py-2.5">
                        <span className="text-sm font-medium">Estimated PPM</span>
                        <div className="flex gap-2">
                          <Badge variant="outline" className="text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/20">
                            {results.estimatedPPM500} (500)
                          </Badge>
                          <Badge variant="outline" className="text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/20">
                            {results.estimatedPPM700} (700)
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {results.phAdjuster && (
                      <div className="flex items-start gap-2 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 p-3">
                        <AlertTriangle className="size-4 text-amber-600 mt-0.5 shrink-0" />
                        <p className="text-xs text-amber-800 dark:text-amber-200">
                          pH adjusters are concentrated. Add small amounts, mix thoroughly, and retest before adding more.
                        </p>
                      </div>
                    )}

                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Mixing Instructions</p>
                      <ol className="space-y-2">
                        {[
                          "Fill reservoir with water",
                          `Add ${results.partALabel}, mix thoroughly`,
                          results.partB > 0 ? `Add ${results.partBLabel}, mix thoroughly` : null,
                          results.partC !== undefined && results.partC > 0 && results.partCLabel ? `Add ${results.partCLabel}, mix thoroughly` : null,
                          "Wait 10 minutes, measure EC",
                          results.phAdjuster ? `Adjust pH ${results.phAdjuster.direction === "down" ? "down" : "up"} if needed` : "Adjust pH if needed",
                          "Record readings",
                        ]
                          .filter(Boolean)
                          .map((step, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <CheckCircle2 className="size-4 text-emerald-600 mt-0.5 shrink-0" />
                              <span>{step}</span>
                            </li>
                          ))}
                      </ol>
                    </div>

                    <SupplyHint brand={nutrientBrand} partName={results.partALabel} amountMl={results.partA} />
                    {results.partB > 0 && (
                      <SupplyHint brand={nutrientBrand} partName={results.partBLabel} amountMl={results.partB} />
                    )}
                    {results.partC !== undefined && results.partC > 0 && results.partCLabel && (
                      <SupplyHint brand={nutrientBrand} partName={results.partCLabel} amountMl={results.partC} />
                    )}
                  </CardContent>
                </Card>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-card/40 p-8 text-center">
                  <Beaker className="size-8 text-muted-foreground/40 mb-2" />
                  <p className="text-sm text-muted-foreground">Enter your parameters and click Calculate to see results.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* ===== CONVERSION TOOLS ===== */}
        <div className="grid gap-4 md:grid-cols-3">
          {/* EC ↔ PPM */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <ArrowRightLeft className="size-4 text-blue-600" />
                <CardTitle className="text-sm">EC ↔ PPM</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium">EC (mS/cm)</label>
                <Input
                  type="number"
                  min={0}
                  step={0.1}
                  placeholder="e.g. 1.5"
                  value={ecToPpm}
                  onChange={(e) => setEcToPpm(e.target.value === "" ? "" : Number(e.target.value))}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium">Scale</label>
                <Select value={ppmScale} onChange={(e) => setPpmScale(e.target.value as "500" | "700")}>
                  <option value="500">500 (NaCl)</option>
                  <option value="700">700 (KCl)</option>
                </Select>
              </div>
              {typeof ecToPpm === "number" && ecToPpm > 0 && (
                <div className="rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/30 px-3 py-2">
                  <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                    {Math.round(ecToPpm * Number(ppmScale))} PPM
                  </p>
                  <p className="text-[11px] text-blue-600/80 dark:text-blue-400/80">
                    1 mS/cm ≈ {ppmScale} ppm
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Top-off */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Droplet className="size-4 text-emerald-600" />
                <CardTitle className="text-sm">Top-off Calculator</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium">Current Volume (L)</label>
                <Input
                  type="number"
                  min={0}
                  step={1}
                  value={topOffCurrentVol}
                  onChange={(e) => setTopOffCurrentVol(e.target.value === "" ? "" : Number(e.target.value))}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium">Current EC</label>
                <Input
                  type="number"
                  min={0}
                  step={0.1}
                  value={topOffCurrentEC}
                  onChange={(e) => setTopOffCurrentEC(e.target.value === "" ? "" : Number(e.target.value))}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium">Target EC</label>
                <Input
                  type="number"
                  min={0}
                  step={0.1}
                  value={topOffTargetEC}
                  onChange={(e) => setTopOffTargetEC(e.target.value === "" ? "" : Number(e.target.value))}
                />
              </div>
              {topOffResult && topOffResult.action !== "no_change" && (
                <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/30 px-3 py-2">
                  {topOffResult.action === "add_water" ? (
                    <>
                      <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                        Add {topOffResult.amount} L water
                      </p>
                      <p className="text-[11px] text-emerald-600/80 dark:text-emerald-400/80">
                        Formula: New EC = (Current EC × Current Vol) / (Current Vol + Added Water)
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                        EC needs to rise by {topOffResult.ecDiff}
                      </p>
                      <p className="text-[11px] text-emerald-600/80 dark:text-emerald-400/80">
                        Add nutrient solution and retest.
                      </p>
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Dilution */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <FlaskConical className="size-4 text-purple-600" />
                <CardTitle className="text-sm">Dilution Calculator</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium">Concentrate Bottle (mL)</label>
                <Input
                  type="number"
                  min={0}
                  step={1}
                  placeholder="Optional"
                  value={diluteConcentrateMl}
                  onChange={(e) => setDiluteConcentrateMl(e.target.value === "" ? "" : Number(e.target.value))}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium">Dosing Rate (mL/L)</label>
                <Input
                  type="number"
                  min={0}
                  step={0.1}
                  value={diluteStrength}
                  onChange={(e) => setDiluteStrength(e.target.value === "" ? "" : Number(e.target.value))}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium">Reservoir Volume (L)</label>
                <Input
                  type="number"
                  min={0}
                  step={1}
                  value={diluteVolume}
                  onChange={(e) => setDiluteVolume(e.target.value === "" ? "" : Number(e.target.value))}
                />
              </div>
              {dilutionResult && (
                <div className="rounded-lg bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/30 px-3 py-2 space-y-1">
                  <p className="text-sm font-semibold text-purple-700 dark:text-purple-300">
                    Add {dilutionResult.needed} mL concentrate
                  </p>
                  {dilutionResult.totalTreatable !== null && (
                    <p className="text-[11px] text-purple-600/80 dark:text-purple-400/80">
                      Your bottle can treat ~{dilutionResult.totalTreatable} L total
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
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
                  <CardTitle className="text-base">EC &amp; pH Targets</CardTitle>
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
