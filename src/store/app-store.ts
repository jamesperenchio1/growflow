import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface MqttConfig {
  brokerUrl: string;
  port: number;
  username: string;
  password: string;
  topicPattern: string;
  enabled: boolean;
}

interface AppState {
  location: { lat: number; lon: number; name: string };
  sidebarOpen: boolean;
  thaiHazardsEnabled: boolean;
  onboardingComplete: boolean;
  units: 'metric' | 'imperial';
  notificationsEnabled: boolean;
  tempUnit: 'celsius' | 'fahrenheit';
  mqttConfig: MqttConfig;
  setLocation: (location: { lat: number; lon: number; name: string }) => void;
  setSidebarOpen: (open: boolean) => void;
  toggleThaiHazards: () => void;
  setOnboardingComplete: (complete: boolean) => void;
  setUnits: (units: 'metric' | 'imperial') => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  setTempUnit: (unit: 'celsius' | 'fahrenheit') => void;
  setMqttConfig: (config: Partial<MqttConfig>) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      location: { lat: 13.7563, lon: 100.5018, name: 'Bangkok' },
      sidebarOpen: true,
      thaiHazardsEnabled: true,
      onboardingComplete: false,
      units: 'metric',
      notificationsEnabled: true,
      tempUnit: 'celsius',
      mqttConfig: {
        brokerUrl: '',
        port: 1883,
        username: '',
        password: '',
        topicPattern: 'growflow/{deviceId}/{sensorType}',
        enabled: false,
      },
      setLocation: (location) => set({ location }),
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
      toggleThaiHazards: () => set((s) => ({ thaiHazardsEnabled: !s.thaiHazardsEnabled })),
      setOnboardingComplete: (onboardingComplete) => set({ onboardingComplete }),
      setUnits: (units) => set({ units }),
      setNotificationsEnabled: (notificationsEnabled) => set({ notificationsEnabled }),
      setTempUnit: (tempUnit) => set({ tempUnit }),
      setMqttConfig: (mqttConfig) => set((s) => ({ mqttConfig: { ...s.mqttConfig, ...mqttConfig } })),
    }),
    { name: 'growflow-app-store' }
  )
);
