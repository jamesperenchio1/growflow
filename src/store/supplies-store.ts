"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type SupplyCategory =
  | "nutrient"
  | "ph_buffer"
  | "seed"
  | "tool"
  | "medium"
  | "pest_control"
  | "other";

export interface SupplyItem {
  id: string;
  name: string;
  category: SupplyCategory;
  quantity: number;
  unit: string;
  minThreshold: number;
  expiryDate?: string;
  supplier?: string;
  cost?: number;
  currency?: string;
  notes?: string;
  lastUsed?: string;
  createdAt: string;
}

interface SuppliesState {
  items: SupplyItem[];
  addItem: (item: Omit<SupplyItem, "id" | "createdAt">) => void;
  updateItem: (id: string, changes: Partial<SupplyItem>) => void;
  deleteItem: (id: string) => void;
  useQuantity: (id: string, amount: number, notes?: string) => void;
  lowStockItems: () => SupplyItem[];
  expiringItems: () => SupplyItem[];
}

const demoData: SupplyItem[] = [
  {
    id: "supply-1",
    name: "General Hydroponics Flora Micro",
    category: "nutrient",
    quantity: 150,
    unit: "ml",
    minThreshold: 50,
    supplier: "General Hydroponics",
    cost: 18.99,
    currency: "USD",
    notes: "5-0-1 formula. Store in cool, dark place.",
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "supply-2",
    name: "pH Down Solution",
    category: "ph_buffer",
    quantity: 80,
    unit: "ml",
    minThreshold: 30,
    supplier: "General Hydroponics",
    cost: 12.5,
    currency: "USD",
    notes: "Phosphoric acid based. Handle with care.",
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "supply-3",
    name: "Buttercrunch Lettuce Seeds",
    category: "seed",
    quantity: 50,
    unit: "pcs",
    minThreshold: 10,
    supplier: "Baker Creek Heirloom Seeds",
    cost: 3.49,
    currency: "USD",
    expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    notes: "Heirloom variety. High germination rate.",
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "supply-4",
    name: "pH Up Solution",
    category: "ph_buffer",
    quantity: 200,
    unit: "ml",
    minThreshold: 40,
    supplier: "General Hydroponics",
    cost: 12.5,
    currency: "USD",
    notes: "Potassium hydroxide based.",
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export const useSuppliesStore = create<SuppliesState>()(
  persist(
    (set, get) => ({
      items: demoData,
      addItem: (item) =>
        set((state) => ({
          items: [
            ...state.items,
            {
              ...item,
              id: generateId(),
              createdAt: new Date().toISOString(),
            },
          ],
        })),
      updateItem: (id, changes) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, ...changes } : i
          ),
        })),
      deleteItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),
      useQuantity: (id, amount, notes) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id
              ? {
                  ...i,
                  quantity: Math.max(0, i.quantity - amount),
                  lastUsed: new Date().toISOString(),
                  notes: notes
                    ? `${i.notes ?? ""}\nUsed ${amount}${i.unit} on ${new Date().toLocaleDateString()}: ${notes}`.trim()
                    : i.notes,
                }
              : i
          ),
        })),
      lowStockItems: () => {
        const state = get();
        return state.items.filter((i) => i.quantity <= i.minThreshold);
      },
      expiringItems: () => {
        const state = get();
        const now = new Date();
        const thirtyDays = 30 * 24 * 60 * 60 * 1000;
        return state.items.filter((i) => {
          if (!i.expiryDate) return false;
          const expiry = new Date(i.expiryDate);
          const diff = expiry.getTime() - now.getTime();
          return diff <= thirtyDays && diff >= 0;
        });
      },
    }),
    { name: "growflow-supplies-store" }
  )
);
