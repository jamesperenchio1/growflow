"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserSystem, UserSystemStatus } from "@/types";

interface SystemsState {
  mySystems: UserSystem[];
  addSystem: (systemId: string, name: string) => void;
  updateStatus: (id: string, status: UserSystemStatus) => void;
  deleteSystem: (id: string) => void;
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export const useSystemsStore = create<SystemsState>()(
  persist(
    (set) => ({
      mySystems: [],
      addSystem: (systemId, name) =>
        set((state) => ({
          mySystems: [
            ...state.mySystems,
            {
              id: generateId(),
              systemId,
              name,
              status: "planning",
              dateAdded: new Date().toISOString(),
            },
          ],
        })),
      updateStatus: (id, status) =>
        set((state) => ({
          mySystems: state.mySystems.map((s) =>
            s.id === id ? { ...s, status } : s
          ),
        })),
      deleteSystem: (id) =>
        set((state) => ({
          mySystems: state.mySystems.filter((s) => s.id !== id),
        })),
    }),
    { name: "growflow-systems-store" }
  )
);
