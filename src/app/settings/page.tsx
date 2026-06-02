"use client";

import { MapPin, Ruler, Bell, AlertTriangle, Trash2, RefreshCw, Github } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/store/app-store";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const { location, units, thaiHazardsEnabled, setUnits, toggleThaiHazards, setLocation } = useAppStore();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefreshLocation = async () => {
    setRefreshing(true);
    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      setLocation({
        lat: pos.coords.latitude,
        lon: pos.coords.longitude,
        name: "Current Location",
      });
    } catch {
      // ignore
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <PageShell>
      <div className="space-y-5">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
          <p className="text-sm text-muted-foreground mt-1">Configure your garden preferences and app settings.</p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <div className="icon-circle size-9 bg-emerald-100 dark:bg-emerald-950/30">
                  <MapPin className="size-4 text-emerald-600" />
                </div>
                <div>
                  <CardTitle className="text-base">Location</CardTitle>
                  <CardDescription>Your garden location for weather and growing advice</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-xl border bg-muted/30 px-4 py-3">
                <p className="font-semibold text-sm">{location.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {location.lat.toFixed(4)}, {location.lon.toFixed(4)}
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={handleRefreshLocation} disabled={refreshing} className="gap-2">
                <RefreshCw className={cn(refreshing && "animate-spin")} size={14} />
                Detect Location
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <div className="icon-circle size-9 bg-blue-100 dark:bg-blue-950/30">
                  <Ruler className="size-4 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-base">Units</CardTitle>
                  <CardDescription>Measurement preferences</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button
                  variant={units === "metric" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setUnits("metric")}
                  className={cn(units === "metric" && "bg-emerald-600 hover:bg-emerald-700")}
                >
                  Metric (°C, cm, g)
                </Button>
                <Button
                  variant={units === "imperial" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setUnits("imperial")}
                  className={cn(units === "imperial" && "bg-emerald-600 hover:bg-emerald-700")}
                >
                  Imperial (°F, in, oz)
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <div className="icon-circle size-9 bg-amber-100 dark:bg-amber-950/30">
                  <AlertTriangle className="size-4 text-amber-600" />
                </div>
                <div>
                  <CardTitle className="text-base">Thai Weather Hazards</CardTitle>
                  <CardDescription>Enable hazard warnings for Thai growing conditions</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between rounded-xl border px-4 py-3">
                <span className="text-sm font-medium">Enable hazard alerts</span>
                <Button
                  variant={thaiHazardsEnabled ? "default" : "outline"}
                  size="sm"
                  onClick={toggleThaiHazards}
                  className={cn(thaiHazardsEnabled && "bg-emerald-600 hover:bg-emerald-700")}
                >
                  {thaiHazardsEnabled ? "On" : "Off"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <div className="icon-circle size-9 bg-purple-100 dark:bg-purple-950/30">
                  <Bell className="size-4 text-purple-600" />
                </div>
                <div>
                  <CardTitle className="text-base">Notifications</CardTitle>
                  <CardDescription>Task and weather alerts</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Badge variant="secondary">Coming soon</Badge>
              <p className="mt-2 text-sm text-muted-foreground">
                Browser notification support will be added in a future update.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-red-200 dark:border-red-900/30 bg-red-50/30 dark:bg-red-950/10 border-0 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <div className="icon-circle size-9 bg-red-100 dark:bg-red-950/30">
                <Trash2 className="size-4 text-red-600" />
              </div>
              <div>
                <CardTitle className="text-base text-red-700 dark:text-red-300">Danger Zone</CardTitle>
                <CardDescription>Destructive actions that cannot be undone</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" size="sm">
              Clear All Data
            </Button>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
