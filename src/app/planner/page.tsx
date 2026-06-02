"use client";

import { useState } from "react";
import { Grid3x3, Plus, Leaf, Trash2 } from "lucide-react";
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
      <div className="space-y-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Planner</h2>
            <p className="text-muted-foreground">Manage your growing spaces and layouts.</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="size-4" />
                Add Space
              </Button>
            </DialogTrigger>
            <DialogContent>
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
                    className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    {spaceTypes.map((t) => (
                      <option key={t} value={t}>
                        {spaceTypeLabels[t]}
                      </option>
                    ))}
                  </select>
                </div>
                <Button onClick={handleAdd} disabled={!name.trim()} className="w-full">
                  Create Space
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="h-48 animate-pulse bg-muted" />
            ))}
          </div>
        ) : spaces.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Grid3x3 className="size-10 text-muted-foreground/50" />
              <p className="mt-3 text-sm text-muted-foreground">No growing spaces yet</p>
              <p className="text-xs text-muted-foreground">Add your first bed, container, or hydro system</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {spaces.map((space) => {
              const spacePlants = plants.filter((p) => p.spaceId === space.id);
              return (
                <Card key={space.id}>
                  <CardHeader className="flex flex-row items-start justify-between pb-2">
                    <div>
                      <CardTitle className="text-base">{space.name}</CardTitle>
                      <p className="text-xs text-muted-foreground">{spaceTypeLabels[space.type]}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7 text-muted-foreground hover:text-destructive"
                      onClick={() => space.id && deleteSpace(space.id)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {spacePlants.length === 0 ? (
                      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-6 text-center">
                        <Leaf className="size-6 text-muted-foreground/40" />
                        <p className="mt-1 text-xs text-muted-foreground">No plants yet</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {spacePlants.map((plant) => (
                          <div
                            key={plant.id}
                            className="flex items-center gap-2 rounded-lg border px-3 py-2"
                          >
                            <Leaf className="size-4 text-emerald-500" />
                            <span className="text-sm">{plant.name}</span>
                            <span className="ml-auto text-xs text-muted-foreground capitalize">
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
