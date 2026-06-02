"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Grid3x3,
  Plus,
  Leaf,
  Trash2,
  Droplets,
  LayoutGrid,
  X,
  GripVertical,
  Flower2,
  ArrowUpDown,
} from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useSpaces } from "@/hooks/use-spaces";
import { usePlants } from "@/hooks/use-plants";
import { useSpacePlants } from "@/hooks/use-space-plants";
import { useGardenStore } from "@/store/garden-store";
import { useOrderStore } from "@/store/order-store";
import { cn } from "@/lib/utils";
import type { SpaceType, Plant, SpacePlant } from "@/types";

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

function getGridSize(type: SpaceType): { cols: number; rows: number } {
  if (type === "raised_bed") return { cols: 6, rows: 4 };
  if (type === "container") return { cols: 2, rows: 2 };
  return { cols: 4, rows: 2 };
}

function SpaceLayoutDialog({
  spaceId,
  spaceName,
  spaceType,
  open,
  onOpenChange,
  allPlants,
}: {
  spaceId: number;
  spaceName: string;
  spaceType: SpaceType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  allPlants: Plant[];
}) {
  const { spacePlants, loading, addPlantToSpace, removePlantFromSpace, movePlantInSpace } =
    useSpacePlants(spaceId);
  const [draggingPlantId, setDraggingPlantId] = useState<number | null>(null);
  const [removingId, setRemovingId] = useState<number | null>(null);

  const { cols, rows } = getGridSize(spaceType);

  const gridCells = useMemo(() => {
    const cells: {
      x: number;
      y: number;
      spacePlant?: SpacePlant;
      plant?: Plant;
    }[] = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const sp = spacePlants.find((p) => p.x === x && p.y === y);
        const plant = sp ? allPlants.find((p) => p.id === sp.plantId) : undefined;
        cells.push({ x, y, spacePlant: sp, plant });
      }
    }
    return cells;
  }, [spacePlants, allPlants, cols, rows]);

  const handleDragStart = useCallback(
    (e: React.DragEvent, plantId: number, fromSpacePlantId?: number) => {
      setDraggingPlantId(plantId);
      e.dataTransfer.setData(
        "application/growflow",
        JSON.stringify({ plantId, fromSpacePlantId })
      );
      e.dataTransfer.effectAllowed = "move";
    },
    []
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent, x: number, y: number) => {
      e.preventDefault();
      const data = e.dataTransfer.getData("application/growflow");
      if (!data) return;
      try {
        const { plantId, fromSpacePlantId } = JSON.parse(data);
        const existing = spacePlants.find((p) => p.x === x && p.y === y);
        if (existing) return; // cell occupied
        if (fromSpacePlantId) {
          await movePlantInSpace(fromSpacePlantId, x, y);
        } else {
          await addPlantToSpace(spaceId, plantId, x, y);
        }
      } catch {
        // ignore
      } finally {
        setDraggingPlantId(null);
      }
    },
    [spacePlants, addPlantToSpace, movePlantInSpace, spaceId]
  );

  const availablePlants = allPlants.filter(
    (p) => !spacePlants.some((sp) => sp.plantId === p.id)
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="flex items-center gap-2">
            <LayoutGrid className="size-5 text-emerald-600" />
            {spaceName} — Layout
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-56 border-r border-border flex flex-col bg-muted/30">
            <div className="px-4 py-3 text-sm font-medium text-muted-foreground border-b border-border">
              Available Plants
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {availablePlants.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">
                  No unused plants
                </p>
              ) : (
                availablePlants.map((plant) => (
                  <div
                    key={plant.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, plant.id!)}
                    className={cn(
                      "flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 shadow-sm cursor-grab active:cursor-grabbing hover:shadow transition-shadow"
                    )}
                  >
                    <GripVertical className="size-3 text-muted-foreground shrink-0" />
                    <div className="icon-circle size-6 bg-emerald-50 dark:bg-emerald-950/30 shrink-0">
                      <Leaf className="size-3 text-emerald-500" />
                    </div>
                    <span className="text-xs font-medium truncate">{plant.name}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 overflow-auto p-6">
            {loading ? (
              <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
                {Array.from({ length: cols * rows }).map((_, i) => (
                  <div key={i} className="aspect-square animate-pulse rounded-xl bg-muted" />
                ))}
              </div>
            ) : (
              <div
                className="grid gap-2"
                style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
              >
                {gridCells.map(({ x, y, spacePlant, plant }) => (
                  <div
                    key={`${x}-${y}`}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, x, y)}
                    className={cn(
                      "relative aspect-square rounded-xl border-2 border-dashed transition-colors flex items-center justify-center",
                      spacePlant
                        ? "border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/20"
                        : "border-border bg-background hover:border-emerald-300 hover:bg-emerald-50/30"
                    )}
                  >
                    {plant ? (
                      <div
                        draggable
                        onDragStart={(e) => handleDragStart(e, plant.id!, spacePlant?.id)}
                        onClick={() => setRemovingId(spacePlant?.id ?? null)}
                        className="flex flex-col items-center gap-1 cursor-grab active:cursor-grabbing select-none"
                      >
                        <div className="icon-circle size-10 bg-emerald-100 dark:bg-emerald-900/40">
                          <Leaf className="size-5 text-emerald-600" />
                        </div>
                        <span className="text-[10px] font-medium text-emerald-800 dark:text-emerald-200 truncate max-w-[90%] px-1">
                          {plant.name}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground/40">{x + 1},{y + 1}</span>
                    )}

                    {/* Remove popup */}
                    {spacePlant && removingId === spacePlant.id && (
                      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 rounded-xl bg-black/60 backdrop-blur-[1px]">
                        <p className="text-xs text-white font-medium">Remove {plant?.name}?</p>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="destructive"
                            className="h-7 text-xs px-3"
                            onClick={async (e) => {
                              e.stopPropagation();
                              await removePlantFromSpace(spacePlant.id!);
                              setRemovingId(null);
                            }}
                          >
                            <Trash2 className="size-3 mr-1" />
                            Remove
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            className="h-7 text-xs px-3"
                            onClick={(e) => {
                              e.stopPropagation();
                              setRemovingId(null);
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

type SpaceSortBy = "custom" | "name" | "type" | "createdAt";

export default function PlannerPage() {
  const router = useRouter();
  const [sortBy, setSortBy] = useState<SpaceSortBy>("createdAt");
  const { spaces, loading, addSpace, deleteSpace } = useSpaces(sortBy);
  const { plants } = usePlants();
  const { gardens, activeGardenId } = useGardenStore();
  const activeGarden = gardens.find((g) => g.id === activeGardenId);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState<SpaceType>("raised_bed");
  const [draggedSpaceId, setDraggedSpaceId] = useState<number | null>(null);
  const [dropTargetSpaceId, setDropTargetSpaceId] = useState<number | null>(null);

  const spaceOrder = useOrderStore((s) => s.spaceOrder);
  const setSpaceOrder = useOrderStore((s) => s.setSpaceOrder);

  const [layoutSpaceId, setLayoutSpaceId] = useState<number | null>(null);
  const layoutSpace = useMemo(
    () => spaces.find((s) => s.id === layoutSpaceId),
    [spaces, layoutSpaceId]
  );

  const handleAdd = async () => {
    if (!name.trim()) return;
    await addSpace({ name: name.trim(), type });
    setName("");
    setType("raised_bed");
    setOpen(false);
  };

  const handleDragStart = useCallback(
    (e: React.DragEvent, spaceId: number) => {
      if (sortBy !== "custom") {
        e.preventDefault();
        return;
      }
      setDraggedSpaceId(spaceId);
      e.dataTransfer.setData("text/plain", String(spaceId));
      e.dataTransfer.effectAllowed = "move";
    },
    [sortBy]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent, spaceId: number) => {
      e.preventDefault();
      if (sortBy !== "custom") return;
      if (draggedSpaceId !== null && draggedSpaceId !== spaceId) {
        e.dataTransfer.dropEffect = "move";
        setDropTargetSpaceId(spaceId);
      }
    },
    [sortBy, draggedSpaceId]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent, targetSpaceId: number) => {
      e.preventDefault();
      if (sortBy !== "custom" || draggedSpaceId === null || draggedSpaceId === targetSpaceId) {
        setDraggedSpaceId(null);
        setDropTargetSpaceId(null);
        return;
      }

      const visibleIds = spaces.map((s) => s.id!);
      const newVisibleOrder = [...visibleIds];
      const fromIdx = newVisibleOrder.indexOf(draggedSpaceId);
      const toIdx = newVisibleOrder.indexOf(targetSpaceId);
      if (fromIdx !== -1 && toIdx !== -1) {
        const [removed] = newVisibleOrder.splice(fromIdx, 1);
        newVisibleOrder.splice(toIdx, 0, removed);
      }

      const remainingIds = spaceOrder.filter((id) => !visibleIds.includes(id));
      const newOrder = [...newVisibleOrder, ...remainingIds];

      // ensure any missing ids are appended
      const allIds = new Set([...newOrder, ...spaces.map((s) => s.id!)]);
      const finalOrder = [...newOrder];
      for (const id of allIds) {
        if (!finalOrder.includes(id)) {
          finalOrder.push(id);
        }
      }

      setSpaceOrder(finalOrder);
      setDraggedSpaceId(null);
      setDropTargetSpaceId(null);
    },
    [sortBy, draggedSpaceId, spaces, spaceOrder, setSpaceOrder]
  );

  const handleDragEnd = useCallback(() => {
    setDraggedSpaceId(null);
    setDropTargetSpaceId(null);
  }, []);

  return (
    <PageShell>
      <div className="space-y-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Planner</h2>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-sm text-muted-foreground">
                Manage your growing spaces and layouts.
              </p>
              {activeGarden && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-300">
                  <Flower2 className="size-3" />
                  {activeGarden.name}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <ArrowUpDown className="size-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Sort by</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SpaceSortBy)}
                className="h-8 rounded-md border bg-background px-2 text-xs outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="custom">Custom order</option>
                <option value="name">Name</option>
                <option value="type">Type</option>
                <option value="createdAt">Created</option>
              </select>
              {sortBy === "custom" && spaceOrder.length > 0 && (
                <span className="text-[11px] text-emerald-600 font-medium">
                  Custom order
                </span>
              )}
            </div>
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
                  <label htmlFor="name" className="text-sm font-medium">
                    Name
                  </label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Bed A"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="type" className="text-sm font-medium">
                    Type
                  </label>
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
                <Button
                  onClick={handleAdd}
                  disabled={!name.trim()}
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                >
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
              <p className="text-base font-medium text-muted-foreground">
                No growing spaces yet
              </p>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                Add your first bed, container, or hydro system to start planning your
                garden layout
              </p>
              <Button
                className="mt-4 gap-2 bg-emerald-600 hover:bg-emerald-700"
                onClick={() => setOpen(true)}
              >
                <Plus className="size-4" />
                Add Your First Space
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {spaces.map((space) => {
              const spacePlants = plants.filter((p) => p.spaceId === space.id);
              const isDragging = draggedSpaceId === space.id;
              const isDropTarget = dropTargetSpaceId === space.id && draggedSpaceId !== space.id;
              return (
                <Card
                  key={space.id}
                  draggable={sortBy === "custom"}
                  onDragStart={(e) => handleDragStart(e, space.id!)}
                  onDragOver={(e) => handleDragOver(e, space.id!)}
                  onDrop={(e) => handleDrop(e, space.id!)}
                  onDragEnd={handleDragEnd}
                  className={cn(
                    "card-hover shadow-sm group",
                    isDragging && "opacity-50",
                    isDropTarget && "border-2 border-dashed border-emerald-400"
                  )}
                >
                  <CardHeader className="flex flex-row items-start justify-between pb-3">
                    <div className="flex items-center gap-3">
                      {sortBy === "custom" && (
                        <GripVertical
                          className={cn(
                            "size-4 shrink-0 cursor-grab active:cursor-grabbing text-muted-foreground/30 hover:text-muted-foreground"
                          )}
                        />
                      )}
                      <span className="text-2xl">{spaceTypeIcons[space.type]}</span>
                      <div>
                        <CardTitle className="text-base">{space.name}</CardTitle>
                        <p className="text-xs text-muted-foreground">
                          {spaceTypeLabels[space.type]}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-xs text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                        onClick={() => setLayoutSpaceId(space.id!)}
                      >
                        <LayoutGrid className="size-3.5 mr-1" />
                        Layout
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-muted-foreground/50 hover:text-destructive"
                        onClick={() => space.id && deleteSpace(space.id)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {spacePlants.length === 0 ? (
                      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-8 text-center">
                        <Leaf className="size-6 text-muted-foreground/30 mb-2" />
                        <p className="text-xs text-muted-foreground">No plants yet</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-2 text-xs h-7 text-emerald-600"
                          onClick={() => router.push("/plants/new")}
                        >
                          Add Plant
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {spacePlants.map((plant) => (
                          <div
                            key={plant.id}
                            className="flex items-center gap-2.5 rounded-xl border px-3 py-2.5 transition-colors hover:bg-accent/40 cursor-pointer"
                            onClick={() =>
                              router.push(`/plants/detail?id=${plant.id}`)
                            }
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

      {layoutSpace && layoutSpace.id && (
        <SpaceLayoutDialog
          spaceId={layoutSpace.id}
          spaceName={layoutSpace.name}
          spaceType={layoutSpace.type}
          open={layoutSpaceId !== null}
          onOpenChange={(open) => {
            if (!open) setLayoutSpaceId(null);
          }}
          allPlants={plants}
        />
      )}
    </PageShell>
  );
}
