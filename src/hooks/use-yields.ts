import { useCallback, useEffect, useState } from 'react';
import { db } from '@/lib/db';
import type { YieldRecord, YieldReference } from '@/types';

// usePlantYields
interface UsePlantYieldsResult {
  yields: YieldRecord[];
  loading: boolean;
  refresh: () => Promise<void>;
}

export function usePlantYields(plantId: number): UsePlantYieldsResult {
  const [yields, setYields] = useState<YieldRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await db.yieldRecords.where('plantId').equals(plantId).reverse().sortBy('harvestedAt');
      setYields(data);
    } finally {
      setLoading(false);
    }
  }, [plantId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { yields, loading, refresh };
}

// useYieldReference
interface UseYieldReferenceResult {
  reference: YieldReference | null;
  loading: boolean;
}

export function useYieldReference(plantName: string): UseYieldReferenceResult {
  const [reference, setReference] = useState<YieldReference | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      const key = plantName.toLowerCase().trim();
      const refs = await db.yieldReferences.toArray();
      const match = refs.find(
        (r) =>
          r.plantName.toLowerCase() === key ||
          key.includes(r.plantName.toLowerCase()) ||
          r.plantName.toLowerCase().includes(key)
      );
      if (!cancelled) {
        setReference(match ?? null);
        setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [plantName]);

  return { reference, loading };
}

// calculateYieldRating
interface YieldRatingResult {
  totalYieldGrams: number;
  harvestCount: number;
  averageYieldGrams: number;
  rating: 'poor' | 'fair' | 'good' | 'excellent';
  percentOfExpected: number;
}

export function calculateYieldRating(
  records: YieldRecord[],
  expectedYieldGramsPerPlant: number
): YieldRatingResult {
  const totalYieldGrams = records.reduce((sum, r) => sum + r.amountGrams, 0);
  const harvestCount = records.length;
  const averageYieldGrams = harvestCount > 0 ? Math.round(totalYieldGrams / harvestCount) : 0;

  const percentOfExpected =
    expectedYieldGramsPerPlant > 0
      ? Math.round((averageYieldGrams / expectedYieldGramsPerPlant) * 100)
      : 0;

  let rating: YieldRatingResult['rating'] = 'fair';
  if (percentOfExpected >= 120) rating = 'excellent';
  else if (percentOfExpected >= 90) rating = 'good';
  else if (percentOfExpected >= 50) rating = 'fair';
  else rating = 'poor';

  return {
    totalYieldGrams,
    harvestCount,
    averageYieldGrams,
    rating,
    percentOfExpected,
  };
}
