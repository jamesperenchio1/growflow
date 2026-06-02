"use client";

import { Cpu, Activity, Wifi, WifiOff, AlertTriangle } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const deviceTypes = [
  { type: "ph", name: "pH Sensor", unit: "pH", ideal: "5.5 - 6.5" },
  { type: "ec", name: "EC Sensor", unit: "mS/cm", ideal: "1.2 - 2.5" },
  { type: "temp", name: "Temperature", unit: "°C", ideal: "18 - 26" },
  { type: "humidity", name: "Humidity", unit: "%", ideal: "50 - 70" },
  { type: "flow", name: "Flow Meter", unit: "L/min", ideal: "1.0 - 2.0" },
  { type: "light", name: "Light Sensor", unit: "lux", ideal: "10,000+" },
  { type: "co2", name: "CO2 Sensor", unit: "ppm", ideal: "800 - 1200" },
] as const;

export default function IoTPage() {
  return (
    <PageShell>
      <div className="space-y-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">IoT Monitoring</h2>
            <p className="text-muted-foreground">Connect sensors to track your garden in real time.</p>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Wifi className="size-4" />
            Scan Devices
          </Button>
        </div>

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Cpu className="size-12 text-muted-foreground/50" />
            <p className="mt-3 font-medium">No devices connected</p>
            <p className="text-sm text-muted-foreground">
              IoT sensor integration is coming soon. You will be able to connect pH, EC, temperature, and humidity sensors.
            </p>
          </CardContent>
        </Card>

        <div>
          <h3 className="mb-3 text-lg font-semibold">Supported Sensors</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {deviceTypes.map((device) => (
              <Card key={device.type} className="opacity-60">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">{device.name}</CardTitle>
                    <WifiOff className="size-4 text-muted-foreground" />
                  </div>
                  <CardDescription>Ideal range: {device.ideal}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Activity className="size-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">No data</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Card className="border-amber-500/30 bg-amber-50/30 dark:bg-amber-950/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
              <AlertTriangle className="size-5" />
              Coming Soon
            </CardTitle>
            <CardDescription>
              IoT device integration will support Bluetooth LE and Wi-Fi sensors. Planned compatible hardware includes Atlas Scientific pH/EC probes, DHT22 temperature/humidity sensors, and TDS meters.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </PageShell>
  );
}
