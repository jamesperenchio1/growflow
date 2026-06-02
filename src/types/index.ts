export type PlantCategory = 'vegetable' | 'herb' | 'fruit' | 'flower' | 'ornamental' | 'medicinal';
export type GrowingMethod = 'soil' | 'hydroponic' | 'aeroponic' | 'aquaponic';
export type SpaceType = 'raised_bed' | 'container' | 'nft' | 'dwc' | 'ebb_flow' | 'dutch_bucket' | 'vertical_tower' | 'aquaponic' | 'aeroponic' | 'wicking' | 'kratky';
export type TaskType = 'water' | 'feed' | 'prune' | 'harvest' | 'check_ph_ec' | 'transplant' | 'pest_control' | 'custom';
export type HealthSeverity = 'low' | 'medium' | 'high';
export type GrowthStage = 'germination' | 'seedling' | 'vegetative' | 'flowering' | 'fruiting' | 'harvesting';

export interface Plant {
  id?: number;
  name: string;
  variety?: string;
  category: PlantCategory;
  growingMethod: GrowingMethod;
  spaceId?: number;
  plantedDate: Date;
  germinationDate?: Date;
  healthTags: HealthTag[];
  tags: string[];
  notes?: string;
  photoUrl?: string;
  quantity?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface HealthTag {
  category: string;
  value: string;
  severity: HealthSeverity;
  addedAt: Date;
}

export interface GrowingSpace {
  id?: number;
  name: string;
  type: SpaceType;
  widthCm?: number;
  heightCm?: number;
  depthCm?: number;
  location?: string;
  notes?: string;
  capacity?: number;
  gridRows?: number;
  gridCols?: number;
  subdividable?: boolean;
  createdAt: Date;
}

export interface SpacePlant {
  id?: number;
  spaceId: number;
  plantId: number;
  x: number;
  y: number;
  subX?: number;
  subY?: number;
  placedAt: Date;
}

export interface Photo {
  id?: number;
  plantId: number;
  dataUrl: string;
  type: 'plant' | 'seed_packet' | 'issue';
  caption?: string;
  createdAt: Date;
}

export interface LogEntry {
  id?: number;
  plantId: number;
  type: string;
  title: string;
  description?: string;
  value?: number;
  unit?: string;
  createdAt: Date;
}

export interface Task {
  id?: number;
  plantId?: number;
  spaceId?: number;
  type: TaskType;
  title: string;
  description?: string;
  dueDate: Date;
  completed: boolean;
  completedAt?: Date;
  recurring?: { interval: number; unit: 'days' | 'weeks' | 'months' };
  createdAt: Date;
}

export interface YieldRecord {
  id?: number;
  plantId: number;
  amountGrams: number;
  notes?: string;
  harvestedAt: Date;
  createdAt: Date;
}

export interface YieldReference {
  id?: number;
  plantName: string;
  category: PlantCategory;
  expectedYieldGramsPerPlant: number;
  daysToFirstHarvest: number;
  daysToLastHarvest: number;
  harvestsPerSeason: number;
  tips: string;
}

export interface NutrientLog {
  id?: number;
  spaceId: number;
  reservoirLiters: number;
  ecBefore?: number;
  ecAfter?: number;
  phBefore?: number;
  phAfter?: number;
  productsUsed: { name: string; ml: number }[];
  notes?: string;
  createdAt: Date;
}

export interface IoTDevice {
  id?: number;
  name: string;
  type: 'ph' | 'ec' | 'temp' | 'humidity' | 'flow' | 'light' | 'co2';
  connected: boolean;
  lastReading?: { value: number; unit: string; timestamp: Date };
  thresholdMin?: number;
  thresholdMax?: number;
  spaceId?: number;
  createdAt: Date;
}

export interface AppSettings {
  key: string;
  value: unknown;
}

export interface DailyWeather {
  time: string[];
  weatherCode: number[];
  temperatureMax: number[];
  temperatureMin: number[];
  precipitationSum: number[];
  precipitationProbabilityMax: number[];
  windSpeedMax: number[];
  uvIndexMax: number[];
  sunrise: string[];
  sunset: string[];
}

export interface WeatherData {
  current: {
    temperature: number;
    feelsLike: number;
    humidity: number;
    windSpeed: number;
    windDirection: number;
    weatherCode: number;
    precipitation: number;
    uvIndex: number;
    pressure: number;
    dewPoint: number;
    cloudCover: number;
  };
  hourly: {
    time: string[];
    temperature: number[];
    weatherCode: number[];
    precipitation: number[];
    humidity: number[];
  };
  daily: DailyWeather;
  history: DailyWeather;
}

export interface MoonPhase {
  phase: number;
  illumination: number;
  name: string;
  plantingAdvice: string;
}

export interface CompanionRelation {
  plantA: string;
  plantB: string;
  relationship: 'beneficial' | 'harmful' | 'neutral';
  reason: string;
}

export interface PlantReference {
  name: string;
  category: PlantCategory;
  imageUrl?: string;
  methods: GrowingMethod[];
  daysToGermination: number;
  daysToSeedling: number;
  daysToVegetative: number;
  daysToFlowering: number;
  daysToFruiting: number;
  daysToHarvest: number;
  spacingCm: number;
  sunHours: number;
  waterNeeds: 'low' | 'moderate' | 'high';
  companions: string[];
  antagonists: string[];
  commonPests: string[];
  commonDiseases: string[];
  nutrientTargets: Record<string, { ec: [number, number]; ph: [number, number]; npk: [number, number, number] }>;
}

export interface NutrientBrand {
  name: string;
  country: string;
  products: {
    name: string;
    type: 'base' | 'supplement' | 'ph_up' | 'ph_down';
    npk?: string;
    mlPerLiter: number;
    stages: GrowthStage[];
  }[];
}

export type HazardSeverity = 'extreme' | 'high' | 'moderate' | 'low';

export interface ThaiHazard {
  type: 'heatwave' | 'flooding' | 'drought' | 'fungal_risk' | 'typhoon' | 'monsoon';
  severity: HazardSeverity;
  title: string;
  description: string;
  farmingAction: string;
}

export type SystemDifficulty = 'beginner' | 'intermediate' | 'advanced';
export type MaintenanceLevel = 'low' | 'medium' | 'high';
export type SetupCost = 'low' | 'medium' | 'high';
export type YieldPotential = 'low' | 'medium' | 'high';
export type UserSystemStatus = 'planning' | 'building' | 'active';

export interface GrowingSystem {
  id: string;
  name: string;
  description: string;
  difficulty: SystemDifficulty;
  idealCrops: string[];
  pros: string[];
  cons: string[];
  setupCost: SetupCost;
  maintenanceLevel: MaintenanceLevel;
  yieldPotential: YieldPotential;
  materials: string[];
  setupSteps: string[];
}

export interface UserSystem {
  id: string;
  systemId: string;
  name: string;
  status: UserSystemStatus;
  dateAdded: string;
}
