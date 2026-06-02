import { useCallback, useEffect, useState } from 'react';
import { db } from '@/lib/db';
import type { GrowingSpace } from '@/types';

interface UseSpacesResult {
  spaces: GrowingSpace[];
  loading: boolean;
  addSpace: (space: Omit<GrowingSpace, 'id' | 'createdAt'>) => Promise<number>;
  updateSpace: (id: number, changes: Partial<GrowingSpace>) => Promise<void>;
  deleteSpace: (id: number) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useSpaces(): UseSpacesResult {
  const [spaces, setSpaces] = useState<GrowingSpace[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await db.growingSpaces.toArray();
      setSpaces(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addSpace = useCallback(async (space: Omit<GrowingSpace, 'id' | 'createdAt'>) => {
    const id = await db.growingSpaces.add({
      ...space,
      createdAt: new Date(),
    });
    await refresh();
    return id;
  }, [refresh]);

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
    await refresh();
  }, [refresh]);

  return { spaces, loading, addSpace, updateSpace, deleteSpace, refresh };
}
