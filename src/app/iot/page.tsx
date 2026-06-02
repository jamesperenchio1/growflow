"use client";

import { useState, useMemo } from "react";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  CloudRain,
  Cpu,
  Droplets,
  Flame,
  Plus,
  RefreshCw,
  Sun,
  Thermometer,
  Trash2,
  Wifi,
  WifiOff,
  Wind,
  Waves,
  Zap,
} from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useIoTDevices, DEVICE_TYPE_META } from "@/hooks/use-iot-devices";
import type { IoTDevice } from "@/types";
import type { DeviceReading } from "@/hooks/use-iot-devices";
import { useSpaces } from "@/hooks/use-spaces";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";

const typeIcons: Record<IoTDevice["type"], React.ReactNode> = {
  ph: <Droplets className="size-5" />,
  ec: <Zap className="size-5" />,
  temp: <Thermometer className="size-5" />,
  humidity: <CloudRain className="size-5" />,
  flow: <Waves className="size-5" />,
  light: <Sun className="size-5" />,
  co2: <Wind className="size-5" />,
};

const typeColors: Record<IoTDevice["type"], string> = {
  ph: "text-blue-600 bg-blue-100 dark:bg-blue-950/30",
  ec: "text-purple-600 bg-purple-100 dark:bg-purple-950/30",
  temp: "text-amber-600 bg-amber-100 dark:bg-amber-950/30",
  humidity: "text-cyan-600 bg-cyan-100 dark:bg-cyan-950/30",
  flow: "text-emerald-600 bg-emerald-100 dark:bg-emerald-950/30",
  light: "text-yellow-600 bg-yellow-100 dark:bg-yellow-950/30",
  co2: "text-slate-600 bg-slate-100 dark:bg-slate-950/30",
};

function isOutOfRange(device: IoTDevice): boolean {
  if (!device.lastReading || device.thresholdMin == null || device.thresholdMax == null) return false;
  const v = device.lastReading.value;
  return v < device.thresholdMin || v > device.thresholdMax;
}

