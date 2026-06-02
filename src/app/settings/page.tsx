"use client";

import { MapPin, Ruler, Bell, AlertTriangle, Trash2, RefreshCw } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/store/app-store";
import { useState } from "react";

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
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">Configure your garden preferences and app settings.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="size-5 text-emerald-500" />
                Location
              </CardTitle>
              <CardDescription>Your garden location for weather and growing advice</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border bg-muted/30 px-4 py-3">
                <p className="font-medium">{location.name}</p>
                <p className="text-sm text-muted-foreground">
                  {location.lat.toFixed(4)}, {location.lon.toFixed(4)}
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={handleRefreshLocation} disabled={refreshing} className="gap-2">
                <RefreshCw className={refreshing ? "size-4 animate-spin" : "size-4"} />
                Detect Location
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ruler className="size-5 text-emerald-500" />
                Units
              </CardTitle>
              <CardDescription>Measurement preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button variant={units === "metric" ? "default" : "outline"} size="sm" onClick={() => setUnits("metric")}>
                  Metric (°C, cm, g)
                </Button>
                <Button variant={units === "imperial" ? "default" : "outline"} size="sm" onClick={() => setUnits("imperial")}>
                  Imperial (°F, in, oz)
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="size-5 text-amber-500" />
                Thai Weather Hazards
              </CardTitle>
              <CardDescription>Enable hazard warnings for Thai growing conditions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm">Enable hazard alerts</span>
                <Button
                  variant={thaiHazardsEnabled ? "default" : "outline"}
                  size="sm"
                  onClick={toggleThaiHazards}
                >
                  {thaiHazardsEnabled ? "On" : "Off"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="size-5 text-emerald-500" />
                Notifications
              </CardTitle>
              <CardDescription>Task and weather alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <Badge variant="outline">Coming soon</Badge>
              <p className="mt-2 text-sm text-muted-foreground">
                Browser notification support will be added in a future update.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="size-5" />
              Danger Zone
            </CardTitle>
            <CardDescription>Destructive actions that cannot be undone</CardDescription>
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
