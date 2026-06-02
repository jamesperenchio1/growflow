"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
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
  Smartphone,
  QrCode,
  Link2,
  Unlink,
  Usb,
  Radio,
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useIoTDevices, DEVICE_TYPE_META } from "@/hooks/use-iot-devices";
import { useIoTPairingStore } from "@/store/iot-pairing-store";
import type { IoTDevice } from "@/types";
import type { DeviceReading } from "@/hooks/use-iot-devices";
import { useSpaces } from "@/hooks/use-spaces";
import { toast } from "sonner";
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

function generatePairingCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function generateDemoReading(type: IoTDevice["type"]): { value: number; unit: string } {
  const meta = DEVICE_TYPE_META[type];
  const range = meta.max - meta.min;
  const value = meta.min + Math.random() * range;
  return { value: Number(value.toFixed(2)), unit: meta.unit };
}

function PairDeviceDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { addPairedDevice, setMqttConfig, mqttConfig } = useIoTPairingStore();
  const [activeTab, setActiveTab] = useState("code");
  const [deviceType, setDeviceType] = useState<IoTDevice["type"]>('ph');
  const [deviceName, setDeviceName] = useState('');
  const [pairingCode, setPairingCode] = useState('');

  // USB state
  const [usbSupported, setUsbSupported] = useState(false);
  const [usbConnected, setUsbConnected] = useState(false);

  // MQTT form state
  const [mqttBroker, setMqttBroker] = useState(mqttConfig.brokerUrl);
  const [mqttPort, setMqttPort] = useState(String(mqttConfig.port));
  const [mqttUsername, setMqttUsername] = useState(mqttConfig.username);
  const [mqttPassword, setMqttPassword] = useState(mqttConfig.password);
  const [mqttTopic, setMqttTopic] = useState(mqttConfig.topicPattern);

  useEffect(() => {
    setUsbSupported(typeof navigator !== 'undefined' && 'serial' in navigator);
  }, []);

  useEffect(() => {
    if (open && activeTab === 'code' && !pairingCode) {
      setPairingCode(generatePairingCode());
    }
  }, [open, activeTab, pairingCode]);

  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setDeviceType('ph');
        setDeviceName('');
        setPairingCode('');
        setUsbConnected(false);
        setActiveTab('code');
      }, 300);
    }
  }, [open]);

  const handleSimulatePairing = () => {
    if (!deviceName.trim()) {
      toast.error('Please enter a device name');
      return;
    }
    const reading = generateDemoReading(deviceType);
    addPairedDevice({
      name: deviceName.trim(),
      type: deviceType,
      pairingCode,
      connected: true,
      lastReading: {
        value: reading.value,
        unit: reading.unit,
        timestamp: new Date().toISOString(),
      },
      connectionMethod: 'device-code',
    });
    toast.success(`${deviceName.trim()} paired successfully`);
    onOpenChange(false);
  };

  const handleUsbConnect = async () => {
    if (!deviceName.trim()) {
      toast.error('Please enter a device name');
      return;
    }
    try {
      // @ts-expect-error Web Serial API types may not be available
      const port = await navigator.serial.requestPort({});
      await port.open({ baudRate: 9600 });
      setUsbConnected(true);
      const reading = generateDemoReading(deviceType);
      addPairedDevice({
        name: deviceName.trim(),
        type: deviceType,
        pairingCode: 'USB',
        connected: true,
        lastReading: {
          value: reading.value,
          unit: reading.unit,
          timestamp: new Date().toISOString(),
        },
        connectionMethod: 'usb',
      });
      toast.success(`${deviceName.trim()} connected via USB`);
      onOpenChange(false);
    } catch (err) {
      toast.error('Failed to connect USB device');
    }
  };

  const handleMqttPair = () => {
    if (!deviceName.trim()) {
      toast.error('Please enter a device name');
      return;
    }
    if (!mqttBroker.trim()) {
      toast.error('Please enter a broker URL');
      return;
    }
    setMqttConfig({
      brokerUrl: mqttBroker.trim(),
      port: Number(mqttPort) || 1883,
      username: mqttUsername.trim(),
      password: mqttPassword,
      topicPattern: mqttTopic.trim(),
      enabled: true,
    });
    const reading = generateDemoReading(deviceType);
    addPairedDevice({
      name: deviceName.trim(),
      type: deviceType,
      pairingCode: 'MQTT',
      connected: true,
      lastReading: {
        value: reading.value,
        unit: reading.unit,
        timestamp: new Date().toISOString(),
      },
      connectionMethod: 'mqtt',
    });
    toast.success(`${deviceName.trim()} paired via MQTT`);
    onOpenChange(false);
  };

  const connectionMethodLabel: Record<string, string> = {
    'device-code': 'Device Code',
    usb: 'USB',
    mqtt: 'MQTT',
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Pair New Device</DialogTitle>
          <DialogDescription>
            Choose a pairing method to connect your sensor.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Device Name</label>
            <Input
              placeholder="e.g. Living Room Sensor"
              value={deviceName}
              onChange={(e) => setDeviceName(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Sensor Type</label>
            <Select value={deviceType} onChange={(e) => setDeviceType(e.target.value as IoTDevice["type"])}>
              <option value="ph">pH Sensor</option>
              <option value="ec">EC Sensor</option>
              <option value="temp">Temperature</option>
              <option value="humidity">Humidity</option>
              <option value="flow">Flow Meter</option>
              <option value="light">Light Sensor</option>
              <option value="co2">CO2 Sensor</option>
            </Select>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="code">
              <Smartphone className="size-3.5 mr-1.5" />
              Device Code
            </TabsTrigger>
            <TabsTrigger value="usb">
              <Usb className="size-3.5 mr-1.5" />
              USB
            </TabsTrigger>
            <TabsTrigger value="mqtt">
              <Radio className="size-3.5 mr-1.5" />
              MQTT
            </TabsTrigger>
          </TabsList>

          <TabsContent value="code" className="space-y-4">
            <div className="py-4 flex flex-col items-center gap-4">
              <p className="text-sm text-muted-foreground text-center">
                Enter this code on your device or scan the QR code
              </p>
              <div className="text-4xl font-bold tracking-widest font-mono bg-muted rounded-lg px-6 py-3">
                {pairingCode}
              </div>
              <div className="bg-white p-3 rounded-lg border">
                <QrCode className="size-24 text-slate-900" />
              </div>
              <Button
                className="bg-emerald-600 hover:bg-emerald-700"
                onClick={handleSimulatePairing}
              >
                <CheckCircle2 className="size-4 mr-2" />
                Simulate Paired Device
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="usb" className="space-y-4">
            <div className="py-4 space-y-4">
              {!usbSupported && (
                <div className="rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 p-3 text-sm text-amber-800 dark:text-amber-200">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="size-4 mt-0.5 shrink-0" />
                    <p>
                      Your browser does not support the Web Serial API. Please use Chrome, Edge, or Opera on desktop.
                    </p>
                  </div>
                </div>
              )}
              <p className="text-sm text-muted-foreground">
                Connect a USB sensor directly to your computer. Make sure the device is plugged in before clicking connect.
              </p>
              <Button
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                onClick={handleUsbConnect}
                disabled={!usbSupported}
              >
                <Usb className="size-4 mr-2" />
                Connect USB Sensor
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="mqtt" className="space-y-4">
            <div className="py-2 space-y-3">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Broker URL</label>
                <Input
                  placeholder="mqtt.example.com"
                  value={mqttBroker}
                  onChange={(e) => setMqttBroker(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Port</label>
                <Input
                  type="number"
                  value={mqttPort}
                  onChange={(e) => setMqttPort(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Username</label>
                  <Input
                    placeholder="optional"
                    value={mqttUsername}
                    onChange={(e) => setMqttUsername(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Password</label>
                  <Input
                    type="password"
                    placeholder="optional"
                    value={mqttPassword}
                    onChange={(e) => setMqttPassword(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Topic Pattern</label>
                <Input
                  value={mqttTopic}
                  onChange={(e) => setMqttTopic(e.target.value)}
                />
              </div>
              <Button
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                onClick={handleMqttPair}
              >
                <Radio className="size-4 mr-2" />
                Pair MQTT Device
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
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
  const {
    pairedDevices,
    removePairedDevice,
    updateDeviceConnection,
    updateDeviceReading,
  } = useIoTPairingStore();
  const { spaces } = useSpaces();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [pairDialogOpen, setPairDialogOpen] = useState(false);
  const [formName, setFormName] = useState("");
  const [formType, setFormType] = useState<IoTDevice["type"]>("ph");
  const [formMin, setFormMin] = useState("");
  const [formMax, setFormMax] = useState("");
  const [formSpaceId, setFormSpaceId] = useState("");

  const stats = useMemo(() => {
    const total = devices.length + pairedDevices.length;
    const connected = devices.filter((d) => d.connected).length + pairedDevices.filter((d) => d.connected).length;
    const alerts = devices.filter((d) => d.connected && isOutOfRange(d)).length;
    const lastUpdated = [
      ...devices.filter((d) => d.lastReading),
      ...pairedDevices.filter((d) => d.lastReading),
    ].sort(
      (a, b) =>
        new Date(b.lastReading!.timestamp).getTime() -
        new Date(a.lastReading!.timestamp).getTime()
    )[0]?.lastReading?.timestamp;
    return { total, connected, alerts, lastUpdated };
  }, [devices, pairedDevices]);

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

  const handleSimulatePairedReading = useCallback(
    (id: string, type: IoTDevice["type"]) => {
      const reading = generateDemoReading(type);
      updateDeviceReading(id, reading);
    },
    [updateDeviceReading]
  );

  const allDevices = useMemo(() => {
    const dexie = devices.map((d) => ({ ...d, _source: 'dexie' as const }));
    const paired = pairedDevices.map((d) => ({
      id: d.id,
      name: d.name,
      type: d.type as IoTDevice['type'],
      connected: d.connected,
      lastReading: d.lastReading
        ? {
            value: d.lastReading.value,
            unit: d.lastReading.unit,
            timestamp: new Date(d.lastReading.timestamp),
          }
        : undefined,
      thresholdMin: DEVICE_TYPE_META[d.type as IoTDevice['type']]?.min,
      thresholdMax: DEVICE_TYPE_META[d.type as IoTDevice['type']]?.max,
      _source: 'paired' as const,
      _connectionMethod: d.connectionMethod,
    }));
    return [...dexie, ...paired];
  }, [devices, pairedDevices]);

  const connectionMethodLabel: Record<string, string> = {
    'device-code': 'Device Code',
    usb: 'USB',
    mqtt: 'MQTT',
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
            <Button
              size="sm"
              variant="outline"
              className="gap-2"
              onClick={() => setPairDialogOpen(true)}
            >
              <Smartphone className="size-4" />
              Pair New Device
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
                  ? typeof stats.lastUpdated === "string"
                    ? new Date(stats.lastUpdated).toLocaleTimeString()
                    : stats.lastUpdated.toLocaleTimeString()
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
        {allDevices.length === 0 && !loading ? (
          <Card className="shadow-sm">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="icon-circle size-20 bg-emerald-100 dark:bg-emerald-950/30 mb-5">
                <Cpu className="size-10 text-emerald-500" />
              </div>
              <p className="text-lg font-semibold">No devices connected</p>
              <p className="text-sm text-muted-foreground mt-2 max-w-sm">
                Add your first sensor to start monitoring pH, EC, temperature, and more.
              </p>
              <div className="flex items-center gap-2 mt-5">
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2"
                  onClick={() => setPairDialogOpen(true)}
                >
                  <Smartphone className="size-4" />
                  Pair Device
                </Button>
                <Button
                  size="sm"
                  className="gap-2 bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => setDialogOpen(true)}
                >
                  <Plus className="size-4" />
                  Add Device
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {allDevices.map((device) => {
              const isPaired = "_source" in device && device._source === "paired";
              const typeKey = device.type;
              const meta = DEVICE_TYPE_META[typeKey];
              const alert = !isPaired && isOutOfRange(device as IoTDevice);
              const deviceHistory = !isPaired ? history.get(device.id as number) ?? [] : [];

              return (
                <Card
                  key={isPaired ? (device.id as string) : (device.id as number)}
                  className="border-0 shadow-sm card-hover"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={cn(
                            "icon-circle size-10",
                            typeColors[typeKey]
                          )}
                        >
                          {typeIcons[typeKey]}
                        </div>
                        <div>
                          <CardTitle className="text-sm">{device.name}</CardTitle>
                          <CardDescription>{meta.label}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {!isPaired && alert && (
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
                    {isPaired && (
                      <Badge variant="outline" className="text-[10px] w-fit mt-1 gap-1">
                        <Link2 className="size-3" />
                        Paired via {connectionMethodLabel[(device as unknown as { _connectionMethod: string })._connectionMethod]}
                      </Badge>
                    )}
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
                              {typeof device.lastReading.timestamp === "string"
                                ? new Date(device.lastReading.timestamp).toLocaleTimeString()
                                : device.lastReading.timestamp.toLocaleTimeString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {!isPaired && (
                      <IoTChart
                        history={deviceHistory}
                        thresholdMin={(device as IoTDevice).thresholdMin ?? meta.min}
                        thresholdMax={(device as IoTDevice).thresholdMax ?? meta.max}
                        alert={alert as boolean}
                      />
                    )}

                    {!isPaired && (
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>
                          Range: {(device as IoTDevice).thresholdMin ?? meta.min} -{" "}
                          {(device as IoTDevice).thresholdMax ?? meta.max} {meta.unit}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 pt-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs gap-1 flex-1"
                        onClick={() => {
                          if (isPaired) {
                            handleSimulatePairedReading(device.id as string, typeKey);
                          } else {
                            simulateDeviceReading(device.id as number);
                          }
                        }}
                        disabled={!device.connected}
                      >
                        <BarChart3 className="size-3" />
                        Simulate Reading
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-foreground"
                        onClick={() => {
                          if (isPaired) {
                            updateDeviceConnection(device.id as string, !device.connected);
                          } else {
                            toggleConnected(device.id as number);
                          }
                        }}
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
                        onClick={() => {
                          if (isPaired) {
                            removePairedDevice(device.id as string);
                          } else {
                            deleteDevice(device.id as number);
                          }
                        }}
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

      <PairDeviceDialog open={pairDialogOpen} onOpenChange={setPairDialogOpen} />
    </PageShell>
  );
}
