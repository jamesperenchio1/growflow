import { useCallback, useEffect, useRef, useState } from 'react';
import { db } from '@/lib/db';
import type { IoTDevice } from '@/types';
import { useGardenStore, addEntityToGarden, removeEntityFromGarden, getGardenEntities } from '@/store/garden-store';

export interface DeviceReading {
  value: number;
  unit: string;
  timestamp: Date;
}

export const DEVICE_TYPE_META: Record<
  IoTDevice['type'],
  { label: string; unit: string; min: number; max: number }
> = {
  ph: { label: 'pH Sensor', unit: 'pH', min: 5.5, max: 6.5 },
  ec: { label: 'EC Sensor', unit: 'mS/cm', min: 1.2, max: 2.5 },
  temp: { label: 'Temperature', unit: '°C', min: 18, max: 26 },
  humidity: { label: 'Humidity', unit: '%', min: 50, max: 70 },
  flow: { label: 'Flow Meter', unit: 'L/min', min: 1.0, max: 2.0 },
  light: { label: 'Light Sensor', unit: 'lux', min: 10000, max: 25000 },
  co2: { label: 'CO2 Sensor', unit: 'ppm', min: 800, max: 1200 },
};

function generateValue(type: IoTDevice['type']): number {
  const meta = DEVICE_TYPE_META[type];
  const range = meta.max - meta.min;
  const outOfRange = Math.random() < 0.15;
  if (!outOfRange) {
    return meta.min + Math.random() * range;
  }
  if (Math.random() < 0.5) {
    return meta.min - Math.random() * range * 0.3;
  }
  return meta.max + Math.random() * range * 0.3;
}

function createReading(type: IoTDevice['type']): DeviceReading {
  return {
    value: Number(generateValue(type).toFixed(2)),
    unit: DEVICE_TYPE_META[type].unit,
    timestamp: new Date(),
  };
}

function seedHistory(type: IoTDevice['type'], count = 5): DeviceReading[] {
  const now = Date.now();
  return Array.from({ length: count }, (_, i) => {
    const reading = createReading(type);
    reading.timestamp = new Date(now - (count - i) * 60000);
    return reading;
  });
}

interface UseIoTDevicesResult {
  devices: IoTDevice[];
  loading: boolean;
  history: Map<number, DeviceReading[]>;
  addDevice: (device: Omit<IoTDevice, 'id' | 'createdAt'>) => Promise<number>;
  updateDevice: (id: number, changes: Partial<IoTDevice>) => Promise<void>;
  deleteDevice: (id: number) => Promise<void>;
  toggleConnected: (id: number) => Promise<void>;
  refreshReadings: () => void;
  simulateDeviceReading: (id: number) => void;
}

