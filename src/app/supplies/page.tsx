"use client";

import { useState, useMemo } from "react";
import {
  Package,
  Plus,
  Search,
  Pencil,
  Trash2,
  Minus,
  AlertTriangle,
  Beaker,
  Droplets,
  Sprout,
  Wrench,
  Mountain,
  Bug,
  MoreHorizontal,
  X,
} from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  useSuppliesStore,
  type SupplyItem,
  type SupplyCategory,
} from "@/store/supplies-store";
import { cn } from "@/lib/utils";

const categories: { value: SupplyCategory | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "nutrient", label: "Nutrients" },
  { value: "ph_buffer", label: "pH" },
  { value: "seed", label: "Seeds" },
  { value: "tool", label: "Tools" },
  { value: "medium", label: "Medium" },
  { value: "pest_control", label: "Pest Control" },
  { value: "other", label: "Other" },
];

const categoryConfig: Record<
  SupplyCategory,
  { icon: typeof Package; color: string; badge: string }
> = {
  nutrient: {
    icon: Beaker,
    color: "text-blue-600",
    badge: "bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300",
  },
  ph_buffer: {
    icon: Droplets,
    color: "text-purple-600",
    badge:
      "bg-purple-100 text-purple-700 dark:bg-purple-950/30 dark:text-purple-300",
  },
  seed: {
    icon: Sprout,
    color: "text-emerald-600",
    badge:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300",
  },
  tool: {
    icon: Wrench,
    color: "text-slate-600",
    badge:
      "bg-slate-100 text-slate-700 dark:bg-slate-950/30 dark:text-slate-300",
  },
  medium: {
    icon: Mountain,
    color: "text-amber-600",
    badge:
      "bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300",
  },
  pest_control: {
    icon: Bug,
    color: "text-rose-600",
    badge: "bg-rose-100 text-rose-700 dark:bg-rose-950/30 dark:text-rose-300",
  },
  other: {
    icon: MoreHorizontal,
    color: "text-gray-600",
    badge:
      "bg-gray-100 text-gray-700 dark:bg-gray-950/30 dark:text-gray-300",
  },
};

const unitOptions = ["ml", "L", "g", "kg", "pcs", "bottles", "packs", "units"];

function getProgressColor(item: SupplyItem) {
  const ratio = item.quantity / item.minThreshold;
  if (item.quantity === 0) return "bg-rose-500";
  if (ratio <= 1) return "bg-rose-500";
  if (ratio <= 1.5) return "bg-amber-500";
  return "bg-emerald-500";
}

