import { useCallback, useEffect, useMemo, useState } from 'react';
import { db } from '@/lib/db';
import type { GrowingSpace } from '@/types';
import { useGardenStore, addEntityToGarden, removeEntityFromGarden, getGardenEntities } from '@/store/garden-store';
import { useOrderStore } from '@/store/order-store';

interface UseSpacesResult {
  spaces: GrowingSpace[];
  loading: boolean;
  addSpace: (space: Omit<GrowingSpace, 'id' | 'createdAt'>) => Promise<number>;
  updateSpace: (id: number, changes: Partial<GrowingSpace>) => Promise<void>;
  deleteSpace: (id: number) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useSpaces(sortBy?: 'custom' | 'name' | 'type' | 'createdAt'): UseSpacesResult {
  const [spaces, setSpaces] = useState<GrowingSpace[]>([]);
  const [loading, setLoading] = useState(true);
  const activeGardenId = useGardenStore((s) => s.activeGardenId);
  const spaceOrder = useOrderStore((s) => s.spaceOrder);
  const addSpaceId = useOrderStore((s) => s.addSpaceId);
  const removeSpaceId = useOrderStore((s) => s.removeSpaceId);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await db.growingSpaces.toArray();
      if (activeGardenId) {
        const entities = getGardenEntities(activeGardenId);
        setSpaces(data.filter((s) => entities.spaceIds.includes(s.id!)));
      } else {
        setSpaces(data);
      }
    } finally {
      setLoading(false);
    }
  }, [activeGardenId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const sortedSpaces = useMemo(() => {
    if (!sortBy || sortBy === 'createdAt') {
      return [...spaces].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }
    if (sortBy === 'name') {
      return [...spaces].sort((a, b) => a.name.localeCompare(b.name));
    }
    if (sortBy === 'type') {
      return [...spaces].sort((a, b) => a.type.localeCompare(b.type));
    }
    if (sortBy === 'custom') {
      const orderMap = new Map(spaceOrder.map((id, idx) => [id, idx]));
      return [...spaces].sort((a, b) => {
        const aIdx = orderMap.get(a.id!);
        const bIdx = orderMap.get(b.id!);
        if (aIdx !== undefined && bIdx !== undefined) return aIdx - bIdx;
        if (aIdx !== undefined) return -1;
        if (bIdx !== undefined) return 1;
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      });
    }
    return spaces;
  }, [spaces, sortBy, spaceOrder]);

  const addSpace = useCallback(async (space: Omit<GrowingSpace, 'id' | 'createdAt'>) => {
    const id = await db.growingSpaces.add({
      ...space,
      createdAt: new Date(),
    });
    const gardenId = useGardenStore.getState().activeGardenId ?? 'default';
    addEntityToGarden(gardenId, 'spaceIds', id as number);
    addSpaceId(id as number);
    await refresh();
    return id as number;
  }, [refresh, addSpaceId]);

  const updateSpace = useCallback(async (id: number, changes: Partial<GrowingSpace>) => {
    await db.growingSpaces.update(id, changes);
    await refresh();
  }, [refresh]);

  const deleteSpace = useCallback(async (id: number) => {
    await db.transaction('rw', [db.growingSpaces, db.spacePlants, db.tasks, db.nutrientLogs, db.iotDevices], async () => {
      await db.growingSpaces.delete(id);
      await db.spacePlants.where('spaceId').equals(id).delete();
      await db.tasks.where('spaceId').equals(id).delete();
      await db.nutrientLogs.where('spaceId').equals(id).delete();
      await db.iotDevices.where('spaceId').equals(id).delete();
    });
    const gardenId = useGardenStore.getState().activeGardenId ?? 'default';
    removeEntityFromGarden(gardenId, 'spaceIds', id);
    removeSpaceId(id);
    await refresh();
  }, [refresh, removeSpaceId]);

  return { spaces: sortedSpaces, loading, addSpace, updateSpace, deleteSpace, refresh };
}