function IoTChart({
  history,
  thresholdMin,
  thresholdMax,
  alert,
}: {
  history: DeviceReading[];
  thresholdMin?: number;
  thresholdMax?: number;
  alert: boolean;
}) {
  if (history.length === 0) return null;
  const data = history.map((r) => ({
    time: r.timestamp.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    }),
    value: r.value,
  }));
  const color = alert ? "hsl(340 75% 55%)" : "hsl(158 64% 42%)";
  return (
    <ResponsiveContainer width="100%" height={90}>
      <LineChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="hsl(var(--border))"
          vertical={false}
        />
        <XAxis
          dataKey="time"
          tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }}
          axisLine={{ stroke: "hsl(var(--border))" }}
          tickLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }}
          axisLine={false}
          tickLine={false}
          width={30}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (!active || !payload || payload.length === 0) return null;
            return (
              <div className="rounded-md border bg-card px-2 py-1 shadow-sm">
                <p className="text-xs font-medium">{payload[0]?.value}</p>
              </div>
            );
          }}
        />
        {thresholdMin !== undefined && (
          <ReferenceLine
            y={thresholdMin}
            stroke="hsl(38 92% 50%)"
            strokeDasharray="3 3"
          />
        )}
        {thresholdMax !== undefined && (
          <ReferenceLine
            y={thresholdMax}
            stroke="hsl(38 92% 50%)"
            strokeDasharray="3 3"
          />
        )}
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default function IoTPage() {
  const {
    devices,
    loading,
    history,
    addDevice,
    deleteDevice,
    toggleConnected,
    refreshReadings,
    simulateDeviceReading,
  } = useIoTDevices();
  const { spaces } = useSpaces();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [formName, setFormName] = useState("");
  const [formType, setFormType] = useState<IoTDevice['type']>('ph');
  const [formMin, setFormMin] = useState("");
  const [formMax, setFormMax] = useState("");
  const [formSpaceId, setFormSpaceId] = useState("");

  const stats = useMemo(() => {
    const total = devices.length;
    const connected = devices.filter((d) => d.connected).length;
    const alerts = devices.filter((d) => d.connected && isOutOfRange(d)).length;
    const lastUpdated = devices
      .filter((d) => d.lastReading)
      .sort((a, b) => (b.lastReading!.timestamp.getTime() - a.lastReading!.timestamp.getTime()))[0]
      ?.lastReading?.timestamp;
    return { total, connected, alerts, lastUpdated };
  }, [devices]);

  const alertDevices = useMemo(
    () => devices.filter((d) => d.connected && isOutOfRange(d)),
    [devices]
  );

  const resetForm = () => {
    setFormName("");
    setFormType("ph");
    setFormMin("");
    setFormMax("");
    setFormSpaceId("");
  };

  const handleAdd = async () => {
    if (!formName.trim()) return;
    const meta = DEVICE_TYPE_META[formType];
    await addDevice({
      name: formName.trim(),
      type: formType,
      connected: true,
      thresholdMin: formMin !== "" ? Number(formMin) : meta.min,
      thresholdMax: formMax !== "" ? Number(formMax) : meta.max,
      spaceId: formSpaceId !== "" ? Number(formSpaceId) : undefined,
    });
    resetForm();
    setDialogOpen(false);
  };

  const handleTypeChange = (type: IoTDevice["type"]) => {
    setFormType(type);
    const meta = DEVICE_TYPE_META[type];
    setFormMin(String(meta.min));
    setFormMax(String(meta.max));
  };

  return (
    <PageShell>
      <div className="space-y-5 page-enter">
        {/* Header */}
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">IoT Monitoring</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Connect sensors to track your garden in real time.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={refreshReadings}
              disabled={loading}
            >
              <RefreshCw className={cn("size-4", loading && "animate-spin")} />
              Refresh Readings
            </Button>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2 bg-emerald-600 hover:bg-emerald-700">
                  <Plus className="size-4" />
                  Add Device
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add Sensor Device</DialogTitle>
                  <DialogDescription>
                    Configure a new sensor to monitor your growing environment.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Device Name</label>
                    <Input
                      placeholder="e.g. Main Tank pH"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Sensor Type</label>
                    <Select
                      value={formType}
                      onChange={(e) => handleTypeChange(e.target.value as IoTDevice["type"])}
                    >
                      <option value="ph">pH Sensor</option>
                      <option value="ec">EC Sensor</option>
                      <option value="temp">Temperature</option>
                      <option value="humidity">Humidity</option>
                      <option value="flow">Flow Meter</option>
                      <option value="light">Light Sensor</option>
                      <option value="co2">CO2 Sensor</option>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="grid gap-2">
                      <label className="text-sm font-medium">Threshold Min</label>
                      <Input
                        type="number"
                        step="any"
                        value={formMin}
                        onChange={(e) => setFormMin(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <label className="text-sm font-medium">Threshold Max</label>
                      <Input
                        type="number"
                        step="any"
                        value={formMax}
                        onChange={(e) => setFormMax(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Space (optional)</label>
                    <Select
                      value={formSpaceId}
                      onChange={(e) => setFormSpaceId(e.target.value)}
                    >
                      <option value="">None</option>
                      {spaces.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    className="bg-emerald-600 hover:bg-emerald-700"
                    onClick={handleAdd}
                    disabled={!formName.trim()}
                  >
                    Add Device
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-0 shadow-sm gradient-emerald">
            <CardHeader className="pb-2">
              <CardDescription className="text-emerald-700 dark:text-emerald-300">
                Total Devices
              </CardDescription>
              <CardTitle className="text-3xl">{stats.total}</CardTitle>
            </CardHeader>
            <CardContent>
              <Cpu className="size-4 text-emerald-600" />
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm gradient-slate">
            <CardHeader className="pb-2">
              <CardDescription className="text-slate-700 dark:text-slate-300">
                Connected
              </CardDescription>
              <CardTitle className="text-3xl">{stats.connected}</CardTitle>
            </CardHeader>
            <CardContent>
              <Wifi className="size-4 text-slate-600" />
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm gradient-rose">
            <CardHeader className="pb-2">
              <CardDescription className="text-rose-700 dark:text-rose-300">
                Alerts
              </CardDescription>
              <CardTitle className="text-3xl">{stats.alerts}</CardTitle>
            </CardHeader>
            <CardContent>
              <AlertTriangle className="size-4 text-rose-600" />
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm gradient-amber">
            <CardHeader className="pb-2">
              <CardDescription className="text-amber-700 dark:text-amber-300">
                Last Updated
              </CardDescription>
              <CardTitle className="text-lg">
                {stats.lastUpdated
                  ? stats.lastUpdated.toLocaleTimeString()
                  : "—"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Activity className="size-4 text-amber-600" />
            </CardContent>
          </Card>
        </div>

        {/* Alerts */}
        {alertDevices.length > 0 && (
          <Card className="border-0 shadow-sm border-l-4 border-l-rose-500 bg-rose-50/30 dark:bg-rose-950/10">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="icon-circle size-9 bg-rose-100 dark:bg-rose-950/30">
                  <AlertTriangle className="size-4 text-rose-600" />
                </div>
                <div>
                  <CardTitle className="text-base text-rose-700 dark:text-rose-300">
                    {alertDevices.length} device{alertDevices.length > 1 ? "s" : ""} out of range
                  </CardTitle>
                  <CardDescription>
                    {alertDevices.map((d) => d.name).join(", ")}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        )}

        {/* Device Grid */}
        {devices.length === 0 && !loading ? (
          <Card className="shadow-sm">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="icon-circle size-20 bg-emerald-100 dark:bg-emerald-950/30 mb-5">
                <Cpu className="size-10 text-emerald-500" />
              </div>
              <p className="text-lg font-semibold">No devices connected</p>
              <p className="text-sm text-muted-foreground mt-2 max-w-sm">
                Add your first sensor to start monitoring pH, EC, temperature, and more.
              </p>
              <Button
                size="sm"
                className="mt-5 gap-2 bg-emerald-600 hover:bg-emerald-700"
                onClick={() => setDialogOpen(true)}
              >
                <Plus className="size-4" />
                Add Device
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {devices.map((device) => {
              const meta = DEVICE_TYPE_META[device.type];
              const alert = isOutOfRange(device);
              const deviceHistory = history.get(device.id!) ?? [];
              return (
                <Card
                  key={device.id}
                  className="border-0 shadow-sm card-hover"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={cn(
                            "icon-circle size-10",
                            typeColors[device.type]
                          )}
                        >
                          {typeIcons[device.type]}
                        </div>
                        <div>
                          <CardTitle className="text-sm">{device.name}</CardTitle>
                          <CardDescription>{meta.label}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {alert && (
                          <Badge
                            variant="destructive"
                            className="text-[10px] px-1.5 py-0"
                          >
                            Alert
                          </Badge>
                        )}
                        <Badge
                          variant={device.connected ? "default" : "secondary"}
                          className={cn(
                            "text-[10px] px-1.5 py-0 gap-1",
                            device.connected
                              ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                              : "bg-muted text-muted-foreground"
                          )}
                        >
                          {device.connected ? (
                            <Wifi className="size-3" />
                          ) : (
                            <WifiOff className="size-3" />
                          )}
                          {device.connected ? "Connected" : "Offline"}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-end justify-between">
                      <div>
                        <div className="text-3xl font-bold tracking-tight">
                          {device.lastReading
                            ? device.lastReading.value.toFixed(2)
                            : "—"}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {meta.unit}
                          {device.lastReading && (
                            <span className="ml-2">
                              {device.lastReading.timestamp.toLocaleTimeString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <IoTChart
                      history={deviceHistory}
                      thresholdMin={device.thresholdMin ?? meta.min}
                      thresholdMax={device.thresholdMax ?? meta.max}
                      alert={alert}
                    />

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>
                        Range: {device.thresholdMin ?? meta.min} -{" "}
                        {device.thresholdMax ?? meta.max} {meta.unit}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs gap-1 flex-1"
                        onClick={() => simulateDeviceReading(device.id!)}
                        disabled={!device.connected}
                      >
                        <BarChart3 className="size-3" />
                        Simulate Reading
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-foreground"
                        onClick={() => toggleConnected(device.id!)}
                        title={device.connected ? "Disconnect" : "Connect"}
                      >
                        {device.connected ? (
                          <WifiOff className="size-3.5" />
                        ) : (
                          <Wifi className="size-3.5" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={() => deleteDevice(device.id!)}
                        title="Delete device"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </PageShell>
  );
}
