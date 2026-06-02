import type { Plant, GrowthStage } from '@/types';

const DEFAULT_DURATIONS: Record<GrowthStage, number> = {
  germination: 7,
  seedling: 14,
  vegetative: 28,
  flowering: 21,
  fruiting: 28,
  harvesting: 14,
};

interface GrowthPrediction {
  currentStage: GrowthStage;
  daysSincePlanted: number;
  nextMilestone: { stage: GrowthStage; daysUntil: number } | null;
  predictedHarvestDate: Date | null;
}

export function predictGrowth(plant: Plant): GrowthPrediction {
  const now = new Date();
  const planted = new Date(plant.plantedDate);
  const daysSincePlanted = Math.max(0, Math.floor((now.getTime() - planted.getTime()) / (1000 * 60 * 60 * 24)));

  // Try to find matching reference data from in-app defaults
  const ref = getPlantReferenceDefaults(plant.name, plant.category);

  const durations = {
    germination: ref?.daysToGermination ?? DEFAULT_DURATIONS.germination,
    seedling: ref?.daysToSeedling ?? DEFAULT_DURATIONS.seedling,
    vegetative: ref?.daysToVegetative ?? DEFAULT_DURATIONS.vegetative,
    flowering: ref?.daysToFlowering ?? DEFAULT_DURATIONS.flowering,
    fruiting: ref?.daysToFruiting ?? DEFAULT_DURATIONS.fruiting,
    harvesting: ref?.daysToHarvest ?? DEFAULT_DURATIONS.harvesting,
  };

  // Determine current stage based on cumulative days
  let cumulative = 0;
  const stages: GrowthStage[] = ['germination', 'seedling', 'vegetative', 'flowering', 'fruiting', 'harvesting'];
  let currentStage: GrowthStage = 'harvesting';
  let nextMilestone: { stage: GrowthStage; daysUntil: number } | null = null;

  for (const stage of stages) {
    cumulative += durations[stage];
    if (daysSincePlanted < cumulative) {
      currentStage = stage;
      nextMilestone = {
        stage: getNextStage(stage),
        daysUntil: cumulative - daysSincePlanted,
      };
      break;
    }
  }

  // If we've passed all stages, we're in harvesting
  if (daysSincePlanted >= cumulative) {
    currentStage = 'harvesting';
    nextMilestone = null;
  }

  // Predicted harvest date = plantedDate + total days to first harvest
  const totalDaysToHarvest = ref?.daysToHarvest ?? (
    DEFAULT_DURATIONS.germination +
    DEFAULT_DURATIONS.seedling +
    DEFAULT_DURATIONS.vegetative +
    DEFAULT_DURATIONS.flowering +
    DEFAULT_DURATIONS.fruiting
  );

  const predictedHarvestDate = new Date(planted);
  predictedHarvestDate.setDate(predictedHarvestDate.getDate() + totalDaysToHarvest);

  return {
    currentStage,
    daysSincePlanted,
    nextMilestone,
    predictedHarvestDate,
  };
}

function getNextStage(stage: GrowthStage): GrowthStage {
  const map: Record<GrowthStage, GrowthStage> = {
    germination: 'seedling',
    seedling: 'vegetative',
    vegetative: 'flowering',
    flowering: 'fruiting',
    fruiting: 'harvesting',
    harvesting: 'harvesting',
  };
  return map[stage];
}

// Simple fallback reference data for common plants
interface SimpleReference {
  daysToGermination: number;
  daysToSeedling: number;
  daysToVegetative: number;
  daysToFlowering: number;
  daysToFruiting: number;
  daysToHarvest: number;
}

function getPlantReferenceDefaults(name: string, category: string): SimpleReference | null {
  const key = name.toLowerCase().trim();

  const references: Record<string, SimpleReference> = {
    tomato: { daysToGermination: 7, daysToSeedling: 14, daysToVegetative: 30, daysToFlowering: 21, daysToFruiting: 28, daysToHarvest: 100 },
    lettuce: { daysToGermination: 5, daysToSeedling: 10, daysToVegetative: 14, daysToFlowering: 0, daysToFruiting: 0, daysToHarvest: 45 },
    basil: { daysToGermination: 5, daysToSeedling: 10, daysToVegetative: 21, daysToFlowering: 14, daysToFruiting: 0, daysToHarvest: 50 },
    pepper: { daysToGermination: 10, daysToSeedling: 14, daysToVegetative: 35, daysToFlowering: 21, daysToFruiting: 35, daysToHarvest: 115 },
    cucumber: { daysToGermination: 5, daysToSeedling: 10, daysToVegetative: 21, daysToFlowering: 14, daysToFruiting: 21, daysToHarvest: 71 },
    spinach: { daysToGermination: 5, daysToSeedling: 10, daysToVegetative: 14, daysToFlowering: 0, daysToFruiting: 0, daysToHarvest: 39 },
    strawberry: { daysToGermination: 14, daysToSeedling: 14, daysToVegetative: 30, daysToFlowering: 21, daysToFruiting: 28, daysToHarvest: 107 },
    mint: { daysToGermination: 7, daysToSeedling: 10, daysToVegetative: 14, daysToFlowering: 14, daysToFruiting: 0, daysToHarvest: 45 },
    kale: { daysToGermination: 5, daysToSeedling: 10, daysToVegetative: 21, daysToFlowering: 0, daysToFruiting: 0, daysToHarvest: 46 },
    bean: { daysToGermination: 7, daysToSeedling: 10, daysToVegetative: 21, daysToFlowering: 14, daysToFruiting: 14, daysToHarvest: 66 },
  };

  // Try exact match
  if (references[key]) return references[key];

  // Try partial match
  for (const [refKey, ref] of Object.entries(references)) {
    if (key.includes(refKey) || refKey.includes(key)) return ref;
  }

  // Category-based defaults
  if (category === 'herb') {
    return { daysToGermination: 5, daysToSeedling: 10, daysToVegetative: 18, daysToFlowering: 14, daysToFruiting: 0, daysToHarvest: 47 };
  }
  if (category === 'vegetable') {
    return { daysToGermination: 6, daysToSeedling: 12, daysToVegetative: 24, daysToFlowering: 18, daysToFruiting: 21, daysToHarvest: 81 };
  }
  if (category === 'fruit') {
    return { daysToGermination: 10, daysToSeedling: 14, daysToVegetative: 28, daysToFlowering: 21, daysToFruiting: 28, daysToHarvest: 101 };
  }
  if (category === 'flower') {
    return { daysToGermination: 7, daysToSeedling: 14, daysToVegetative: 21, daysToFlowering: 14, daysToFruiting: 0, daysToHarvest: 56 };
  }

  return null;
}
