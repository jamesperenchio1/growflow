"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Grid3x3, Plus, Leaf, Trash2, Droplets } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useSpaces } from "@/hooks/use-spaces";
import { usePlants } from "@/hooks/use-plants";
import { cn } from "@/lib/utils";
import type { SpaceType } from "@/types";

const spaceTypeLabels: Record<SpaceType, string> = {
  raised_bed: "Raised Bed",
  container: "Container",
  nft: "NFT Channel",
  dwc: "DWC Tank",
  ebb_flow: "Ebb & Flow",
  dutch_bucket: "Dutch Bucket",
  vertical_tower: "Vertical Tower",
  aquaponic: "Aquaponic",
  aeroponic: "Aeroponic",
  wicking: "Wicking",
  kratky: "Kratky",
};

const spaceTypeIcons: Record<SpaceType, string> = {
  raised_bed: "🌱",
  container: "🪴",
  nft: "💧",
  dwc: "🏊",
  ebb_flow: "🌊",
  dutch_bucket: "🪣",
  vertical_tower: "🏗️",
  aquaponic: "🐟",
  aeroponic: "💨",
  wicking: "🕯️",
  kratky: "📦",
};

const spaceTypes: SpaceType[] = [
  "raised_bed",
  "container",
  "nft",
  "dwc",
  "ebb_flow",
  "dutch_bucket",
  "vertical_tower",
  "aquaponic",
  "aeroponic",
  "wicking",
  "kratky",
];

export default function PlannerPage() {
  const router = useRouter();
  const { spaces, loading, addSpace, deleteSpace } = useSpaces();
  const { plants } = usePlants();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState<SpaceType>("raised_bed");

  const handleAdd = async () => {
    if (!name.trim()) return;
    await addSpace({ name: name.trim(), type });
    setName("");
    setType("raised_bed");
    setOpen(false);
  };

  return (
    <PageShell>
      <div className="space-y-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Planner</h2>
            <p className="text-sm text-muted-foreground mt-1">Manage your growing spaces and layouts.</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700">
                <Plus className="size-4" />
                Add Space
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>New Growing Space</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">Name</label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Bed A" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="type" className="text-sm font-medium">Type</label>
                  <select
                    id="type"
                    value={type}
                    onChange={(e) => setType(e.target.value as SpaceType)}
                    className="flex h-10 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    {spaceTypes.map((t) => (
                      <option key={t} value={t}>
                        {spaceTypeIcons[t]} {spaceTypeLabels[t]}
                      </option>
                    ))}
                  </select>
                </div>
                <Button onClick={handleAdd} disabled={!name.trim()} className="w-full bg-emerald-600 hover:bg-emerald-700">
                  Create Space
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="h-52 animate-pulse bg-muted border-0" />
            ))}
          </div>
        ) : spaces.length === 0 ? (
          <Card className="shadow-sm">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="icon-circle size-16 bg-emerald-100 dark:bg-emerald-950/30 mb-4">
                <Grid3x3 className="size-8 text-emerald-500" />
              </div>
              <p className="text-base font-medium text-muted-foreground">No growing spaces yet</p>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                Add your first bed, container, or hydro system to start planning your garden layout
              </p>
              <Button className="mt-4 gap-2 bg-emerald-600 hover:bg-emerald-700" onClick={() => setOpen(true)}>
                <Plus className="size-4" />
                Add Your First Space
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {spaces.map((space) => {
              const spacePlants = plants.filter((p) => p.spaceId === space.id);
              return (
                <Card key={space.id} className="card-hover shadow-sm">
                  <CardHeader className="flex flex-row items-start justify-between pb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{spaceTypeIcons[space.type]}</span>
                      <div>
                        <CardTitle className="text-base">{space.name}</CardTitle>
                        <p className="text-xs text-muted-foreground">{spaceTypeLabels[space.type]}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-muted-foreground/50 hover:text-destructive"
                      onClick={() => space.id && deleteSpace(space.id)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {spacePlants.length === 0 ? (
                      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-8 text-center">
                        <Leaf className="size-6 text-muted-foreground/30 mb-2" />
                        <p className="text-xs text-muted-foreground">No plants yet</p>
                        <Button variant="ghost" size="sm" className="mt-2 text-xs h-7 text-emerald-600" onClick={() => router.push("/plants/new")}>
                          Add Plant
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {spacePlants.map((plant) => (
                          <div
                            key={plant.id}
                            className="flex items-center gap-2.5 rounded-xl border px-3 py-2.5 transition-colors hover:bg-accent/40 cursor-pointer"
                            onClick={() => router.push(`/plants/detail?id=${plant.id}`)}
                          >
                            <div className="icon-circle size-8 bg-emerald-50 dark:bg-emerald-950/30">
                              <Leaf className="size-4 text-emerald-500" />
                            </div>
                            <span className="text-sm font-medium">{plant.name}</span>
                            <span className="ml-auto text-[11px] text-muted-foreground capitalize bg-muted/60 px-2 py-0.5 rounded-full">
                              {plant.category}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </PageShell>
  );
}
