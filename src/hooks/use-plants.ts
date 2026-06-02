import { useCallback, useEffect, useState } from 'react';
import { db } from '@/lib/db';
import type { Plant } from '@/types';
import { useGardenStore, addEntityToGarden, removeEntityFromGarden, getGardenEntities } from '@/store/garden-store';

interface UsePlantsResult {
  plants: Plant[];
  loading: boolean;
  addPlant: (plant: Omit<Plant, 'id' | 'createdAt' | 'updatedAt'>) => Promise<number>;
  updatePlant: (id: number, changes: Partial<Plant>) => Promise<void>;
  deletePlant: (id: number) => Promise<void>;
  refresh: () => Promise<void>;
}

export function usePlants(): UsePlantsResult {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const activeGardenId = useGardenStore((s) => s.activeGardenId);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await db.plants.toArray();
      if (activeGardenId) {
        const entities = getGardenEntities(activeGardenId);
        setPlants(data.filter((p) => entities.plantIds.includes(p.id!)));
      } else {
        setPlants(data);
      }
    } finally {
      setLoading(false);
    }
  }, [activeGardenId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addPlant = useCallback(async (plant: Omit<Plant, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date();
    const id = await db.plants.add({
      ...plant,
      createdAt: now,
      updatedAt: now,
    });
    const gardenId = useGardenStore.getState().activeGardenId ?? 'default';
    addEntityToGarden(gardenId, 'plantIds', id as number);
    await db.logEntries.add({
      plantId: id,
      type: 'milestone',
      title: 'Plant added to garden',
      description: `${plant.name} was added to the garden.`,
      createdAt: now,
    });
    await refresh();
    return id as number;
  }, [refresh]);

  const updatePlant = useCallback(async (id: number, changes: Partial<Plant>) => {
    await db.plants.update(id, {
      ...changes,
      updatedAt: new Date(),
    });
    await refresh();
  }, [refresh]);

  const deletePlant = useCallback(async (id: number) => {
    await db.transaction('rw', [db.plants, db.photos, db.logEntries, db.tasks, db.spacePlants, db.yieldRecords], async () => {
      await db.plants.delete(id);
      await db.photos.where('plantId').equals(id).delete();
      await db.logEntries.where('plantId').equals(id).delete();
      await db.tasks.where('plantId').equals(id).delete();
      await db.spacePlants.where('plantId').equals(id).delete();
      await db.yieldRecords.where('plantId').equals(id).delete();
    });
    const gardenId = useGardenStore.getState().activeGardenId ?? 'default';
    removeEntityFromGarden(gardenId, 'plantIds', id);
    await refresh();
  }, [refresh]);

  return { plants, loading, addPlant, updatePlant, deletePlant, refresh };
}
