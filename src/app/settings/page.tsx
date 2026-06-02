"use client";

import { MapPin, Ruler, Bell, AlertTriangle, Trash2, RefreshCw, Github, Check, X, Send } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/store/app-store";
import { useNotifications } from "@/hooks/use-notifications";
import { useState } from "react";
import { cn } from "@/lib/utils";

function ToggleRow({
  label,
  enabled,
  onToggle,
  disabled,
}: {
  label: string;
  enabled: boolean;
  onToggle: () => void;
  disabled?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-xl border px-4 py-3",
        disabled && "opacity-50 pointer-events-none"
      )}
    >
      <span className="text-sm font-medium">{label}</span>
      <button
        onClick={onToggle}
        disabled={disabled}
        className={cn(
          "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2",
          enabled ? "bg-emerald-600" : "bg-gray-200 dark:bg-gray-700"
        )}
        role="switch"
        aria-checked={enabled}
      >
        <span
          className={cn(
            "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
            enabled ? "translate-x-6" : "translate-x-1"
          )}
        />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const { location, units, thaiHazardsEnabled, setUnits, toggleThaiHazards, setLocation } = useAppStore();
  const [refreshing, setRefreshing] = useState(false);
  const {
    permission,
    isSupported,
    settings,
    loading: notifLoading,
    requestPermission,
    send,
    updateSettings,
  } = useNotifications();

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

  const handleTestNotification = () => {
    const ok = send("🌱 GrowFlow Test", "Your notifications are working!");
    if (!ok) {
      alert("Notification blocked. Please enable permission first.");
    }
  };

  const canToggle = permission === "granted";

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
            <CardContent className="space-y-4">
              {!isSupported && (
                <div className="rounded-xl border bg-red-50 dark:bg-red-950/20 px-4 py-3">
                  <p className="text-sm text-red-700 dark:text-red-300 font-medium">Not Supported</p>
                  <p className="text-xs text-red-600/70 dark:text-red-400/70 mt-0.5">
                    Your browser does not support push notifications.
                  </p>
                </div>
              )}

              {isSupported && (
                <>
                  <div className="flex items-center justify-between rounded-xl border px-4 py-3">
                    <div>
                      <span className="text-sm font-medium">Browser Permission</span>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {permission === "granted"
                          ? "Notifications are enabled"
                          : permission === "denied"
                          ? "Notifications are blocked"
                          : "Permission not requested yet"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {permission === "granted" ? (
                        <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 gap-1">
                          <Check className="size-3" /> Granted
                        </Badge>
                      ) : permission === "denied" ? (
                        <Badge variant="destructive" className="gap-1">
                          <X className="size-3" /> Denied
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Default</Badge>
                      )}
                      {permission !== "granted" && (
                        <Button size="sm" onClick={requestPermission} className="bg-emerald-600 hover:bg-emerald-700">
                          Allow
                        </Button>
                      )}
                    </div>
                  </div>

                  <ToggleRow
                    label="Enable notifications"
                    enabled={settings.enabled}
                    onToggle={() => updateSettings({ enabled: !settings.enabled })}
                    disabled={!canToggle || notifLoading}
                  />

                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Alert Types</p>
                    <ToggleRow
                      label="Task reminders (daily at 8 AM)"
                      enabled={settings.taskReminders}
                      onToggle={() => updateSettings({ taskReminders: !settings.taskReminders })}
                      disabled={!canToggle || !settings.enabled || notifLoading}
                    />
                    <ToggleRow
                      label="Overdue task alerts"
                      enabled={settings.overdueTaskAlerts}
                      onToggle={() => updateSettings({ overdueTaskAlerts: !settings.overdueTaskAlerts })}
                      disabled={!canToggle || !settings.enabled || notifLoading}
                    />
                    <ToggleRow
                      label="IoT out-of-range alerts"
                      enabled={settings.iotOutOfRangeAlerts}
                      onToggle={() => updateSettings({ iotOutOfRangeAlerts: !settings.iotOutOfRangeAlerts })}
                      disabled={!canToggle || !settings.enabled || notifLoading}
                    />
                    <ToggleRow
                      label="Harvest window reminders"
                      enabled={settings.harvestWindowReminders}
                      onToggle={() => updateSettings({ harvestWindowReminders: !settings.harvestWindowReminders })}
                      disabled={!canToggle || !settings.enabled || notifLoading}
                    />
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={handleTestNotification}
                    disabled={!canToggle}
                  >
                    <Send className="size-3.5" />
                    Test Notification
                  </Button>
                </>
              )}
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
