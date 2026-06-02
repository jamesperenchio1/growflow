import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  location: { lat: number; lon: number; name: string };
  sidebarOpen: boolean;
  thaiHazardsEnabled: boolean;
  onboardingComplete: boolean;
  units: 'metric' | 'imperial';
  setLocation: (location: { lat: number; lon: number; name: string }) => void;
  setSidebarOpen: (open: boolean) => void;
  toggleThaiHazards: () => void;
  setOnboardingComplete: (complete: boolean) => void;
  setUnits: (units: 'metric' | 'imperial') => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      location: { lat: 13.7563, lon: 100.5018, name: 'Bangkok' },
      sidebarOpen: true,
      thaiHazardsEnabled: true,
      onboardingComplete: false,
      units: 'metric',
      setLocation: (location) => set({ location }),
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
      toggleThaiHazards: () => set((s) => ({ thaiHazardsEnabled: !s.thaiHazardsEnabled })),
      setOnboardingComplete: (onboardingComplete) => set({ onboardingComplete }),
      setUnits: (units) => set({ units }),
    }),
    { name: 'growflow-app-store' }
  )
);
