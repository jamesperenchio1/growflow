'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { db } from '@/lib/db';
import type { Plant, Task, GrowingSpace } from '@/types';
import { seedPlants } from '@/data/seed-plants';
import { pestsAndDiseases } from '@/data/pests-diseases';
import { growingSystems } from '@/data/systems-guide';
import { nutrientBrands } from '@/data/nutrients';

export interface SearchResult {
  id: string;
  type: 'page' | 'plant' | 'task' | 'space' | 'reference';
  title: string;
  subtitle: string;
  icon: string;
  href?: string;
  action?: () => void;
}

const pageResults: SearchResult[] = [
  { id: 'page-dashboard', type: 'page', title: 'Dashboard', subtitle: 'Your garden at a glance', icon: 'LayoutDashboard', href: '/' },
  { id: 'page-planner', type: 'page', title: 'Planner', subtitle: 'Manage growing spaces', icon: 'Grid3x3', href: '/planner' },
  { id: 'page-plants', type: 'page', title: 'My Plants', subtitle: 'Track and manage your crops', icon: 'Leaf', href: '/plants' },
  { id: 'page-tasks', type: 'page', title: 'Tasks', subtitle: 'Stay on top of your garden care', icon: 'CheckCircle2', href: '/tasks' },
  { id: 'page-calendar', type: 'page', title: 'Calendar', subtitle: 'Tasks and plantings schedule', icon: 'CalendarDays', href: '/calendar' },
  { id: 'page-nutrients', type: 'page', title: 'Nutrients', subtitle: 'EC, pH, and NPK guidance', icon: 'FlaskConical', href: '/nutrients' },
  { id: 'page-systems', type: 'page', title: 'Systems', subtitle: 'Compare growing methods', icon: 'Pipette', href: '/systems' },
  { id: 'page-iot', type: 'page', title: 'IoT Monitoring', subtitle: 'Sensor tracking', icon: 'Cpu', href: '/iot' },
  { id: 'page-weather', type: 'page', title: 'Weather', subtitle: 'Forecast and conditions', icon: 'CloudSun', href: '/weather' },
  { id: 'page-learn', type: 'page', title: 'Learn', subtitle: 'Guides and references', icon: 'BookOpen', href: '/learn' },
  { id: 'page-companions', type: 'page', title: 'Companions', subtitle: 'Companion planting guide', icon: 'Flower2', href: '/companions' },
  { id: 'page-pests', type: 'page', title: 'Pests', subtitle: 'Pests and diseases reference', icon: 'Bug', href: '/pests' },
  { id: 'page-settings', type: 'page', title: 'Settings', subtitle: 'Preferences and configuration', icon: 'Settings', href: '/settings' },
];

function matchesQuery(text: string, query: string): boolean {
  return text.toLowerCase().includes(query.toLowerCase().trim());
}

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export function useGlobalSearch() {
  const [query, setQuery] = useState('');
  const [plants, setPlants] = useState<Plant[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [spaces, setSpaces] = useState<GrowingSpace[]>([]);
  const [loading, setLoading] = useState(true);

  const debouncedQuery = useDebounce(query, 200);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [p, t, s] = await Promise.all([
        db.plants.toArray(),
        db.tasks.toArray(),
        db.growingSpaces.toArray(),
      ]);
      setPlants(p);
      setTasks(t);
      setSpaces(s);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const results = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    if (!q) return [];

    const out: SearchResult[] = [];

    // Pages
    pageResults.forEach((r) => {
      if (matchesQuery(r.title, q) || matchesQuery(r.subtitle, q)) {
        out.push(r);
      }
    });

    // Plants
    plants.forEach((p) => {
      const text = `${p.name} ${p.variety ?? ''} ${p.category}`;
      if (matchesQuery(text, q)) {
        out.push({
          id: `plant-${p.id}`,
          type: 'plant',
          title: p.name,
          subtitle: [p.variety, p.category].filter(Boolean).join(' · '),
          icon: 'Sprout',
          href: `/plants/detail?id=${p.id}`,
        });
      }
    });

    // Tasks
    tasks.forEach((t) => {
      const text = `${t.title} ${t.type}`;
      if (matchesQuery(text, q)) {
        out.push({
          id: `task-${t.id}`,
          type: 'task',
          title: t.title,
          subtitle: `${t.type}${t.completed ? ' · Completed' : ''}`,
          icon: 'CheckSquare',
          href: '/tasks',
        });
      }
    });

    // Spaces
    spaces.forEach((s) => {
      const text = `${s.name} ${s.type} ${s.location ?? ''}`;
      if (matchesQuery(text, q)) {
        out.push({
          id: `space-${s.id}`,
          type: 'space',
          title: s.name,
          subtitle: [s.type, s.location].filter(Boolean).join(' · '),
          icon: 'MapPin',
          href: '/planner',
        });
      }
    });

    // Reference: seed plants
    seedPlants.forEach((sp) => {
      if (matchesQuery(sp.name, q) || matchesQuery(sp.category, q)) {
        out.push({
          id: `ref-seed-${sp.name}`,
          type: 'reference',
          title: sp.name,
          subtitle: `Seed plant · ${sp.category}`,
          icon: 'BookOpen',
          href: '/learn',
        });
      }
    });

    // Reference: pests/diseases
    pestsAndDiseases.forEach((pd) => {
      if (matchesQuery(pd.name, q)) {
        out.push({
          id: `ref-pd-${pd.id}`,
          type: 'reference',
          title: pd.name,
          subtitle: `${pd.category === 'pest' ? 'Pest' : 'Disease'} · ${pd.severity} severity`,
          icon: 'ShieldAlert',
          href: '/pests',
        });
      }
    });

    // Reference: growing systems
    growingSystems.forEach((gs) => {
      if (matchesQuery(gs.name, q) || matchesQuery(gs.description, q)) {
        out.push({
          id: `ref-sys-${gs.id}`,
          type: 'reference',
          title: gs.name,
          subtitle: `Growing system · ${gs.difficulty}`,
          icon: 'Pipette',
          href: '/systems',
        });
      }
    });

    // Reference: nutrient brands
    nutrientBrands.forEach((nb) => {
      if (matchesQuery(nb.name, q)) {
        out.push({
          id: `ref-nut-${nb.name}`,
          type: 'reference',
          title: nb.name,
          subtitle: `Nutrient brand · ${nb.country}`,
          icon: 'FlaskConical',
          href: '/nutrients',
        });
      }
    });

    return out;
  }, [debouncedQuery, plants, tasks, spaces]);

  return { query, setQuery, results, loading, refresh: loadData };
}

const RECENT_SEARCHES_KEY = 'growflow-recent-searches';

export function getRecentSearches(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(RECENT_SEARCHES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addRecentSearch(query: string) {
  if (typeof window === 'undefined' || !query.trim()) return;
  const existing = getRecentSearches();
  const updated = [query.trim(), ...existing.filter((s) => s.toLowerCase() !== query.trim().toLowerCase())].slice(0, 5);
  localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
}
