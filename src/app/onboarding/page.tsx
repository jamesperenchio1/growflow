"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import {
  Leaf,
  Sprout,
  Flower2,
  MapPin,
  ArrowRight,
  Check,
  ChevronLeft,
  Search,
  Plus,
  Minus,
  Home,
  Sun,
  Warehouse,
  Building2,
  Tractor,
  LayoutGrid,
  Box,
  Droplets,
  Waves,
  Wind,
  ArrowUp,
  Layers,
  FlaskConical,
  Bell,
  BellOff,
  Thermometer,
  Ruler,
  PartyPopper,
  CheckCircle2,
  Loader2,
  Crosshair,
  Moon,
  Monitor,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/app-store";
import { useGardenStore, type GardenType } from "@/store/garden-store";
import { usePlants } from "@/hooks/use-plants";
import { useSpaces } from "@/hooks/use-spaces";
import { seedPlants } from "@/data/seed-plants";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { GrowingMethod, SpaceType, PlantReference } from "@/types";

const TOTAL_STEPS = 7;

const STEP_LABELS = [
  "Welcome",
  "Location",
  "Garden",
  "Plants",
  "Space",
  "Preferences",
  "Complete",
];

const GARDEN_TYPES: { type: GardenType; label: string; icon: React.ElementType }[] = [
  { type: "indoor", label: "Indoor", icon: Home },
  { type: "outdoor", label: "Outdoor", icon: Sun },
  { type: "greenhouse", label: "Greenhouse", icon: Warehouse },
  { type: "balcony", label: "Balcony", icon: Building2 },
  { type: "farm", label: "Farm", icon: Tractor },
];

const SPACE_TYPES: { type: SpaceType; label: string; icon: React.ElementType }[] = [
  { type: "raised_bed", label: "Raised Bed", icon: LayoutGrid },
  { type: "container", label: "Container", icon: Box },
  { type: "nft", label: "NFT", icon: Waves },
  { type: "dwc", label: "DWC", icon: Droplets },
  { type: "ebb_flow", label: "Ebb & Flow", icon: Layers },
  { type: "dutch_bucket", label: "Dutch Bucket", icon: Box },
  { type: "vertical_tower", label: "Vertical Tower", icon: ArrowUp },
  { type: "aquaponic", label: "Aquaponic", icon: Droplets },
  { type: "aeroponic", label: "Aeroponic", icon: Wind },
  { type: "wicking", label: "Wicking", icon: FlaskConical },
  { type: "kratky", label: "Kratky", icon: Box },
];

const GROWING_METHODS: { value: GrowingMethod; label: string }[] = [
  { value: "soil", label: "Soil" },
  { value: "hydroponic", label: "Hydroponic" },
  { value: "aeroponic", label: "Aeroponic" },
  { value: "aquaponic", label: "Aquaponic" },
];

const THAI_PROVINCES = [
  "Bangkok",
  "Chiang Mai",
  "Chiang Rai",
  "Chonburi",
  "Phuket",
  "Khon Kaen",
  "Nakhon Ratchasima",
  "Udon Thani",
  "Rayong",
  "Songkhla",
  "Nakhon Si Thammarat",
  "Surat Thani",
  "Ubon Ratchathani",
  "Kanchanaburi",
  "Phetchaburi",
  "Prachuap Khiri Khan",
  "Chanthaburi",
  "Trat",
  "Lampang",
  "Lamphun",
  "Mae Hong Son",
  "Nan",
  "Phrae",
  "Phayao",
  "Tak",
  "Sukhothai",
  "Phitsanulok",
  "Kamphaeng Phet",
  "Nakhon Sawan",
  "Uthai Thani",
  "Phetchabun",
  "Lopburi",
  "Saraburi",
  "Phra Nakhon Si Ayutthaya",
  "Ang Thong",
  "Sing Buri",
  "Chainat",
  "Suphan Buri",
  "Nakhon Pathom",
  "Samut Sakhon",
  "Samut Songkhram",
  "Ratchaburi",
  "Prachinburi",
  "Sa Kaeo",
  "Nakhon Nayok",
  "Pathum Thani",
  "Nonthaburi",
  "Samut Prakan",
  "Buriram",
  "Surin",
  "Si Sa Ket",
  "Yasothon",
  "Amnat Charoen",
  "Mukdahan",
  "Nakhon Phanom",
  "Sakon Nakhon",
  "Kalasin",
  "Roi Et",
  "Mahasarakham",
  "Chaiyaphum",
  "Loei",
  "Nong Khai",
  "Bueng Kan",
  "Nong Bua Lamphu",
  "Udon Thani",
  "Chumphon",
  "Ranong",
  "Phang Nga",
  "Krabi",
  "Trang",
  "Satun",
  "Pattani",
  "Yala",
  "Narathiwat",
  "Phatthalung",
  "Songkhla",
  "Nakhon Si Thammarat",
];

