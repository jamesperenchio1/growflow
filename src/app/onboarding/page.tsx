"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Leaf, Sprout, Flower2, Cherry, Apple, Carrot, MapPin, ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/app-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type GrowMethod = "soil" | "hydroponics" | "both";

const popularPlants = [
  { name: "Basil", icon: Leaf, category: "Herb" },
  { name: "Tomato", icon: Cherry, category: "Vegetable" },
  { name: "Lettuce", icon: Leaf, category: "Vegetable" },
  { name: "Pepper", icon: Apple, category: "Vegetable" },
  { name: "Strawberry", icon: Flower2, category: "Fruit" },
  { name: "Carrot", icon: Carrot, category: "Vegetable" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { location, setOnboardingComplete } = useAppStore();
  const [step, setStep] = useState(1);
  const [growMethod, setGrowMethod] = useState<GrowMethod | null>(null);
  const [selectedPlants, setSelectedPlants] = useState<string[]>([]);

  const goNext = () => {
    if (step < 3) setStep(step + 1);
    else {
      setOnboardingComplete(true);
      router.push("/");
    }
  };

  const togglePlant = (name: string) => {
    setSelectedPlants((prev) =>
      prev.includes(name) ? prev.filter((p) => p !== name) : [...prev, name]
    );
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-stone-50 to-stone-100 dark:from-stone-950 dark:to-stone-900 px-4 py-12">
      <div className="w-full max-w-lg space-y-6">
        <div className="flex items-center justify-center gap-2.5">
          <div className="icon-circle size-10 bg-emerald-500 text-white">
            <Sprout className="size-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">GrowFlow</h1>
        </div>

        <div className="flex justify-center gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                s <= step ? "w-8 bg-emerald-500" : "w-8 bg-muted"
              )}
            />
          ))}
        </div>

        {step === 1 && (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">What do you grow?</CardTitle>
              <CardDescription>Select your growing method</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {(["soil", "hydroponics", "both"] as GrowMethod[]).map((method) => (
                <button
                  key={method}
                  onClick={() => setGrowMethod(method)}
                  className={cn(
                    "flex w-full items-center gap-4 rounded-xl border-2 px-5 py-4 text-left transition-all",
                    growMethod === method
                      ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20"
                      : "border-border hover:border-muted-foreground/30 hover:bg-accent/50"
                  )}
                >
                  <div
                    className={cn(
                      "flex size-6 items-center justify-center rounded-full border-2 transition-colors",
                      growMethod === method
                        ? "border-emerald-500 bg-emerald-500 text-white"
                        : "border-muted-foreground/30"
                    )}
                  >
                    {growMethod === method && <Check className="size-3.5" />}
                  </div>
                  <span className="text-base font-medium capitalize">{method}</span>
                </button>
              ))}
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Where are you?</CardTitle>
              <CardDescription>We use this for weather and growing guidance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 rounded-xl border border-border bg-muted/30 px-5 py-4">
                <div className="icon-circle size-10 bg-emerald-100 dark:bg-emerald-950/30">
                  <MapPin className="size-5 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{location.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {location.lat.toFixed(4)}, {location.lon.toFixed(4)}
                  </p>
                </div>
                <Badge variant="outline">Default</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                You can change your location later in Settings.
              </p>
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Add your first plant</CardTitle>
              <CardDescription>Select one or more to get started</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {popularPlants.map((plant) => {
                  const Icon = plant.icon;
                  const isSelected = selectedPlants.includes(plant.name);
                  return (
                    <button
                      key={plant.name}
                      onClick={() => togglePlant(plant.name)}
                      className={cn(
                        "flex flex-col items-center gap-2.5 rounded-xl border-2 p-5 text-center transition-all",
                        isSelected
                          ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20"
                          : "border-border hover:border-muted-foreground/30 hover:bg-accent/50"
                      )}
                    >
                      <div className={cn(
                        "icon-circle size-12 transition-colors",
                        isSelected ? "bg-emerald-100 dark:bg-emerald-950/30" : "bg-muted"
                      )}>
                        <Icon className={cn("size-6", isSelected ? "text-emerald-600" : "text-muted-foreground")} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{plant.name}</p>
                        <p className="text-xs text-muted-foreground">{plant.category}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-end">
          <Button
            onClick={goNext}
            disabled={step === 1 && !growMethod}
            className="gap-2 bg-emerald-600 hover:bg-emerald-700"
          >
            {step === 3 ? "Get Started" : "Next"}
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
