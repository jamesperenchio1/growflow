import { useCallback, useEffect, useState } from 'react';
import { db } from '@/lib/db';
import type { Plant, LogEntry, Photo, YieldRecord, GrowingSpace } from '@/types';

export interface UsePlantDetailResult {
  plant: Plant | null;
  space: GrowingSpace | null;
  logs: LogEntry[];
  photos: Photo[];
  yields: YieldRecord[];
  loading: boolean;
  addLog: (log: Omit<LogEntry, 'id' | 'createdAt' | 'plantId'>) => Promise<void>;
  addPhoto: (photo: Omit<Photo, 'id' | 'createdAt'>) => Promise<void>;
  deletePhoto: (id: number) => Promise<void>;
  addYield: (yieldRecord: Omit<YieldRecord, 'id' | 'createdAt' | 'plantId'>) => Promise<void>;
  deleteYield: (id: number) => Promise<void>;
  updatePlantNotes: (notes: string) => Promise<void>;
  refresh: () => Promise<void>;
}

export function usePlantDetail(plantId: number): UsePlantDetailResult {
  const [plant, setPlant] = useState<Plant | null>(null);
  const [space, setSpace] = useState<GrowingSpace | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [yields, setYields] = useState<YieldRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!plantId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [p, l, ph, y] = await Promise.all([
        db.plants.get(plantId),
        db.logEntries.where('plantId').equals(plantId).reverse().sortBy('createdAt'),
        db.photos.where('plantId').equals(plantId).reverse().sortBy('createdAt'),
        db.yieldRecords.where('plantId').equals(plantId).reverse().sortBy('harvestedAt'),
      ]);
      setPlant(p ?? null);
      setLogs(l);
      setPhotos(ph);
      setYields(y);
      if (p?.spaceId) {
        const s = await db.growingSpaces.get(p.spaceId);
        setSpace(s ?? null);
      } else {
        setSpace(null);
      }
    } finally {
      setLoading(false);
    }
  }, [plantId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addLog = useCallback(async (log: Omit<LogEntry, 'id' | 'createdAt' | 'plantId'>) => {
    await db.logEntries.add({
      ...log,
      plantId,
      createdAt: new Date(),
    });
    await refresh();
  }, [plantId, refresh]);

  const addPhoto = useCallback(async (photo: Omit<Photo, 'id' | 'createdAt'>) => {
    await db.photos.add({
      ...photo,
      createdAt: new Date(),
    });
    await refresh();
  }, [refresh]);

  const deletePhoto = useCallback(async (id: number) => {
    await db.photos.delete(id);
    await refresh();
  }, [refresh]);

  const addYield = useCallback(async (yieldRecord: Omit<YieldRecord, 'id' | 'createdAt' | 'plantId'>) => {
    await db.yieldRecords.add({
      ...yieldRecord,
      plantId,
      createdAt: new Date(),
    });
    await refresh();
  }, [plantId, refresh]);

  const deleteYield = useCallback(async (id: number) => {
    await db.yieldRecords.delete(id);
    await refresh();
  }, [refresh]);

  const updatePlantNotes = useCallback(async (notes: string) => {
    await db.plants.update(plantId, { notes, updatedAt: new Date() });
    setPlant((prev) => (prev ? { ...prev, notes, updatedAt: new Date() } : prev));
  }, [plantId]);

  return {
    plant,
    space,
    logs,
    photos,
    yields,
    loading,
    addLog,
    addPhoto,
    deletePhoto,
    addYield,
    deleteYield,
    updatePlantNotes,
    refresh,
  };
}