const POPULAR_BEGINNERS = ["Lettuce", "Basil", "Tomato"];

function getDifficulty(plant: PlantReference): "Beginner" | "Intermediate" | "Advanced" {
  if (plant.daysToHarvest <= 35) return "Beginner";
  if (plant.daysToHarvest <= 70) return "Intermediate";
  return "Advanced";
}

function getPlantIcon(category: string) {
  switch (category) {
    case "herb":
      return Leaf;
    case "fruit":
      return Sun;
    case "flower":
      return Flower2;
    default:
      return Sprout;
  }
}

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

async function reverseGeocode(lat: number, lon: number): Promise<string> {
  try {
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
    );
    const data = await res.json();
    return data.city || data.locality || data.principalSubdivision || "My Location";
  } catch {
    return "My Location";
  }
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
};

interface SelectedPlantConfig {
  name: string;
  plantedDate: string;
  growingMethod: GrowingMethod;
  quantity: number;
}

export default function OnboardingPage() {
  const router = useRouter();
  const { setTheme, theme } = useTheme();

  // Stores
  const {
    location,
    setLocation,
    setOnboardingComplete,
    setUnits: setAppUnits,
    setNotificationsEnabled,
    setTempUnit: setAppTempUnit,
  } = useAppStore();

  const { addGarden, setActiveGarden } = useGardenStore();
  const { addPlant } = usePlants();
  const { addSpace } = useSpaces();

  // Wizard state
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);

  const [city, setCity] = useState(location.name);
  const [gardenType, setGardenType] = useState<GardenType | null>(null);
  const [thaiProvince, setThaiProvince] = useState("");

  const [gardenName, setGardenName] = useState("My Garden");
  const [gardenDescription, setGardenDescription] = useState("");

  const [selectedPlants, setSelectedPlants] = useState<SelectedPlantConfig[]>([]);
  const [plantSearch, setPlantSearch] = useState("");

  const [spaceType, setSpaceType] = useState<SpaceType | null>(null);
  const [spaceName, setSpaceName] = useState("");

  const [notifications, setNotifications] = useState(true);
  const [units, setUnits] = useState<"metric" | "imperial">("metric");
  const [tempUnit, setTempUnit] = useState<"celsius" | "fahrenheit">("celsius");
  const [themeMode, setThemeMode] = useState<"system" | "light" | "dark">("system");

  const [isLocating, setIsLocating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Keep theme in sync
  useEffect(() => {
    if (theme && theme !== themeMode) {
      setThemeMode(theme as "system" | "light" | "dark");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goNext = useCallback(() => {
    if (step < TOTAL_STEPS) {
      setDirection(1);
      setStep((s) => s + 1);
    }
  }, [step]);

  const goBack = useCallback(() => {
    if (step > 1) {
      setDirection(-1);
      setStep((s) => s - 1);
    }
  }, [step]);

  const handleGeolocation = useCallback(async () => {
    if (!navigator.geolocation) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const cityName = await reverseGeocode(latitude, longitude);
        setCity(cityName);
        setLocation({ lat: latitude, lon: longitude, name: cityName });
        setIsLocating(false);
      },
      () => {
        setIsLocating(false);
      }
    );
  }, [setLocation]);

  const togglePlant = useCallback((name: string) => {
    setSelectedPlants((prev) => {
      const exists = prev.find((p) => p.name === name);
      if (exists) {
        return prev.filter((p) => p.name !== name);
      }
      if (prev.length >= 3) return prev;
      const seed = seedPlants.find((p) => p.name === name);
      return [
        ...prev,
        {
          name,
          plantedDate: todayStr(),
          growingMethod: seed?.methods[0] ?? "soil",
          quantity: 1,
        },
      ];
    });
  }, []);

  const updatePlantConfig = useCallback(
    (name: string, patch: Partial<SelectedPlantConfig>) => {
      setSelectedPlants((prev) =>
        prev.map((p) => (p.name === name ? { ...p, ...patch } : p))
      );
    },
    []
  );

  const filteredPlants = useMemo(() => {
    const q = plantSearch.trim().toLowerCase();
    if (!q) return seedPlants;
    return seedPlants.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }, [plantSearch]);

  const popularPlants = useMemo(() => {
    return seedPlants.filter((p) => POPULAR_BEGINNERS.includes(p.name));
  }, []);

  const handleFinish = useCallback(async () => {
    setIsSaving(true);
    setSaveError(null);
    try {
      // 1. Save location
      setLocation({
        lat: location.lat,
        lon: location.lon,
        name: city || location.name,
      });

      // 2. Create garden
      const gardenPayload = {
        name: gardenName || "My Garden",
        location: city || location.name,
        description: gardenDescription || undefined,
        type: gardenType || "outdoor",
      };
      addGarden(gardenPayload);
      const gardenId = useGardenStore.getState().activeGardenId;
      if (gardenId) setActiveGarden(gardenId);

      // 3. Create space
      let spaceId: number | undefined;
      if (spaceType && spaceName) {
        spaceId = await addSpace({
          name: spaceName,
          type: spaceType,
          location: gardenPayload.location,
          notes: undefined,
        });
      }

      // 4. Create plants
      for (const cfg of selectedPlants) {
        const seed = seedPlants.find((p) => p.name === cfg.name);
        if (!seed) continue;
        await addPlant({
          name: seed.name,
          category: seed.category,
          growingMethod: cfg.growingMethod,
          spaceId: spaceId ? Number(spaceId) : undefined,
          plantedDate: new Date(cfg.plantedDate || todayStr()),
          healthTags: [],
          tags: [],
          quantity: cfg.quantity,
        });
      }

      // 5. Save preferences
      setAppUnits(units);
      setNotificationsEnabled(notifications);
      setAppTempUnit(tempUnit);
      setTheme(themeMode);

      // 6. Complete
      setOnboardingComplete(true);
      goNext();
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSaving(false);
    }
  }, [
    city,
    location,
    gardenName,
    gardenDescription,
    gardenType,
    spaceType,
    spaceName,
    selectedPlants,
    units,
    notifications,
    tempUnit,
    themeMode,
    setLocation,
    addGarden,
    setActiveGarden,
    addSpace,
    addPlant,
    setAppUnits,
    setNotificationsEnabled,
    setAppTempUnit,
    setTheme,
    setOnboardingComplete,
    goNext,
  ]);

  const progressPercent = ((step - 1) / (TOTAL_STEPS - 1)) * 100;

  const canProceed = useMemo(() => {
    switch (step) {
      case 1:
        return true;
      case 2:
        return !!city;
      case 3:
        return !!gardenName;
      case 4:
        return selectedPlants.length > 0;
      case 5:
        return !!spaceType && !!spaceName;
      case 6:
        return true;
      default:
        return true;
    }
  }, [step, city, gardenName, selectedPlants, spaceType, spaceName]);

  // ─── Step Components ───

  function StepWelcome() {
    return (
      <div className="flex flex-col items-center text-center space-y-8 py-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="relative"
        >
          <div className="size-32 rounded-full bg-emerald-100 dark:bg-emerald-950/40 flex items-center justify-center">
            <Sprout className="size-16 text-emerald-600 dark:text-emerald-400" />
          </div>
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute -top-2 -right-2 size-10 rounded-full bg-emerald-500 text-white flex items-center justify-center"
          >
            <Leaf className="size-5" />
          </motion.div>
        </motion.div>

        <div className="space-y-3">
          <h2 className="text-3xl font-bold tracking-tight">
            Welcome to GrowFlow
          </h2>
          <p className="text-muted-foreground max-w-sm mx-auto">
            Let&apos;s set up your garden in just a few steps
          </p>
        </div>

        <Button
          onClick={goNext}
          className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-base px-8 py-5 h-auto"
        >
          Get Started
          <ArrowRight className="size-5" />
        </Button>
      </div>
    );
  }

  function StepLocation() {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold">Where are you growing?</h2>
          <p className="text-sm text-muted-foreground">
            We use this for weather and growing guidance
          </p>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium">City</label>
          <div className="flex gap-2">
            <Input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter your city"
              className="flex-1"
            />
            <Button
              variant="outline"
              onClick={handleGeolocation}
              disabled={isLocating}
              className="gap-2 shrink-0"
            >
              {isLocating ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Crosshair className="size-4" />
              )}
              Use my location
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium">Growing environment</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {GARDEN_TYPES.map(({ type, label, icon: Icon }) => {
              const selected = gardenType === type;
              return (
                <button
                  key={type}
                  onClick={() => setGardenType(type)}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-center transition-all",
                    selected
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950"
                      : "border-border hover:border-muted-foreground hover:bg-accent"
                  )}
                >
                  <div
                    className={cn(
                      "size-10 rounded-full flex items-center justify-center transition-colors",
                      selected
                        ? "bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    <Icon className="size-5" />
                  </div>
                  <span className="text-sm font-medium">{label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium">Thai province (optional)</label>
          <div className="relative">
            <select
              value={thaiProvince}
              onChange={(e) => setThaiProvince(e.target.value)}
              className="flex h-9 w-full appearance-none rounded-lg border border-input bg-transparent px-3 py-1 pr-8 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Select province</option>
              {THAI_PROVINCES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <ChevronLeft className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground rotate-[-90deg]" />
          </div>
        </div>
      </div>
    );
  }

  function StepGarden() {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold">Name your first garden</h2>
          <p className="text-sm text-muted-foreground">
            You can add more gardens later
          </p>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium">Garden name</label>
          <Input
            value={gardenName}
            onChange={(e) => setGardenName(e.target.value)}
            placeholder="My Garden"
          />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium">Garden type</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {GARDEN_TYPES.map(({ type, label, icon: Icon }) => {
              const selected = gardenType === type;
              return (
                <button
                  key={type}
                  onClick={() => setGardenType(type)}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-center transition-all",
                    selected
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950"
                      : "border-border hover:border-muted-foreground hover:bg-accent"
                  )}
                >
                  <div
                    className={cn(
                      "size-10 rounded-full flex items-center justify-center transition-colors",
                      selected
                        ? "bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    <Icon className="size-5" />
                  </div>
                  <span className="text-sm font-medium">{label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium">Description (optional)</label>
          <Input
            value={gardenDescription}
            onChange={(e) => setGardenDescription(e.target.value)}
            placeholder="A cozy balcony garden..."
          />
        </div>
      </div>
    );
  }

  function StepPlants() {
    return (
      <div className="space-y-5">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold">Add your first plants</h2>
          <p className="text-sm text-muted-foreground">
            Select 1–3 plants to get started
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            value={plantSearch}
            onChange={(e) => setPlantSearch(e.target.value)}
            placeholder="Search plants..."
            className="pl-9"
          />
        </div>

        {/* Popular */}
        {!plantSearch && (
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Popular for beginners
            </p>
            <div className="grid grid-cols-3 gap-3">
              {popularPlants.map((plant) => {
                const isSelected = selectedPlants.some((p) => p.name === plant.name);
                const Icon = getPlantIcon(plant.category);
                return (
                  <button
                    key={plant.name}
                    onClick={() => togglePlant(plant.name)}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-xl border-2 p-3 text-center transition-all",
                      isSelected
                        ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950"
                        : "border-border hover:border-muted-foreground hover:bg-accent"
                    )}
                  >
                    <div
                      className={cn(
                        "size-8 rounded-full flex items-center justify-center",
                        isSelected
                          ? "bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      <Icon className="size-4" />
                    </div>
                    <span className="text-xs font-semibold">{plant.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Plant list */}
        <ScrollArea className="h-[280px] rounded-xl border">
          <div className="p-3 grid grid-cols-1 gap-2">
            {filteredPlants.map((plant) => {
              const isSelected = selectedPlants.some((p) => p.name === plant.name);
              const cfg = selectedPlants.find((p) => p.name === plant.name);
              const Icon = getPlantIcon(plant.category);
              const diff = getDifficulty(plant);
              const diffColor =
                diff === "Beginner"
                  ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-950"
                  : diff === "Intermediate"
                  ? "text-amber-600 bg-amber-50 dark:bg-amber-950"
                  : "text-rose-600 bg-rose-50 dark:bg-rose-950";

              return (
                <div key={plant.name} className="space-y-2">
                  <button
                    onClick={() => togglePlant(plant.name)}
                    disabled={!isSelected && selectedPlants.length >= 3}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition-all",
                      isSelected
                        ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950"
                        : selectedPlants.length >= 3
                        ? "border-border opacity-50 cursor-not-allowed"
                        : "border-border hover:border-muted-foreground hover:bg-accent"
                    )}
                  >
                    <div
                      className={cn(
                        "size-9 rounded-full flex items-center justify-center shrink-0",
                        isSelected
                          ? "bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      <Icon className="size-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold">{plant.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {plant.category}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide shrink-0",
                        diffColor
                      )}
                    >
                      {diff}
                    </span>
                    {isSelected && (
                      <div className="size-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                        <Check className="size-3" />
                      </div>
                    )}
                  </button>

                  {cfg && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      className="overflow-hidden"
                    >
                      <Card className="border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-950">
                        <CardContent className="p-3 space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                                Planted date
                              </label>
                              <Input
                                type="date"
                                value={cfg.plantedDate}
                                onChange={(e) =>
                                  updatePlantConfig(plant.name, {
                                    plantedDate: e.target.value,
                                  })
                                }
                                className="h-8 text-xs"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                                Method
                              </label>
                              <select
                                value={cfg.growingMethod}
                                onChange={(e) =>
                                  updatePlantConfig(plant.name, {
                                    growingMethod: e.target.value as GrowingMethod,
                                  })
                                }
                                className="flex h-8 w-full appearance-none rounded-lg border border-input bg-transparent px-2 py-1 text-xs shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                              >
                                {GROWING_METHODS.map((m) => (
                                  <option key={m.value} value={m.value}>
                                    {m.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                              Quantity
                            </label>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() =>
                                  updatePlantConfig(plant.name, {
                                    quantity: Math.max(1, cfg.quantity - 1),
                                  })
                                }
                                className="size-7 rounded-lg border flex items-center justify-center hover:bg-accent"
                              >
                                <Minus className="size-3" />
                              </button>
                              <span className="text-sm font-semibold w-6 text-center">
                                {cfg.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updatePlantConfig(plant.name, {
                                    quantity: cfg.quantity + 1,
                                  })
                                }
                                className="size-7 rounded-lg border flex items-center justify-center hover:bg-accent"
                              >
                                <Plus className="size-3" />
                              </button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>

        <p className="text-xs text-muted-foreground text-center">
          {selectedPlants.length}/3 plants selected
        </p>
      </div>
    );
  }

  function StepSpace() {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold">Where will you grow these plants?</h2>
          <p className="text-sm text-muted-foreground">
            Set up your first growing space
          </p>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium">Space type</label>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {SPACE_TYPES.map(({ type, label, icon: Icon }) => {
              const selected = spaceType === type;
              return (
                <button
                  key={type}
                  onClick={() => setSpaceType(type)}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-xl border-2 p-3 text-center transition-all",
                    selected
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950"
                      : "border-border hover:border-muted-foreground hover:bg-accent"
                  )}
                >
                  <div
                    className={cn(
                      "size-9 rounded-full flex items-center justify-center transition-colors",
                      selected
                        ? "bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    <Icon className="size-4" />
                  </div>
                  <span className="text-[11px] font-medium leading-tight">{label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium">Space name</label>
          <Input
            value={spaceName}
            onChange={(e) => setSpaceName(e.target.value)}
            placeholder="e.g. Main Bed, Hydro Tent..."
          />
        </div>
      </div>
    );
  }

  function StepPreferences() {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold">Preferences</h2>
          <p className="text-sm text-muted-foreground">
            Customize your experience
          </p>
        </div>

        {/* Notifications */}
        <div className="flex items-center justify-between rounded-xl border p-4">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-full bg-blue-100 dark:bg-blue-950/30 text-blue-600 flex items-center justify-center">
              {notifications ? <Bell className="size-4" /> : <BellOff className="size-4" />}
            </div>
            <div>
              <p className="text-sm font-medium">Notifications</p>
              <p className="text-xs text-muted-foreground">Task and weather alerts</p>
            </div>
          </div>
          <button
            onClick={() => setNotifications((v) => !v)}
            className={cn(
              "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
              notifications ? "bg-emerald-500" : "bg-muted"
            )}
          >
            <span
              className={cn(
                "inline-block size-4 rounded-full bg-white transition-transform",
                notifications ? "translate-x-6" : "translate-x-1"
              )}
            />
          </button>
        </div>

        {/* Units */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Units</label>
          <div className="grid grid-cols-2 gap-3">
            {(["metric", "imperial"] as const).map((u) => (
              <button
                key={u}
                onClick={() => setUnits(u)}
                className={cn(
                  "flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition-all",
                  units === u
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950"
                    : "border-border hover:border-muted-foreground hover:bg-accent"
                )}
              >
                <Ruler className="size-4 text-muted-foreground" />
                <span className="text-sm font-medium capitalize">{u}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Temperature */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Temperature unit</label>
          <div className="grid grid-cols-2 gap-3">
            {(["celsius", "fahrenheit"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTempUnit(t)}
                className={cn(
                  "flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition-all",
                  tempUnit === t
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950"
                    : "border-border hover:border-muted-foreground hover:bg-accent"
                )}
              >
                <Thermometer className="size-4 text-muted-foreground" />
                <span className="text-sm font-medium capitalize">{t === "celsius" ? "Celsius °C" : "Fahrenheit °F"}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Theme */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Appearance</label>
          <div className="grid grid-cols-3 gap-3">
            {([
              { value: "light", label: "Light", icon: Sun },
              { value: "dark", label: "Dark", icon: Moon },
              { value: "system", label: "System", icon: Monitor },
            ] as const).map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => setThemeMode(value)}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-xl border-2 p-3 text-center transition-all",
                  themeMode === value
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950"
                    : "border-border hover:border-muted-foreground hover:bg-accent"
                )}
              >
                <Icon className="size-5 text-muted-foreground" />
                <span className="text-xs font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {saveError && (
          <p className="text-sm text-red-500 text-center">{saveError}</p>
        )}
      </div>
    );
  }

  function StepComplete() {
    return (
      <div className="flex flex-col items-center text-center space-y-8 py-6">
        <div className="relative">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 12 }}
            className="size-24 rounded-full bg-emerald-100 dark:bg-emerald-950/40 flex items-center justify-center"
          >
            <CheckCircle2 className="size-12 text-emerald-600 dark:text-emerald-400" />
          </motion.div>
          {/* Confetti dots */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 0, x: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0],
                y: [-10, -40 - Math.random() * 40],
                x: [(i - 4) * 10, (i - 4) * 25],
                scale: [0, 1.2, 0],
              }}
              transition={{
                duration: 1.2,
                delay: 0.3 + i * 0.05,
                ease: "easeOut",
              }}
              className={cn(
                "absolute top-1/2 left-1/2 size-2 rounded-full",
                i % 3 === 0
                  ? "bg-emerald-400"
                  : i % 3 === 1
                  ? "bg-amber-400"
                  : "bg-blue-400"
              )}
            />
          ))}
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold">You&apos;re all set!</h2>
          <p className="text-muted-foreground max-w-xs mx-auto">
            Your garden is ready. Here&apos;s what we set up for you:
          </p>
        </div>

        <div className="w-full max-w-xs space-y-2 text-left">
          <div className="flex items-center gap-3 rounded-lg bg-muted px-4 py-2.5">
            <MapPin className="size-4 text-emerald-500" />
            <span className="text-sm">{city || location.name}</span>
          </div>
          <div className="flex items-center gap-3 rounded-lg bg-muted px-4 py-2.5">
            <Sprout className="size-4 text-emerald-500" />
            <span className="text-sm">{gardenName}</span>
          </div>
          <div className="flex items-center gap-3 rounded-lg bg-muted px-4 py-2.5">
            <Leaf className="size-4 text-emerald-500" />
            <span className="text-sm">
              {selectedPlants.length} plant{selectedPlants.length !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex items-center gap-3 rounded-lg bg-muted px-4 py-2.5">
            <LayoutGrid className="size-4 text-emerald-500" />
            <span className="text-sm">{spaceName}</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 w-full max-w-xs">
          <Button
            onClick={() => router.push("/")}
            className="gap-2 bg-emerald-600 hover:bg-emerald-700 w-full"
          >
            <PartyPopper className="size-4" />
            Go to Dashboard
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/plants/new")}
            className="gap-2 w-full"
          >
            <Plus className="size-4" />
            Add More Plants
          </Button>
        </div>
      </div>
    );
  }

  function renderStep() {
    switch (step) {
      case 1:
        return <StepWelcome />;
      case 2:
        return <StepLocation />;
      case 3:
        return <StepGarden />;
      case 4:
        return <StepPlants />;
      case 5:
        return <StepSpace />;
      case 6:
        return <StepPreferences />;
      case 7:
        return <StepComplete />;
      default:
        return null;
    }
  }

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex min-h-screen flex-col bg-gradient-to-br from-stone-50 to-stone-100 dark:from-stone-950 dark:to-stone-900">
        {/* Top progress */}
        <div className="w-full px-4 pt-4 pb-2">
          <div className="max-w-lg mx-auto space-y-3">
            <Progress value={progressPercent} className="h-1.5" />
            <div className="flex justify-center gap-2">
              {STEP_LABELS.map((label, idx) => {
                const s = idx + 1;
                const active = s === step;
                const completed = s < step;
                return (
                  <Tooltip key={s}>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => {
                          if (s < step) {
                            setDirection(-1);
                            setStep(s);
                          }
                        }}
                        className={cn(
                          "size-2.5 rounded-full transition-all",
                          active
                            ? "bg-emerald-500 scale-125"
                            : completed
                            ? "bg-emerald-400"
                            : "bg-muted"
                        )}
                      />
                    </TooltipTrigger>
                    <TooltipContent side="top" className="text-xs">
                      {label}
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex items-start justify-center px-4 py-6 overflow-y-auto">
          <div className="w-full max-w-lg">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25, ease: "easeInOut" }}
              >
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6">{renderStep()}</CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            {step < 7 && (
              <div className="flex items-center justify-between mt-6">
                <Button
                  variant="ghost"
                  onClick={goBack}
                  disabled={step === 1}
                  className="gap-2"
                >
                  <ChevronLeft className="size-4" />
                  Back
                </Button>

                {step === 6 ? (
                  <Button
                    onClick={handleFinish}
                    disabled={isSaving || !canProceed}
                    className="gap-2 bg-emerald-600 hover:bg-emerald-700"
                  >
                    {isSaving ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Check className="size-4" />
                    )}
                    Finish Setup
                  </Button>
                ) : (
                  <Button
                    onClick={goNext}
                    disabled={!canProceed}
                    className="gap-2 bg-emerald-600 hover:bg-emerald-700"
                  >
                    Next
                    <ArrowRight className="size-4" />
                  </Button>
                )}
              </div>
            )}

            {/* Skip optional */}
            {step === 2 && (
              <div className="text-center mt-4">
                <button
                  onClick={() => {
                    setCity(location.name);
                    goNext();
                  }}
                  className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2"
                >
                  Skip location setup
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