export function useIoTDevices(): UseIoTDevicesResult {
  const [devices, setDevices] = useState<IoTDevice[]>([]);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<Map<number, DeviceReading[]>>(new Map());
  const seededRef = useRef(false);
  const activeGardenId = useGardenStore((s) => s.activeGardenId);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await db.iotDevices.toArray();
      if (activeGardenId) {
        const entities = getGardenEntities(activeGardenId);
        setDevices(data.filter((d) => entities.deviceIds.includes(d.id!)));
      } else {
        setDevices(data);
      }
    } finally {
      setLoading(false);
    }
  }, [activeGardenId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const seedDemoData = useCallback(async () => {
    if (seededRef.current) return;
    seededRef.current = true;
    const count = await db.iotDevices.count();
    if (count > 0) return;

    const now = new Date();
    const gardenId = useGardenStore.getState().activeGardenId ?? 'default';
    const demos: Omit<IoTDevice, 'id'>[] = [
      {
        name: 'Main Tank pH',
        type: 'ph',
        connected: true,
        thresholdMin: 5.5,
        thresholdMax: 6.5,
        lastReading: { value: 6.2, unit: 'pH', timestamp: now },
        createdAt: now,
      },
      {
        name: 'Reservoir EC',
        type: 'ec',
        connected: true,
        thresholdMin: 1.2,
        thresholdMax: 2.5,
        lastReading: { value: 1.8, unit: 'mS/cm', timestamp: now },
        createdAt: now,
      },
      {
        name: 'Grow Room Temp',
        type: 'temp',
        connected: true,
        thresholdMin: 18,
        thresholdMax: 26,
        lastReading: { value: 24.5, unit: '°C', timestamp: now },
        createdAt: now,
      },
    ];

    const newHistory = new Map<number, DeviceReading[]>();
    for (const demo of demos) {
      const id = await db.iotDevices.add(demo);
      addEntityToGarden(gardenId, 'deviceIds', id as number);
      newHistory.set(id as number, seedHistory(demo.type));
    }
    setHistory(newHistory);
    await refresh();
  }, [refresh]);

  useEffect(() => {
    seedDemoData();
  }, [seedDemoData]);

  const addDevice = useCallback(
    async (device: Omit<IoTDevice, 'id' | 'createdAt'>) => {
      const meta = DEVICE_TYPE_META[device.type];
      const enriched: Omit<IoTDevice, 'id'> = {
        ...device,
        thresholdMin: device.thresholdMin ?? meta.min,
        thresholdMax: device.thresholdMax ?? meta.max,
        connected: device.connected ?? true,
        createdAt: new Date(),
      };
      if (enriched.connected) {
        enriched.lastReading = createReading(device.type);
      }
      const id = await db.iotDevices.add(enriched);
      const gardenId = useGardenStore.getState().activeGardenId ?? 'default';
      addEntityToGarden(gardenId, 'deviceIds', id as number);
      if (enriched.lastReading) {
        setHistory((prev) => {
          const next = new Map(prev);
          next.set(id as number, [enriched.lastReading!]);
          return next;
        });
      }
      await refresh();
      return id as number;
    },
    [refresh]
  );

  const updateDevice = useCallback(
    async (id: number, changes: Partial<IoTDevice>) => {
      await db.iotDevices.update(id, changes);
      await refresh();
    },
    [refresh]
  );

  const deleteDevice = useCallback(
    async (id: number) => {
      await db.iotDevices.delete(id);
      setHistory((prev) => {
        const next = new Map(prev);
        next.delete(id);
        return next;
      });
      const gardenId = useGardenStore.getState().activeGardenId ?? 'default';
      removeEntityFromGarden(gardenId, 'deviceIds', id);
      await refresh();
    },
    [refresh]
  );

  const toggleConnected = useCallback(
    async (id: number) => {
      const device = devices.find((d) => d.id === id);
      if (!device) return;
      const nextConnected = !device.connected;
      const update: Partial<IoTDevice> = { connected: nextConnected };
      if (nextConnected) {
        const reading = createReading(device.type);
        update.lastReading = reading;
        setHistory((prev) => {
          const next = new Map(prev);
          const existing = next.get(id) ?? [];
          next.set(id, [...existing, reading]);
          return next;
        });
      }
      await db.iotDevices.update(id, update);
      await refresh();
    },
    [devices, refresh]
  );

  const simulateDeviceReading = useCallback(
    (id: number) => {
      const device = devices.find((d) => d.id === id);
      if (!device || !device.connected) return;
      const reading = createReading(device.type);
      db.iotDevices.update(id, { lastReading: reading });
      setHistory((prev) => {
        const next = new Map(prev);
        const existing = next.get(id) ?? [];
        next.set(id, [...existing.slice(-19), reading]);
        return next;
      });
      setDevices((prev) =>
        prev.map((d) => (d.id === id ? { ...d, lastReading: reading } : d))
      );
    },
    [devices]
  );

  const refreshReadings = useCallback(() => {
    devices.forEach((device) => {
      if (device.connected) {
        simulateDeviceReading(device.id!);
      }
    });
  }, [devices, simulateDeviceReading]);

  return {
    devices,
    loading,
    history,
    addDevice,
    updateDevice,
    deleteDevice,
    toggleConnected,
    refreshReadings,
    simulateDeviceReading,
  };
}
