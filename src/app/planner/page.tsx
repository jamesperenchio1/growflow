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
  Droplet,
  Maximize2,
  Minimize2,
  MoveDiagonal,
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
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { useSpaces } from "@/hooks/use-spaces";
import { usePlants } from "@/hooks/use-plants";
import { useSpacePlants } from "@/hooks/use-space-plants";
import { useGardenStore } from "@/store/garden-store";
import { useOrderStore } from "@/store/order-store";
import { cn } from "@/lib/utils";
import type { SpaceType, Plant, SpacePlant, GrowingSpace } from "@/types";

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

const hydroTypes: SpaceType[] = [
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

const soilTypes: SpaceType[] = ["raised_bed", "container"];

function isHydro(type: SpaceType): boolean {
  return hydroTypes.includes(type);
}

function defaultHydroCapacity(type: SpaceType): number {
  switch (type) {
    case "nft":
      return 12;
    case "dwc":
      return 6;
    case "dutch_bucket":
      return 4;
    case "vertical_tower":
      return 8;
    default:
      return 6;
  }
}

function defaultSoilGrid(type: SpaceType): { rows: number; cols: number; capacity: number } {
  if (type === "raised_bed") return { rows: 3, cols: 3, capacity: 9 };
  return { rows: 2, cols: 2, capacity: 4 };
}

function getSpaceGrid(space: GrowingSpace): { rows: number; cols: number; capacity: number } {
  if (isHydro(space.type)) {
    const cap = space.capacity ?? defaultHydroCapacity(space.type);
    if (cap <= 8) return { rows: 1, cols: cap, capacity: cap };
    return { rows: 2, cols: Math.ceil(cap / 2), capacity: cap };
  }
  // soil
  if (space.gridRows && space.gridCols) {
    return { rows: space.gridRows, cols: space.gridCols, capacity: space.gridRows * space.gridCols };
  }
  const def = defaultSoilGrid(space.type);
  return { rows: def.rows, cols: def.cols, capacity: space.capacity ?? def.capacity };
}

function getBasePlantName(name: string): string {
  return name.replace(/ #\d+$/, "");
}

function SpaceLayoutDialog({
  space,
  open,
  onOpenChange,
  allPlants,
}: {
  space: GrowingSpace;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  allPlants: Plant[];
}) {
  const spaceId = space.id!;
  const { spacePlants, loading, addPlantToSpace, removePlantFromSpace, movePlantInSpace } =
    useSpacePlants(spaceId);
  const [draggingPlantId, setDraggingPlantId] = useState<number | null>(null);
  const [removingId, setRemovingId] = useState<number | null>(null);
  const [expandedCell, setExpandedCell] = useState<{ x: number; y: number } | null>(null);
  const [cellDivisions, setCellDivisions] = useState<Map<string, 2 | 3>>(new Map());

  const isHydroSystem = isHydro(space.type);
  const { rows, cols, capacity } = getSpaceGrid(space);
  const subdividable = space.subdividable ?? false;

  const gridCells = useMemo(() => {
    const cells: {
      x: number;
      y: number;
      spacePlants: (SpacePlant & { plant?: Plant })[];
    }[] = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const sps = spacePlants
          .filter((p) => p.x === x && p.y === y)
          .map((sp) => ({
            ...sp,
            plant: allPlants.find((p) => p.id === sp.plantId),
          }));
        cells.push({ x, y, spacePlants: sps });
      }
    }
    return cells;
  }, [spacePlants, allPlants, rows, cols]);

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

  const findFreeAdjacent = useCallback(
    (startX: number, startY: number, count: number): { x: number; y: number }[] => {
      const result: { x: number; y: number }[] = [];
      const visited = new Set<string>();
      const queue: { x: number; y: number }[] = [{ x: startX, y: startY }];
      visited.add(`${startX},${startY}`);

      while (queue.length > 0 && result.length < count) {
        const curr = queue.shift()!;
        const occupied = spacePlants.some(
          (p) => p.x === curr.x && p.y === curr.y && p.subX === undefined && p.subY === undefined
        );
        if (!occupied && curr.x >= 0 && curr.x < cols && curr.y >= 0 && curr.y < rows) {
          result.push(curr);
        }
        const neighbors = [
          { x: curr.x + 1, y: curr.y },
          { x: curr.x - 1, y: curr.y },
          { x: curr.x, y: curr.y + 1 },
          { x: curr.x, y: curr.y - 1 },
        ];
        for (const n of neighbors) {
          const key = `${n.x},${n.y}`;
          if (!visited.has(key)) {
            visited.add(key);
            queue.push(n);
          }
        }
      }
      return result;
    },
    [spacePlants, cols, rows]
  );

  const handleDrop = useCallback(
    async (e: React.DragEvent, x: number, y: number, subX?: number, subY?: number) => {
      e.preventDefault();
      const data = e.dataTransfer.getData("application/growflow");
      if (!data) return;
      try {
        const { plantId, fromSpacePlantId } = JSON.parse(data);

        // Check subsquare occupancy
        if (subX !== undefined && subY !== undefined) {
          const existing = spacePlants.find(
            (p) => p.x === x && p.y === y && p.subX === subX && p.subY === subY
          );
          if (existing) return;
        } else {
          const existing = spacePlants.find(
            (p) => p.x === x && p.y === y && p.subX === undefined && p.subY === undefined
          );
          if (existing) return;
        }

        if (fromSpacePlantId) {
          await movePlantInSpace(fromSpacePlantId, x, y, subX, subY);
        } else {
          await addPlantToSpace(spaceId, plantId, x, y, subX, subY);
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

  const getCellDivision = (x: number, y: number) => cellDivisions.get(`${x}-${y}`);

  const setCellDivision = (x: number, y: number, div?: 2 | 3) => {
    setCellDivisions((prev) => {
      const next = new Map(prev);
      if (div === undefined) {
        next.delete(`${x}-${y}`);
      } else {
        next.set(`${x}-${y}`, div);
      }
      return next;
    });
  };

  const isCellOccupiedAtCellLevel = (x: number, y: number) =>
    spacePlants.some((p) => p.x === x && p.y === y && p.subX === undefined && p.subY === undefined);

  const isHoleOccupied = (x: number, y: number) =>
    spacePlants.some((p) => p.x === x && p.y === y);

  const renderHydroCell = (x: number, y: number, sps: (SpacePlant & { plant?: Plant })[]) => {
    const sp = sps[0];
    const plant = sp?.plant;
    const holeNumber = y * cols + x + 1;
    const occupied = isHoleOccupied(x, y);

    return (
      <div
        key={`${x}-${y}`}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, x, y)}
        className={cn(
          "relative flex flex-col items-center justify-center rounded-xl border-2 transition-colors p-2",
          occupied
            ? "border-sky-300 bg-sky-50 dark:bg-sky-950"
            : "border-sky-200 border-dashed bg-sky-50 hover:border-sky-400 hover:bg-sky-50"
        )}
      >
        {plant ? (
          <div
            draggable
            onDragStart={(e) => handleDragStart(e, plant.id!, sp?.id)}
            onClick={() => setRemovingId(sp?.id ?? null)}
            className="flex flex-col items-center gap-1 cursor-grab active:cursor-grabbing select-none"
          >
            <div className="icon-circle size-10 bg-sky-100 dark:bg-sky-900/40">
              <Droplet className="size-5 text-sky-600" />
            </div>
            <span className="text-[10px] font-medium text-sky-800 dark:text-sky-200 truncate max-w-[90%] px-1 text-center">
              {plant.name}
            </span>
          </div>
        ) : (
          <>
            <Droplets className="size-5 text-sky-300/60 mb-1" />
            <span className="text-[10px] text-sky-400/60 font-medium">Hole {holeNumber}</span>
          </>
        )}

        {sp && removingId === sp.id && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 rounded-xl bg-black/60 backdrop-blur-[1px]">
            <p className="text-xs text-white font-medium">Remove {plant?.name}?</p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="destructive"
                className="h-7 text-xs px-3"
                onClick={async (e) => {
                  e.stopPropagation();
                  await removePlantFromSpace(sp.id!);
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
    );
  };

  const renderSoilCell = (x: number, y: number, sps: (SpacePlant & { plant?: Plant })[]) => {
    const cellKey = `${x}-${y}`;
    const division = getCellDivision(x, y);
    const isExpanded = expandedCell?.x === x && expandedCell?.y === y;
    const cellLevelSp = sps.find((p) => p.subX === undefined && p.subY === undefined);
    const cellLevelPlant = cellLevelSp?.plant;

    // Subsquare plants (only if cell is NOT occupied at cell level)
    const subPlants = !cellLevelSp
      ? sps.filter((p) => p.subX !== undefined && p.subY !== undefined)
      : [];

    return (
      <div
        key={cellKey}
        className={cn(
          "relative rounded-xl border-2 transition-colors",
          cellLevelSp || subPlants.length > 0
            ? "border-emerald-200 bg-emerald-50 dark:bg-emerald-950"
            : "border-border border-dashed bg-background hover:border-emerald-300 hover:bg-emerald-50",
          subdividable && !cellLevelSp && !division && "border-dotted border-emerald-300/50"
        )}
      >
        {isExpanded && division ? (
          <div className="p-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-medium text-muted-foreground">
                Cell {x + 1},{y + 1}
              </span>
              <button
                onClick={() => setExpandedCell(null)}
                className="text-[10px] text-muted-foreground hover:text-foreground"
              >
                <Minimize2 className="size-3" />
              </button>
            </div>
            <div
              className="grid gap-1"
              style={{ gridTemplateColumns: `repeat(${division}, minmax(0, 1fr))` }}
            >
              {Array.from({ length: division * division }).map((_, idx) => {
                const sx = idx % division;
                const sy = Math.floor(idx / division);
                const subSp = subPlants.find((p) => p.subX === sx && p.subY === sy);
                const subPlant = subSp?.plant;
                const subOccupied = !!subSp;
                return (
                  <div
                    key={idx}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, x, y, sx, sy)}
                    className={cn(
                      "aspect-square rounded-md border flex items-center justify-center transition-colors",
                      subOccupied
                        ? "border-emerald-200 bg-emerald-50"
                        : "border-dashed border-muted-foreground/20 hover:border-emerald-300 hover:bg-emerald-50"
                    )}
                  >
                    {subPlant ? (
                      <div
                        draggable
                        onDragStart={(e) => handleDragStart(e, subPlant.id!, subSp?.id)}
                        onClick={() => setRemovingId(subSp?.id ?? null)}
                        className="flex flex-col items-center gap-0.5 cursor-grab active:cursor-grabbing select-none"
                      >
                        <Leaf className="size-3 text-emerald-500" />
                        <span className="text-[8px] font-medium text-emerald-700 truncate max-w-full px-0.5 text-center">
                          {subPlant.name}
                        </span>
                      </div>
                    ) : (
                      <span className="text-[8px] text-muted-foreground/30">
                        {sx + 1},{sy + 1}
                      </span>
                    )}

                    {subSp && removingId === subSp.id && (
                      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-1 rounded-md bg-black/60 backdrop-blur-[1px]">
                        <p className="text-[10px] text-white font-medium">Remove?</p>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="destructive"
                            className="h-5 text-[10px] px-2"
                            onClick={async (e) => {
                              e.stopPropagation();
                              await removePlantFromSpace(subSp.id!);
                              setRemovingId(null);
                            }}
                          >
                            <Trash2 className="size-2.5 mr-0.5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            className="h-5 text-[10px] px-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              setRemovingId(null);
                            }}
                          >
                            <X className="size-2.5" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, x, y)}
            className="relative aspect-square flex items-center justify-center p-1"
          >
            {cellLevelPlant ? (
              <div
                draggable
                onDragStart={(e) => handleDragStart(e, cellLevelPlant.id!, cellLevelSp?.id)}
                onClick={() => setRemovingId(cellLevelSp?.id ?? null)}
                className="flex flex-col items-center gap-1 cursor-grab active:cursor-grabbing select-none"
              >
                <div className="icon-circle size-10 bg-emerald-100 dark:bg-emerald-900/40">
                  <Leaf className="size-5 text-emerald-600" />
                </div>
                <span className="text-[10px] font-medium text-emerald-800 dark:text-emerald-200 truncate max-w-[90%] px-1 text-center">
                  {cellLevelPlant.name}
                </span>
              </div>
            ) : subPlants.length > 0 ? (
              <div className="grid grid-cols-2 gap-0.5 w-full h-full p-1">
                {subPlants.map((sp) => (
                  <div
                    key={sp.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, sp.plant!.id!, sp.id)}
                    onClick={() => setRemovingId(sp.id ?? null)}
                    className="flex items-center justify-center rounded-md bg-emerald-100/60 cursor-grab active:cursor-grabbing"
                    title={sp.plant?.name}
                  >
                    <Leaf className="size-3 text-emerald-500" />
                  </div>
                ))}
              </div>
            ) : (
              <span className="text-xs text-muted-foreground/40">
                {x + 1},{y + 1}
              </span>
            )}

            {/* Subdivide controls */}
            {subdividable && !cellLevelSp && !division && (
              <div className="absolute top-1 right-1 flex gap-0.5">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCellDivision(x, y, 2);
                    setExpandedCell({ x, y });
                  }}
                  className="rounded-md bg-background border border-border p-0.5 hover:bg-accent shadow-sm"
                  title="Subdivide 2×2"
                >
                  <Maximize2 className="size-3 text-muted-foreground" />
                </button>
              </div>
            )}

            {subdividable && division && !cellLevelSp && (
              <div className="absolute top-1 right-1 flex gap-0.5">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandedCell({ x, y });
                  }}
                  className="rounded-md bg-background border border-border p-0.5 hover:bg-accent shadow-sm"
                  title="Expand cell"
                >
                  <MoveDiagonal className="size-3 text-muted-foreground" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCellDivision(x, y, undefined);
                    if (expandedCell?.x === x && expandedCell?.y === y) {
                      setExpandedCell(null);
                    }
                  }}
                  className="rounded-md bg-background border border-border p-0.5 hover:bg-accent shadow-sm"
                  title="Remove subdivision"
                >
                  <X className="size-3 text-muted-foreground" />
                </button>
              </div>
            )}

            {/* Remove popup for cell-level plant */}
            {cellLevelSp && removingId === cellLevelSp.id && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 rounded-xl bg-black/60 backdrop-blur-[1px]">
                <p className="text-xs text-white font-medium">Remove {cellLevelPlant?.name}?</p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="destructive"
                    className="h-7 text-xs px-3"
                    onClick={async (e) => {
                      e.stopPropagation();
                      await removePlantFromSpace(cellLevelSp.id!);
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
        )}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="flex items-center gap-2">
            <LayoutGrid className="size-5 text-emerald-600" />
            {space.name} — Layout
            <span className="ml-2 text-xs font-normal text-muted-foreground">
              {isHydroSystem ? `${spaceTypeLabels[space.type]} · ${capacity} holes` : `${spaceTypeLabels[space.type]} · ${rows}×${cols} grid`}
            </span>
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-60 border-r border-border flex flex-col bg-muted/30">
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
                {gridCells.map(({ x, y, spacePlants: sps }) =>
                  isHydroSystem
                    ? renderHydroCell(x, y, sps)
                    : renderSoilCell(x, y, sps)
                )}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

type SpaceSortBy = "custom" | "name" | "type" | "createdAt";

type GridSizeOption = "small" | "medium" | "large" | "custom";

const gridSizeOptions: { value: GridSizeOption; label: string; rows: number; cols: number }[] = [
  { value: "small", label: "Small (2×2)", rows: 2, cols: 2 },
  { value: "medium", label: "Medium (3×3)", rows: 3, cols: 3 },
  { value: "large", label: "Large (4×4)", rows: 4, cols: 4 },
];

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
  const [capacity, setCapacity] = useState<number>(9);
  const [gridSize, setGridSize] = useState<GridSizeOption>("medium");
  const [customRows, setCustomRows] = useState(3);
  const [customCols, setCustomCols] = useState(3);
  const [subdividable, setSubdividable] = useState(false);
  const [draggedSpaceId, setDraggedSpaceId] = useState<number | null>(null);
  const [dropTargetSpaceId, setDropTargetSpaceId] = useState<number | null>(null);

  const spaceOrder = useOrderStore((s) => s.spaceOrder);
  const setSpaceOrder = useOrderStore((s) => s.setSpaceOrder);

  const [layoutSpaceId, setLayoutSpaceId] = useState<number | null>(null);
  const layoutSpace = useMemo(
    () => spaces.find((s) => s.id === layoutSpaceId),
    [spaces, layoutSpaceId]
  );

  const isHydroSelected = isHydro(type);

  const handleTypeChange = (newType: SpaceType) => {
    setType(newType);
    if (isHydro(newType)) {
      setCapacity(defaultHydroCapacity(newType));
      setSubdividable(false);
    } else {
      const def = defaultSoilGrid(newType);
      setGridSize(newType === "raised_bed" ? "medium" : "small");
      setCapacity(def.capacity);
      setCustomRows(def.rows);
      setCustomCols(def.cols);
    }
  };

  const handleGridSizeChange = (size: GridSizeOption) => {
    setGridSize(size);
    if (size !== "custom") {
      const opt = gridSizeOptions.find((o) => o.value === size);
      if (opt) {
        setCapacity(opt.rows * opt.cols);
        setCustomRows(opt.rows);
        setCustomCols(opt.cols);
      }
    }
  };

  const handleAdd = async () => {
    if (!name.trim()) return;
    const isH = isHydro(type);
    const cap = isH ? capacity : gridSize === "custom" ? customRows * customCols : capacity;
    const rows = isH ? undefined : customRows;
    const cols = isH ? undefined : customCols;

    await addSpace({
      name: name.trim(),
      type,
      capacity: cap,
      gridRows: rows,
      gridCols: cols,
      subdividable: isH ? undefined : subdividable,
    });
    setName("");
    setType("raised_bed");
    setCapacity(9);
    setGridSize("medium");
    setCustomRows(3);
    setCustomCols(3);
    setSubdividable(false);
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

  const getSpaceCapacityInfo = (space: GrowingSpace) => {
    const { capacity: cap } = getSpaceGrid(space);
    const spacePlantList = plants.filter((p) => p.spaceId === space.id);
    // Count only plants that are placed in this space via spacePlants
    // But we don't have spacePlants here easily for all spaces.
    // As a proxy, we'll count plants assigned to the space.
    const filled = spacePlantList.length;
    return { filled, capacity: cap, over: filled > cap };
  };

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
                    onChange={(e) => handleTypeChange(e.target.value as SpaceType)}
                    className="flex h-10 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    {spaceTypes.map((t) => (
                      <option key={t} value={t}>
                        {spaceTypeIcons[t]} {spaceTypeLabels[t]}
                      </option>
                    ))}
                  </select>
                </div>

                {isHydroSelected ? (
                  <div className="space-y-2">
                    <label htmlFor="capacity" className="text-sm font-medium">
                      Number of Holes / Sites
                    </label>
                    <Input
                      id="capacity"
                      type="number"
                      min={1}
                      max={64}
                      value={capacity}
                      onChange={(e) => setCapacity(Math.max(1, Math.min(64, Number(e.target.value) || 1)))}
                    />
                    <p className="text-xs text-muted-foreground">
                      Default for {spaceTypeLabels[type]}: {defaultHydroCapacity(type)} holes
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Grid Size</label>
                      <div className="grid grid-cols-2 gap-2">
                        {gridSizeOptions.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => handleGridSizeChange(opt.value)}
                            className={cn(
                              "rounded-lg border-2 px-3 py-2 text-sm font-medium transition-all",
                              gridSize === opt.value
                                ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300"
                                : "border-border hover:bg-accent hover:text-foreground"
                            )}
                          >
                            {opt.label}
                          </button>
                        ))}
                        <button
                          onClick={() => handleGridSizeChange("custom")}
                          className={cn(
                            "rounded-lg border-2 px-3 py-2 text-sm font-medium transition-all",
                            gridSize === "custom"
                              ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300"
                              : "border-border hover:bg-accent hover:text-foreground"
                          )}
                        >
                          Custom
                        </button>
                      </div>
                    </div>

                    {gridSize === "custom" && (
                      <div className="flex gap-3">
                        <div className="flex-1 space-y-2">
                          <label className="text-sm font-medium">Rows</label>
                          <Input
                            type="number"
                            min={1}
                            max={12}
                            value={customRows}
                            onChange={(e) => setCustomRows(Math.max(1, Math.min(12, Number(e.target.value) || 1)))}
                          />
                        </div>
                        <div className="flex-1 space-y-2">
                          <label className="text-sm font-medium">Columns</label>
                          <Input
                            type="number"
                            min={1}
                            max={12}
                            value={customCols}
                            onChange={(e) => setCustomCols(Math.max(1, Math.min(12, Number(e.target.value) || 1)))}
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="subdividable"
                        checked={subdividable}
                        onCheckedChange={(checked) => setSubdividable(checked === true)}
                      />
                      <label htmlFor="subdividable" className="text-sm font-medium cursor-pointer">
                        Allow subsquares (sub-divide cells)
                      </label>
                    </div>
                  </>
                )}

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
              const spacePlantsList = plants.filter((p) => p.spaceId === space.id);
              const { filled, capacity: cap, over } = getSpaceCapacityInfo(space);
              const isDragging = draggedSpaceId === space.id;
              const isDropTarget = dropTargetSpaceId === space.id && draggedSpaceId !== space.id;
              const isHydroSpace = isHydro(space.type);
              const fillPercent = cap > 0 ? Math.min(100, (filled / cap) * 100) : 0;

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
                  <CardContent className="space-y-3">
                    {/* Capacity indicator */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className={cn("font-medium", over && "text-amber-600")}>
                          {filled} of {cap} {isHydroSpace ? "holes" : "cells"} filled
                        </span>
                        {over && (
                          <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 dark:bg-amber-950/30 px-1.5 py-0.5 rounded-full">
                            Over capacity
                          </span>
                        )}
                      </div>
                      <Progress
                        value={fillPercent}
                        className={cn("h-1.5", over ? "bg-amber-100" : "bg-muted")}
                      />
                    </div>

                    {spacePlantsList.length === 0 ? (
                      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-6 text-center">
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
                        {spacePlantsList.slice(0, 4).map((plant) => (
                          <div
                            key={plant.id}
                            className="flex items-center gap-2.5 rounded-xl border px-3 py-2.5 transition-colors hover:bg-accent cursor-pointer"
                            onClick={() =>
                              router.push(`/plants/detail?id=${plant.id}`)
                            }
                          >
                            <div className="icon-circle size-8 bg-emerald-50 dark:bg-emerald-950/30">
                              <Leaf className="size-4 text-emerald-500" />
                            </div>
                            <span className="text-sm font-medium">{plant.name}</span>
                            <span className="ml-auto text-[11px] text-muted-foreground capitalize bg-muted px-2 py-0.5 rounded-full">
                              {plant.category}
                            </span>
                          </div>
                        ))}
                        {spacePlantsList.length > 4 && (
                          <p className="text-xs text-muted-foreground text-center">
                            +{spacePlantsList.length - 4} more plants
                          </p>
                        )}
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
          space={layoutSpace}
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
