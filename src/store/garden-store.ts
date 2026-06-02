import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type GardenType = 'indoor' | 'outdoor' | 'greenhouse' | 'balcony' | 'farm';

export interface Garden {
  id: string;
  name: string;
  location: string;
  description?: string;
  type: GardenType;
  createdAt: string;
}

export interface GardenEntityMap {
  plantIds: number[];
  spaceIds: number[];
  taskIds: number[];
  deviceIds: number[];
}

const GARDEN_ENTITY_KEY = 'growflow-garden-entities';

function getDefaultGarden(): Garden {
  return {
    id: 'default',
    name: 'Default Garden',
    location: 'Home',
    type: 'outdoor',
    createdAt: new Date().toISOString(),
  };
}

function loadEntityMap(): Record<string, GardenEntityMap> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(GARDEN_ENTITY_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return {};
}

function saveEntityMap(map: Record<string, GardenEntityMap>) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(GARDEN_ENTITY_KEY, JSON.stringify(map));
}

export function getGardenEntities(gardenId: string): GardenEntityMap {
  const map = loadEntityMap();
  return map[gardenId] ?? { plantIds: [], spaceIds: [], taskIds: [], deviceIds: [] };
}

export function addEntityToGarden(gardenId: string, entityType: keyof GardenEntityMap, entityId: number) {
  const map = loadEntityMap();
  const entry = map[gardenId] ?? { plantIds: [], spaceIds: [], taskIds: [], deviceIds: [] };
  const list = entry[entityType];
  if (!list.includes(entityId)) {
    list.push(entityId);
  }
  map[gardenId] = entry;
  saveEntityMap(map);
}

export function removeEntityFromGarden(gardenId: string, entityType: keyof GardenEntityMap, entityId: number) {
  const map = loadEntityMap();
  const entry = map[gardenId];
  if (!entry) return;
  entry[entityType] = entry[entityType].filter((id) => id !== entityId);
  map[gardenId] = entry;
  saveEntityMap(map);
}

export function moveEntityToGarden(fromGardenId: string, toGardenId: string, entityType: keyof GardenEntityMap, entityId: number) {
  removeEntityFromGarden(fromGardenId, entityType, entityId);
  addEntityToGarden(toGardenId, entityType, entityId);
}

export function getEntityGardenId(entityType: keyof GardenEntityMap, entityId: number): string | null {
  const map = loadEntityMap();
  for (const [gardenId, entities] of Object.entries(map)) {
    if (entities[entityType].includes(entityId)) {
      return gardenId;
    }
  }
  return null;
}

export async function initDefaultGardenMappings(): Promise<void> {
  if (typeof window === 'undefined') return;
  const map = loadEntityMap();
  // If default garden already has mappings, assume init is done
  if (map['default'] && (
    map['default'].plantIds.length > 0 ||
    map['default'].spaceIds.length > 0 ||
    map['default'].taskIds.length > 0 ||
    map['default'].deviceIds.length > 0
  )) {
    return;
  }

  // Check if there are any entities in Dexie that aren't mapped
  const { db } = await import('@/lib/db');
  const [plants, spaces, tasks, devices] = await Promise.all([
    db.plants.toArray(),
    db.growingSpaces.toArray(),
    db.tasks.toArray(),
    db.iotDevices.toArray(),
  ]);

  const defaultEntry: GardenEntityMap = {
    plantIds: plants.map((p) => p.id!).filter(Boolean),
    spaceIds: spaces.map((s) => s.id!).filter(Boolean),
    taskIds: tasks.map((t) => t.id!).filter(Boolean),
    deviceIds: devices.map((d) => d.id!).filter(Boolean),
  };

  if (
    defaultEntry.plantIds.length > 0 ||
    defaultEntry.spaceIds.length > 0 ||
    defaultEntry.taskIds.length > 0 ||
    defaultEntry.deviceIds.length > 0
  ) {
    map['default'] = defaultEntry;
    saveEntityMap(map);
  }
}

interface GardenState {
  gardens: Garden[];
  activeGardenId: string | null;
  addGarden: (garden: Omit<Garden, 'id' | 'createdAt'>) => void;
  updateGarden: (id: string, changes: Partial<Garden>) => void;
  deleteGarden: (id: string) => void;
  setActiveGarden: (id: string) => void;
  getActiveGarden: () => Garden | null;
}

export const useGardenStore = create<GardenState>()(
  persist(
    (set, get) => ({
      gardens: [],
      activeGardenId: null,
      addGarden: (garden) => {
        const newGarden: Garden = {
          ...garden,
          id: `garden-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          gardens: [...state.gardens, newGarden],
          activeGardenId: state.activeGardenId ?? newGarden.id,
        }));
      },
      updateGarden: (id, changes) => {
        set((state) => ({
          gardens: state.gardens.map((g) => (g.id === id ? { ...g, ...changes } : g)),
        }));
      },
      deleteGarden: (id) => {
        const map = loadEntityMap();
        const entities = map[id];
        // Move all entities to default garden
        if (entities) {
          const defaultEntry = map['default'] ?? { plantIds: [], spaceIds: [], taskIds: [], deviceIds: [] };
          defaultEntry.plantIds.push(...entities.plantIds);
          defaultEntry.spaceIds.push(...entities.spaceIds);
          defaultEntry.taskIds.push(...entities.taskIds);
          defaultEntry.deviceIds.push(...entities.deviceIds);
          map['default'] = defaultEntry;
          delete map[id];
          saveEntityMap(map);
        }
        set((state) => {
          const remaining = state.gardens.filter((g) => g.id !== id);
          let nextActive = state.activeGardenId;
          if (state.activeGardenId === id) {
            nextActive = remaining.length > 0 ? remaining[0].id : null;
          }
          return { gardens: remaining, activeGardenId: nextActive };
        });
      },
      setActiveGarden: (id) => set({ activeGardenId: id }),
      getActiveGarden: () => {
        const state = get();
        return state.gardens.find((g) => g.id === state.activeGardenId) ?? null;
      },
    }),
    {
      name: 'growflow-garden-store',
      onRehydrateStorage: () => (state) => {
        if (state && state.gardens.length === 0) {
          const defaultGarden = getDefaultGarden();
          state.gardens = [defaultGarden];
          state.activeGardenId = defaultGarden.id;
        }
      },
    }
  )
);
