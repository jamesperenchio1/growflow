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
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-12">
      <div className="w-full max-w-xl space-y-6">
        <div className="flex items-center justify-center gap-2">
          <Sprout className="size-8 text-emerald-500" />
          <h1 className="text-2xl font-bold">GrowFlow</h1>
        </div>

        <div className="flex justify-center gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={cn(
                "h-2 w-8 rounded-full transition-colors",
                s <= step ? "bg-emerald-500" : "bg-muted"
              )}
            />
          ))}
        </div>

        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>What do you grow?</CardTitle>
              <CardDescription>Select your growing method</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {(["soil", "hydroponics", "both"] as GrowMethod[]).map((method) => (
                <button
                  key={method}
                  onClick={() => setGrowMethod(method)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left transition-colors",
                    growMethod === method
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20"
                      : "border-border hover:bg-accent"
                  )}
                >
                  <div
                    className={cn(
                      "flex size-5 items-center justify-center rounded-full border",
                      growMethod === method
                        ? "border-emerald-500 bg-emerald-500 text-white"
                        : "border-muted-foreground"
                    )}
                  >
                    {growMethod === method && <Check className="size-3" />}
                  </div>
                  <span className="capitalize">{method}</span>
                </button>
              ))}
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Where are you?</CardTitle>
              <CardDescription>We use this for weather and growing guidance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 rounded-lg border border-border bg-background px-4 py-3">
                <MapPin className="size-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="font-medium">{location.name}</p>
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
          <Card>
            <CardHeader>
              <CardTitle>Add your first plant</CardTitle>
              <CardDescription>Select one or more to get started</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {popularPlants.map((plant) => {
                  const Icon = plant.icon;
                  const isSelected = selectedPlants.includes(plant.name);
                  return (
                    <button
                      key={plant.name}
                      onClick={() => togglePlant(plant.name)}
                      className={cn(
                        "flex flex-col items-center gap-2 rounded-lg border p-4 text-center transition-colors",
                        isSelected
                          ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20"
                          : "border-border hover:bg-accent"
                      )}
                    >
                      <Icon className="size-8 text-emerald-500" />
                      <div>
                        <p className="text-sm font-medium">{plant.name}</p>
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
            className="gap-2"
          >
            {step === 3 ? "Get Started" : "Next"}
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
