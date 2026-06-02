import { useCallback, useEffect, useState } from 'react';
import { db } from '@/lib/db';
import type { SpacePlant } from '@/types';

interface UseSpacePlantsResult {
  spacePlants: SpacePlant[];
  loading: boolean;
  getSpacePlants: (spaceId: number) => Promise<SpacePlant[]>;
  addPlantToSpace: (spaceId: number, plantId: number, x: number, y: number, subX?: number, subY?: number) => Promise<number>;
  removePlantFromSpace: (id: number) => Promise<void>;
  movePlantInSpace: (id: number, x: number, y: number, subX?: number, subY?: number) => Promise<void>;
  refresh: (spaceId: number) => Promise<void>;
}

export function useSpacePlants(spaceId?: number): UseSpacePlantsResult {
  const [spacePlants, setSpacePlants] = useState<SpacePlant[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async (targetSpaceId: number) => {
    setLoading(true);
    try {
      const data = await db.spacePlants.where('spaceId').equals(targetSpaceId).toArray();
      setSpacePlants(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (spaceId !== undefined) {
      refresh(spaceId);
    } else {
      setSpacePlants([]);
      setLoading(false);
    }
  }, [spaceId, refresh]);

  const getSpacePlants = useCallback(async (targetSpaceId: number) => {
    const data = await db.spacePlants.where('spaceId').equals(targetSpaceId).toArray();
    return data;
  }, []);

  const addPlantToSpace = useCallback(async (targetSpaceId: number, plantId: number, x: number, y: number, subX?: number, subY?: number) => {
    const id = await db.spacePlants.add({
      spaceId: targetSpaceId,
      plantId,
      x,
      y,
      subX,
      subY,
      placedAt: new Date(),
    });
    if (spaceId !== undefined) await refresh(spaceId);
    return id;
  }, [spaceId, refresh]);

  const removePlantFromSpace = useCallback(async (id: number) => {
    await db.spacePlants.delete(id);
    if (spaceId !== undefined) await refresh(spaceId);
  }, [spaceId, refresh]);

  const movePlantInSpace = useCallback(async (id: number, x: number, y: number, subX?: number, subY?: number) => {
    await db.spacePlants.update(id, { x, y, subX, subY });
    if (spaceId !== undefined) await refresh(spaceId);
  }, [spaceId, refresh]);

  return { spacePlants, loading, getSpacePlants, addPlantToSpace, removePlantFromSpace, movePlantInSpace, refresh };
}
