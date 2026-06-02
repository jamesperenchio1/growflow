"use client";

import { Cpu, Activity, Wifi, WifiOff, AlertTriangle, Plus } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const deviceTypes = [
  { type: "ph", name: "pH Sensor", unit: "pH", ideal: "5.5 - 6.5", color: "bg-blue-100 text-blue-600" },
  { type: "ec", name: "EC Sensor", unit: "mS/cm", ideal: "1.2 - 2.5", color: "bg-purple-100 text-purple-600" },
  { type: "temp", name: "Temperature", unit: "°C", ideal: "18 - 26", color: "bg-amber-100 text-amber-600" },
  { type: "humidity", name: "Humidity", unit: "%", ideal: "50 - 70", color: "bg-cyan-100 text-cyan-600" },
  { type: "flow", name: "Flow Meter", unit: "L/min", ideal: "1.0 - 2.0", color: "bg-emerald-100 text-emerald-600" },
  { type: "light", name: "Light Sensor", unit: "lux", ideal: "10,000+", color: "bg-yellow-100 text-yellow-600" },
  { type: "co2", name: "CO2 Sensor", unit: "ppm", ideal: "800 - 1200", color: "bg-slate-100 text-slate-600" },
] as const;

export default function IoTPage() {
  return (
    <PageShell>
      <div className="space-y-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">IoT Monitoring</h2>
            <p className="text-sm text-muted-foreground mt-1">Connect sensors to track your garden in real time.</p>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Wifi className="size-4" />
            Scan Devices
          </Button>
        </div>

        <Card className="shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="icon-circle size-20 bg-emerald-100 dark:bg-emerald-950/30 mb-5">
              <Cpu className="size-10 text-emerald-500" />
            </div>
            <p className="text-lg font-semibold">No devices connected</p>
            <p className="text-sm text-muted-foreground mt-2 max-w-sm">
              IoT sensor integration is coming soon. You will be able to connect pH, EC, temperature, and humidity sensors.
            </p>
            <Button variant="outline" size="sm" className="mt-5 gap-2">
              <Plus className="size-4" />
              Add Device
            </Button>
          </CardContent>
        </Card>

        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Supported Sensors</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {deviceTypes.map((device) => (
              <Card key={device.type} className="shadow-sm opacity-60">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={cn("icon-circle size-9", device.color)}>
                        <Activity className="size-4" />
                      </div>
                      <CardTitle className="text-sm">{device.name}</CardTitle>
                    </div>
                    <WifiOff className="size-4 text-muted-foreground" />
                  </div>
                  <CardDescription>Ideal range: {device.ideal}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-full">No data</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Card className="border-amber-200 dark:border-amber-900/30 bg-amber-50/30 dark:bg-amber-950/10 border-0 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <div className="icon-circle size-9 bg-amber-100 dark:bg-amber-950/30">
                <AlertTriangle className="size-4 text-amber-600" />
              </div>
              <div>
                <CardTitle className="text-base text-amber-700 dark:text-amber-300">Coming Soon</CardTitle>
                <CardDescription>
                  IoT device integration will support Bluetooth LE and Wi-Fi sensors. Planned compatible hardware includes Atlas Scientific pH/EC probes, DHT22 temperature/humidity sensors, and TDS meters.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>
    </PageShell>
  );
}