function getExpiryColor(dateStr?: string) {
  if (!dateStr) return null;
  const expiry = new Date(dateStr);
  const now = new Date();
  const diff = expiry.getTime() - now.getTime();
  const days = Math.ceil(diff / (24 * 60 * 60 * 1000));
  if (days < 0) return { text: "text-rose-600", label: `Expired ${Math.abs(days)}d ago` };
  if (days <= 7) return { text: "text-rose-600", label: `${days}d left` };
  if (days <= 30) return { text: "text-amber-600", label: `${days}d left` };
  return { text: "text-emerald-600", label: `${days}d left` };
}

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
  gradient,
  alert,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: typeof Package;
  color: string;
  gradient: string;
  alert?: boolean;
}) {
  return (
    <Card className={cn("border-0 shadow-sm", gradient)}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div>
              <p className="text-3xl font-bold tracking-tight">{value}</p>
              <p
                className={cn(
                  "text-xs mt-0.5",
                  alert ? "text-amber-700 dark:text-amber-300 font-medium" : "text-muted-foreground"
                )}
              >
                {subtitle}
              </p>
            </div>
          </div>
          <div className={cn("icon-circle size-10", color)}>
            <Icon className="size-5 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function SuppliesPage() {
  const { items, addItem, updateItem, deleteItem, useQuantity } =
    useSuppliesStore();

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<SupplyCategory | "all">("all");
  const [addOpen, setAddOpen] = useState(false);
  const [useOpen, setUseOpen] = useState(false);
  const [editItem, setEditItem] = useState<SupplyItem | null>(null);
  const [useItem, setUseItem] = useState<SupplyItem | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Form state
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState<SupplyCategory>("nutrient");
  const [formQuantity, setFormQuantity] = useState<number | "">("");
  const [formUnit, setFormUnit] = useState("ml");
  const [formMin, setFormMin] = useState<number | "">("");
  const [formExpiry, setFormExpiry] = useState("");
  const [formSupplier, setFormSupplier] = useState("");
  const [formCost, setFormCost] = useState<number | "">("");
  const [formCurrency, setFormCurrency] = useState("USD");
  const [formNotes, setFormNotes] = useState("");

  // Use form state
  const [useAmount, setUseAmount] = useState<number | "">("");
  const [useNotes, setUseNotes] = useState("");

  const filteredItems = useMemo(() => {
    return items
      .filter((i) =>
        activeCategory === "all" ? true : i.category === activeCategory
      )
      .filter((i) => i.name.toLowerCase().includes(search.toLowerCase()));
  }, [items, activeCategory, search]);

  const lowStock = items.filter((i) => i.quantity <= i.minThreshold);
  const expiringSoon = (() => {
    const now = new Date();
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;
    return items.filter((i) => {
      if (!i.expiryDate) return false;
      const expiry = new Date(i.expiryDate);
      const diff = expiry.getTime() - now.getTime();
      return diff <= thirtyDays;
    });
  })();

  const totalValue = items.reduce(
    (sum, i) => sum + (i.cost ?? 0) * i.quantity,
    0
  );

  function resetForm() {
    setFormName("");
    setFormCategory("nutrient");
    setFormQuantity("");
    setFormUnit("ml");
    setFormMin("");
    setFormExpiry("");
    setFormSupplier("");
    setFormCost("");
    setFormCurrency("USD");
    setFormNotes("");
    setEditItem(null);
  }

  function openEdit(item: SupplyItem) {
    setEditItem(item);
    setFormName(item.name);
    setFormCategory(item.category);
    setFormQuantity(item.quantity);
    setFormUnit(item.unit);
    setFormMin(item.minThreshold);
    setFormExpiry(item.expiryDate ?? "");
    setFormSupplier(item.supplier ?? "");
    setFormCost(item.cost ?? "");
    setFormCurrency(item.currency ?? "USD");
    setFormNotes(item.notes ?? "");
    setAddOpen(true);
  }

  function handleSave() {
    const payload = {
      name: formName.trim(),
      category: formCategory,
      quantity: typeof formQuantity === "number" ? formQuantity : 0,
      unit: formUnit,
      minThreshold: typeof formMin === "number" ? formMin : 0,
      expiryDate: formExpiry || undefined,
      supplier: formSupplier.trim() || undefined,
      cost: typeof formCost === "number" ? formCost : undefined,
      currency: formCost ? formCurrency : undefined,
      notes: formNotes.trim() || undefined,
    };
    if (!payload.name) return;
    if (editItem) {
      updateItem(editItem.id, payload);
    } else {
      addItem(payload);
    }
    setAddOpen(false);
    resetForm();
  }

  function handleUse() {
    if (!useItem || typeof useAmount !== "number" || useAmount <= 0) return;
    useQuantity(useItem.id, useAmount, useNotes.trim() || undefined);
    setUseOpen(false);
    setUseItem(null);
    setUseAmount("");
    setUseNotes("");
  }

  function openUse(item: SupplyItem) {
    setUseItem(item);
    setUseAmount("");
    setUseNotes("");
    setUseOpen(true);
  }

  return (
    <PageShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Supplies & Inventory
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Track consumables, get low-stock alerts, and manage your grow
              supplies.
            </p>
          </div>
          <Button
            onClick={() => {
              resetForm();
              setAddOpen(true);
            }}
            className="gap-2 bg-emerald-600 hover:bg-emerald-700"
          >
            <Plus className="size-4" />
            Add Supply
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Items"
            value={String(items.length)}
            subtitle="Supplies in inventory"
            icon={Package}
            color="bg-emerald-500"
            gradient="gradient-emerald"
          />
          <StatCard
            title="Low Stock"
            value={String(lowStock.length)}
            subtitle={
              lowStock.length > 0
                ? `${lowStock.length} item${lowStock.length > 1 ? "s" : ""} below threshold`
                : "All stocked up"
            }
            icon={AlertTriangle}
            color={lowStock.length > 0 ? "bg-amber-500" : "bg-slate-400"}
            gradient={lowStock.length > 0 ? "gradient-amber" : "gradient-slate"}
            alert={lowStock.length > 0}
          />
          <StatCard
            title="Expiring Soon"
            value={String(expiringSoon.length)}
            subtitle={
              expiringSoon.length > 0
                ? `${expiringSoon.length} within 30 days`
                : "Nothing expiring soon"
            }
            icon={Package}
            color={expiringSoon.length > 0 ? "bg-amber-500" : "bg-slate-400"}
            gradient={expiringSoon.length > 0 ? "gradient-amber" : "gradient-slate"}
            alert={expiringSoon.length > 0}
          />
          <StatCard
            title="Total Value"
            value={`$${totalValue.toFixed(2)}`}
            subtitle="Estimated inventory value"
            icon={Package}
            color="bg-blue-500"
            gradient="gradient-blue"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-1.5">
            {categories.map((c) => (
              <button
                key={c.value}
                onClick={() => setActiveCategory(c.value)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-medium transition-all",
                  activeCategory === c.value
                    ? "bg-emerald-600 text-white"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                {c.label}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search supplies..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Grid */}
        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center rounded-xl bg-muted/30">
            <div className="icon-circle size-12 bg-emerald-100 dark:bg-emerald-950/30 mb-3">
              <Package className="size-6 text-emerald-500" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              No supplies found
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {search
                ? "Try a different search term"
                : "Add your first supply to get started"}
            </p>
            {!search && (
              <Button
                variant="outline"
                size="sm"
                className="mt-3 gap-1"
                onClick={() => {
                  resetForm();
                  setAddOpen(true);
                }}
              >
                <Plus className="size-3" /> Add Supply
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredItems.map((item) => {
              const config = categoryConfig[item.category];
              const Icon = config.icon;
              const progressColor = getProgressColor(item);
              const maxVal = Math.max(item.quantity, item.minThreshold * 2);
              const pct = Math.min(100, Math.round((item.quantity / maxVal) * 100));
              const expiry = getExpiryColor(item.expiryDate);
              const isLow = item.quantity <= item.minThreshold;
              const isCritical = item.quantity === 0;

              return (
                <Card
                  key={item.id}
                  className={cn(
                    "border-0 shadow-sm transition-all hover:shadow-md",
                    isCritical && "ring-1 ring-rose-200 dark:ring-rose-900/30"
                  )}
                >
                  <CardContent className="p-5 space-y-4">
                    {/* Top row */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={cn(
                            "flex size-9 items-center justify-center rounded-lg",
                            config.badge
                          )}
                        >
                          <Icon className={cn("size-4", config.color)} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold truncate leading-tight">
                            {item.name}
                          </p>
                          <span
                            className={cn(
                              "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium mt-1",
                              config.badge
                            )}
                          >
                            {categories.find((c) => c.value === item.category)
                              ?.label ?? item.category}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <button
                          onClick={() => openEdit(item)}
                          className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                          title="Edit"
                        >
                          <Pencil className="size-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(item.id)}
                          className="rounded-md p-1.5 text-muted-foreground hover:bg-rose-50 hover:text-rose-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Quantity */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          {item.quantity} {item.unit}
                        </span>
                        <span
                          className={cn(
                            "text-xs font-medium",
                            isCritical
                              ? "text-rose-600"
                              : isLow
                              ? "text-amber-600"
                              : "text-emerald-600"
                          )}
                        >
                          {isCritical
                            ? "Out of stock"
                            : isLow
                            ? "Low stock"
                            : "In stock"}
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className={cn("h-full rounded-full transition-all", progressColor)}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        Min: {item.minThreshold} {item.unit}
                      </p>
                    </div>

                    {/* Meta */}
                    <div className="space-y-1 text-xs text-muted-foreground">
                      {item.supplier && <p>Supplier: {item.supplier}</p>}
                      {item.cost !== undefined && (
                        <p>
                          Cost: {item.currency} {item.cost.toFixed(2)} / {item.unit}
                        </p>
                      )}
                      {expiry && (
                        <p className={cn("font-medium", expiry.text)}>
                          Expires: {item.expiryDate} ({expiry.label})
                        </p>
                      )}
                      {item.lastUsed && (
                        <p>
                          Last used:{" "}
                          {new Date(item.lastUsed).toLocaleDateString()}
                        </p>
                      )}
                      {item.notes && (
                        <p className="line-clamp-2">{item.notes}</p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="pt-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full gap-1"
                        onClick={() => openUse(item)}
                        disabled={item.quantity <= 0}
                      >
                        <Minus className="size-3.5" />
                        Use
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Add / Edit Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editItem ? "Edit Supply" : "Add Supply"}</DialogTitle>
            <DialogDescription>
              {editItem
                ? "Update the details of this supply item."
                : "Add a new consumable to your inventory."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Name</label>
              <Input
                placeholder="e.g. General Hydroponics Flora Micro"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Category</label>
                <Select
                  value={formCategory}
                  onChange={(e) =>
                    setFormCategory(e.target.value as SupplyCategory)
                  }
                >
                  {categories
                    .filter((c) => c.value !== "all")
                    .map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Unit</label>
                <Select
                  value={formUnit}
                  onChange={(e) => setFormUnit(e.target.value)}
                >
                  {unitOptions.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Quantity</label>
                <Input
                  type="number"
                  min={0}
                  step={formUnit === "pcs" || formUnit === "bottles" || formUnit === "packs" || formUnit === "units" ? 1 : 0.1}
                  value={formQuantity}
                  onChange={(e) =>
                    setFormQuantity(
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Min Threshold</label>
                <Input
                  type="number"
                  min={0}
                  step={formUnit === "pcs" || formUnit === "bottles" || formUnit === "packs" || formUnit === "units" ? 1 : 0.1}
                  value={formMin}
                  onChange={(e) =>
                    setFormMin(
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Expiry Date (optional)</label>
                <Input
                  type="date"
                  value={formExpiry}
                  onChange={(e) => setFormExpiry(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Supplier (optional)</label>
                <Input
                  placeholder="e.g. General Hydroponics"
                  value={formSupplier}
                  onChange={(e) => setFormSupplier(e.target.value)}
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Cost (optional)</label>
                <Input
                  type="number"
                  min={0}
                  step={0.01}
                  placeholder="0.00"
                  value={formCost}
                  onChange={(e) =>
                    setFormCost(
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Currency</label>
                <Select
                  value={formCurrency}
                  onChange={(e) => setFormCurrency(e.target.value)}
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="THB">THB</option>
                  <option value="AUD">AUD</option>
                  <option value="CAD">CAD</option>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Notes (optional)</label>
              <Textarea
                placeholder="Storage instructions, batch number, etc."
                value={formNotes}
                onChange={(e) => setFormNotes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!formName.trim()}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {editItem ? "Save Changes" : "Add Supply"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Use Quantity Dialog */}
      <Dialog open={useOpen} onOpenChange={setUseOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Use Supply</DialogTitle>
            <DialogDescription>
              Record consumption for{" "}
              <span className="font-medium text-foreground">
                {useItem?.name}
              </span>
              .
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3 text-sm">
              <span className="text-muted-foreground">Current stock</span>
              <span className="font-semibold">
                {useItem?.quantity} {useItem?.unit}
              </span>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Amount Used</label>
              <Input
                type="number"
                min={0.1}
                step={
                  useItem?.unit === "pcs" ||
                  useItem?.unit === "bottles" ||
                  useItem?.unit === "packs" ||
                  useItem?.unit === "units"
                    ? 1
                    : 0.1
                }
                placeholder={`Enter amount in ${useItem?.unit}`}
                value={useAmount}
                onChange={(e) =>
                  setUseAmount(
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
              />
            </div>
            {typeof useAmount === "number" &&
              useItem &&
              useItem.quantity - useAmount < useItem.minThreshold && (
                <div className="flex items-start gap-2 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 p-3">
                  <AlertTriangle className="size-4 text-amber-600 mt-0.5 shrink-0" />
                  <p className="text-xs text-amber-800 dark:text-amber-200">
                    This will bring stock below the minimum threshold (
                    {useItem.minThreshold} {useItem.unit}).
                  </p>
                </div>
              )}
            {typeof useAmount === "number" &&
              useItem &&
              useItem.quantity - useAmount < 0 && (
                <div className="flex items-start gap-2 rounded-lg bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/30 p-3">
                  <X className="size-4 text-rose-600 mt-0.5 shrink-0" />
                  <p className="text-xs text-rose-800 dark:text-rose-200">
                    Not enough stock. You only have {useItem.quantity}{" "}
                    {useItem.unit} available.
                  </p>
                </div>
              )}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Notes (optional)</label>
              <Textarea
                placeholder="e.g. Used for reservoir change"
                value={useNotes}
                onChange={(e) => setUseNotes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUseOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleUse}
              disabled={
                typeof useAmount !== "number" ||
                useAmount <= 0 ||
                (useItem !== null && useItem.quantity - useAmount < 0)
              }
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              Record Usage
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog
        open={deleteConfirm !== null}
        onOpenChange={(open) => !open && setDeleteConfirm(null)}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Supply?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. The supply item will be permanently
              removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (deleteConfirm) deleteItem(deleteConfirm);
                setDeleteConfirm(null);
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
