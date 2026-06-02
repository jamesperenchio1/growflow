"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface PairedDevice {
  id: string;
  name: string;
  type: string;
  pairingCode: string;
  pairedAt: string;
  connected: boolean;
  lastReading?: { value: number; unit: string; timestamp: string };
  connectionMethod: "device-code" | "usb" | "mqtt";
}

export interface MqttConfig {
  brokerUrl: string;
  port: number;
  username: string;
  password: string;
  topicPattern: string;
  enabled: boolean;
}

interface IoTPairingState {
  pairedDevices: PairedDevice[];
  mqttConfig: MqttConfig;
  addPairedDevice: (device: Omit<PairedDevice, "id" | "pairedAt">) => void;
  removePairedDevice: (id: string) => void;
  updateDeviceConnection: (id: string, connected: boolean) => void;
  updateDeviceReading: (id: string, reading: { value: number; unit: string }) => void;
  setMqttConfig: (config: Partial<MqttConfig>) => void;
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export const useIoTPairingStore = create<IoTPairingState>()(
  persist(
    (set) => ({
      pairedDevices: [],
      mqttConfig: {
        brokerUrl: "",
        port: 1883,
        username: "",
        password: "",
        topicPattern: "growflow/{deviceId}/{sensorType}",
        enabled: false,
      },
      addPairedDevice: (device) =>
        set((state) => ({
          pairedDevices: [
            ...state.pairedDevices,
            {
              ...device,
              id: generateId(),
              pairedAt: new Date().toISOString(),
            },
          ],
        })),
      removePairedDevice: (id) =>
        set((state) => ({
          pairedDevices: state.pairedDevices.filter((d) => d.id !== id),
        })),
      updateDeviceConnection: (id, connected) =>
        set((state) => ({
          pairedDevices: state.pairedDevices.map((d) =>
            d.id === id ? { ...d, connected } : d
          ),
        })),
      updateDeviceReading: (id, reading) =>
        set((state) => ({
          pairedDevices: state.pairedDevices.map((d) =>
            d.id === id
              ? {
                  ...d,
                  lastReading: {
                    value: reading.value,
                    unit: reading.unit,
                    timestamp: new Date().toISOString(),
                  },
                }
              : d
          ),
        })),
      setMqttConfig: (config) =>
        set((state) => ({
          mqttConfig: { ...state.mqttConfig, ...config },
        })),
    }),
    { name: "growflow-iot-pairing-store" }
  )
);
