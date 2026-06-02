/**
 * Perenual API client
 * Free tier: 100 requests/day, no key required for some endpoints
 * Sign up at https://perenual.com/docs/api for a key
 * 
 * When no API key is available, the app falls back to seed-plants.ts
 */

export interface PerenualPlant {
  id: number;
  common_name: string;
  scientific_name: string[];
  other_name: string[];
  family: string;
  origin: string[];
  type: string;
  cycle: string;
  watering: string;
  sunlight: string[];
  maintenance: string | null;
  care_level: string;
  growth_rate: string | null;
  drought_tolerant: boolean;
  salt_tolerant: boolean;
  thorny: boolean;
  invasive: boolean;
  tropical: boolean;
  indoor: boolean;
  edible_fruit: boolean;
  description: string;
  default_image?: {
    thumbnail: string;
    small_url: string;
    medium_url: string;
    regular_url: string;
  };
  hardiness?: { min: string; max: string };
  watering_general_benchmark?: { value: string; unit: string };
  pruning_month?: string[];
}

export interface PerenualPlantDetail extends PerenualPlant {
  flowering_season: string | null;
  fruiting_season: string | null;
  harvest_season: string | null;
  harvest_method: string | null;
  pest_susceptibility: string[];
  propagation: string[];
  soil: string[];
  poisonous_to_humans: boolean;
  poisonous_to_pets: boolean;
  medicinal: boolean;
  cuisine: boolean;
  dimension?: { type: string | null; min_value: number; max_value: number; unit: string };
}

const API_BASE = 'https://perenual.com/api';

function getKey(): string | undefined {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('perenual-api-key') ?? undefined;
  }
  return undefined;
}

export async function searchPerenualPlants(query: string, page = 1): Promise<{ data: PerenualPlant[]; total: number }> {
  const key = getKey();
  const url = key
    ? `${API_BASE}/species-list?key=${encodeURIComponent(key)}&q=${encodeURIComponent(query)}&page=${page}`
    : `${API_BASE}/species-list?q=${encodeURIComponent(query)}&page=${page}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Perenual API error: ${res.status}`);
  const json = await res.json();
  return { data: json.data ?? [], total: json.total ?? 0 };
}

export async function getPerenualPlantDetail(id: number): Promise<PerenualPlantDetail | null> {
  const key = getKey();
  const url = key
    ? `${API_BASE}/species/details/${id}?key=${encodeURIComponent(key)}`
    : `${API_BASE}/species/details/${id}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Perenual API error: ${res.status}`);
  const json = await res.json();
  return json ?? null;
}

export async function getPerenualCareGuide(id: number): Promise<Record<string, unknown> | null> {
  const key = getKey();
  const url = key
    ? `${API_BASE}/species-care-guide-list?key=${encodeURIComponent(key)}&species_id=${id}`
    : `${API_BASE}/species-care-guide-list?species_id=${id}`;

  const res = await fetch(url);
  if (!res.ok) return null;
  const json = await res.json();
  return json.data?.[0] ?? null;
}

export function setPerenualApiKey(key: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('perenual-api-key', key);
  }
}
