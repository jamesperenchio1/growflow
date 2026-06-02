"use client";

import { useState } from "react";
import { Flower2, Pencil, Trash2, Plus, Check, ChevronRight, Home } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { useGardenStore, type Garden, type GardenType } from "@/store/garden-store";
import { cn } from "@/lib/utils";

const gardenTypeLabels: Record<GardenType, string> = {
  indoor: "Indoor",
  outdoor: "Outdoor",
  greenhouse: "Greenhouse",
  balcony: "Balcony",
  farm: "Farm",
};

const gardenTypeColors: Record<GardenType, string> = {
  indoor: "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-300",
  outdoor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  greenhouse: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300",
  balcony: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300",
  farm: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
};

const gardenTypes: GardenType[] = ["indoor", "outdoor", "greenhouse", "balcony", "farm"];

interface GardenManagerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GardenManagerDialog({ open, onOpenChange }: GardenManagerDialogProps) {
  const { gardens, activeGardenId, addGarden, updateGarden, deleteGarden, setActiveGarden } =
    useGardenStore();
  const [mode, setMode] = useState<"list" | "add" | "edit">("list");
  const [editingGarden, setEditingGarden] = useState<Garden | null>(null);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState<GardenType>("outdoor");
  const [description, setDescription] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const resetForm = () => {
    setName("");
    setLocation("");
    setType("outdoor");
    setDescription("");
    setEditingGarden(null);
  };

  const handleAdd = () => {
    if (!name.trim() || !location.trim()) return;
    addGarden({ name: name.trim(), location: location.trim(), type, description: description.trim() || undefined });
    resetForm();
    setMode("list");
  };

  const handleEdit = () => {
    if (!editingGarden || !name.trim() || !location.trim()) return;
    updateGarden(editingGarden.id, {
      name: name.trim(),
      location: location.trim(),
      type,
      description: description.trim() || undefined,
    });
    resetForm();
    setMode("list");
  };

  const startEdit = (garden: Garden) => {
    setEditingGarden(garden);
    setName(garden.name);
    setLocation(garden.location);
    setType(garden.type);
    setDescription(garden.description ?? "");
    setMode("edit");
  };

  const handleDelete = (id: string) => {
    deleteGarden(id);
    setConfirmDelete(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Flower2 className="size-5 text-emerald-600" />
            {mode === "list" && "Manage Gardens"}
            {mode === "add" && "Add Garden"}
            {mode === "edit" && "Edit Garden"}
          </DialogTitle>
        </DialogHeader>

        {mode === "list" && (
          <div className="space-y-3 py-2">
            {gardens.map((garden) => (
              <div
                key={garden.id}
                className={cn(
                  "flex items-center justify-between rounded-xl border px-4 py-3 transition-all",
                  garden.id === activeGardenId
                    ? "border-emerald-300 bg-emerald-50/50 dark:border-emerald-900/30 dark:bg-emerald-950/20"
                    : "border-border hover:bg-accent/40"
                )}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={cn(
                      "icon-circle size-9 shrink-0",
                      garden.id === activeGardenId
                        ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    <Home className="size-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold truncate">{garden.name}</span>
                      {garden.id === activeGardenId && (
                        <Check className="size-3.5 text-emerald-600 shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-muted-foreground truncate">{garden.location}</span>
                      <Badge
                        variant="outline"
                        className={cn("text-[10px] h-5 px-1.5 capitalize", gardenTypeColors[garden.type])}
                      >
                        {gardenTypeLabels[garden.type]}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0 ml-2">
                  {garden.id !== activeGardenId && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-xs text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                      onClick={() => {
                        setActiveGarden(garden.id);
                        onOpenChange(false);
                      }}
                    >
                      Switch to
                      <ChevronRight className="size-3 ml-1" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 text-muted-foreground hover:text-foreground"
                    onClick={() => startEdit(garden)}
                  >
                    <Pencil className="size-3.5" />
                  </Button>
                  {gardens.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-muted-foreground hover:text-destructive"
                      onClick={() => setConfirmDelete(garden.id)}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            ))}

            {confirmDelete && (
              <div className="rounded-xl border border-red-200 bg-red-50/50 dark:border-red-900/30 dark:bg-red-950/10 p-4 space-y-3">
                <p className="text-sm font-medium text-destructive">
                  Delete this garden?
                </p>
                <p className="text-xs text-muted-foreground">
                  All plants, spaces, tasks and devices will be moved to your default garden.
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="destructive"
                    className="h-8 text-xs"
                    onClick={() => handleDelete(confirmDelete)}
                  >
                    Delete
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs"
                    onClick={() => setConfirmDelete(null)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            <Button
              className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700 mt-2"
              onClick={() => {
                resetForm();
                setMode("add");
              }}
            >
              <Plus className="size-4" />
              Add Garden
            </Button>
          </div>
        )}

        {(mode === "add" || mode === "edit") && (
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Home Balcony"
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Location</label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Bangkok, Thailand"
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <Select
                value={type}
                onChange={(e) => setType(e.target.value as GardenType)}
              >
                {gardenTypes.map((t) => (
                  <option key={t} value={t}>
                    {gardenTypeLabels[t]}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional description..."
                className="h-10"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                className="flex-1 h-10"
                onClick={() => {
                  resetForm();
                  setMode("list");
                }}
              >
                Back
              </Button>
              <Button
                className="flex-1 h-10 bg-emerald-600 hover:bg-emerald-700"
                disabled={!name.trim() || !location.trim()}
                onClick={mode === "add" ? handleAdd : handleEdit}
              >
                {mode === "add" ? "Create Garden" : "Save Changes"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
