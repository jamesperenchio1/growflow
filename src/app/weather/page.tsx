"use client";

import { useState } from "react";
import { CloudSun, Droplets, Wind, Thermometer, Eye, Sunrise, Sunset, Gauge, RefreshCw, CloudRain, Sun, Cloud, MapPin, AlertTriangle, ChevronDown, ChevronUp, Sprout, ThermometerSun, Timer } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertBanner } from "@/components/weather/alert-banner";
import { useWeather } from "@/hooks/use-weather";
import { getWeatherIcon, getWeatherDescription } from "@/lib/api/weather";
import { useAppStore } from "@/store/app-store";
import { cn } from "@/lib/utils";

function getThaiSeason(date: Date): string {
  const month = date.getMonth() + 1;
  if (month >= 11 || month <= 2) return 'Cool Season';
  if (month >= 3 && month <= 5) return 'Hot Season';
  return 'Rainy Season';
}

const severityConfig = {
  extreme: {
    border: 'border-l-rose-500',
    bg: 'bg-rose-50 dark:bg-rose-950',
    badge: 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300',
    label: 'Extreme',
    iconColor: 'text-rose-500',
  },
  high: {
    border: 'border-l-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-950',
    badge: 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
    label: 'High',
    iconColor: 'text-amber-500',
  },
  moderate: {
    border: 'border-l-yellow-400',
    bg: 'bg-yellow-50 dark:bg-yellow-950',
    badge: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-300',
    label: 'Moderate',
    iconColor: 'text-yellow-500',
  },
  low: {
    border: 'border-l-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-950',
    badge: 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300',
    label: 'Low',
    iconColor: 'text-blue-500',
  },
};

const hazardMitigation: Record<string, string> = {
  heatwave: 'Install shade cloth, increase watering frequency, mist during peak heat, avoid transplanting.',
  flooding: 'Ensure drainage channels are clear, raise containers, harvest mature crops before storms.',
  drought: 'Deep water early morning, apply thick mulch, avoid overhead watering to reduce evaporation.',
  fungal_risk: 'Space plants for airflow, water at soil level, apply preventive copper spray, remove infected material.',
  typhoon: 'Secure greenhouses, lower shade cloth, move containers to shelter, harvest mature produce.',
  monsoon: 'Prioritize drainage, use raised beds, cover sensitive crops, reduce nitrogen fertilizer.',
};

function calculateGrowingScore(current: {
  temperature: number;
  humidity: number;
  precipitation: number;
  uvIndex: number;
  windSpeed: number;
}): { score: number; recommendation: string; color: string; bgColor: string } {
  let score = 0;

  // Temperature: ideal 20-30°C = +3
  if (current.temperature >= 20 && current.temperature <= 30) score += 3;
  else if (current.temperature >= 15 && current.temperature <= 35) score += 2;
  else if (current.temperature >= 10 && current.temperature <= 38) score += 1;

  // Humidity: 50-70% = +2
  if (current.humidity >= 50 && current.humidity <= 70) score += 2;
  else if (current.humidity >= 40 && current.humidity <= 80) score += 1;

  // Rainfall: moderate = +2
  if (current.precipitation >= 0.5 && current.precipitation <= 5) score += 2;
  else if (current.precipitation >= 0.1 && current.precipitation <= 10) score += 1;

  // UV: moderate = +2
  if (current.uvIndex >= 3 && current.uvIndex <= 7) score += 2;
  else if (current.uvIndex >= 1 && current.uvIndex <= 9) score += 1;

  // Wind: low-moderate = +1
  if (current.windSpeed <= 15) score += 1;

  let recommendation = '';
  if (score >= 8) {
    recommendation = 'Great day for transplanting and outdoor work';
  } else if (score >= 6) {
    recommendation = 'Good growing conditions — maintain regular care';
  } else if (score >= 4) {
    recommendation = 'Fair conditions — watch for stress signals';
  } else if (score >= 2) {
    recommendation = 'High heat stress risk — prioritize shade and hydration';
  } else {
    recommendation = 'Poor conditions — delay transplanting and reduce exposure';
  }

  const color = score >= 8 ? 'text-emerald-600' : score >= 5 ? 'text-amber-600' : 'text-rose-600';
  const bgColor = score >= 8 ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/30' : score >= 5 ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/30' : 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/30';

  return { score, recommendation, color, bgColor };
}

export default function WeatherPage() {
  const { location } = useAppStore();
  const { weather, loading, error, refresh, alerts } = useWeather();
  const [expandedDays, setExpandedDays] = useState<Set<number>>(new Set());

  const season = getThaiSeason(new Date());

  const toggleDay = (i: number) => {
    setExpandedDays((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  const growingScore = weather
    ? calculateGrowingScore({
        temperature: weather.current.temperature,
        humidity: weather.current.humidity,
        precipitation: weather.current.precipitation,
        uvIndex: weather.current.uvIndex,
        windSpeed: weather.current.windSpeed,
      })
    : null;

  // Limit hourly to next 24 hours
  const hourlySlice = weather?.hourly
    ? {
        time: weather.hourly.time.slice(0, 24),
        temperature: weather.hourly.temperature.slice(0, 24),
        weatherCode: weather.hourly.weatherCode.slice(0, 24),
        precipitation: weather.hourly.precipitation.slice(0, 24),
        humidity: weather.hourly.humidity.slice(0, 24),
      }
    : null;

  return (
    <PageShell>
      <div className="space-y-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Weather</h2>
            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5">
              <MapPin className="size-3.5" />
              {location.name} — 7-day forecast
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={refresh} disabled={loading} className="gap-2">
            <RefreshCw className={cn(loading && "animate-spin")} size={16} />
            Refresh
          </Button>
        </div>

        {error && (
          <Card className="border-red-200 bg-red-50 dark:border-red-900/30 dark:bg-red-950 border-0">
            <CardContent className="py-8 text-center">
              <CloudSun className="size-10 text-red-400 mx-auto mb-3" />
              <p className="text-red-600 dark:text-red-400 font-medium">Failed to load weather data</p>
              <p className="text-sm text-red-500/70 dark:text-red-400/70 mt-1">Please check your connection and try again</p>
            </CardContent>
          </Card>
        )}

        {weather && (
          <>
            {/* Alert Banner */}
            {alerts.length > 0 && <AlertBanner alerts={alerts} />}

            <div className="grid gap-4 lg:grid-cols-3">
              {/* Main Weather Card */}
              <Card className="lg:col-span-2 border-0 shadow-sm gradient-blue">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                    <div className="flex items-center gap-5">
                      <span className="text-6xl">{getWeatherIcon(weather.current.weatherCode)}</span>
                      <div>
                        <div className="text-5xl font-bold tracking-tight">{Math.round(weather.current.temperature)}°C</div>
                        <p className="text-base text-muted-foreground mt-1">{getWeatherDescription(weather.current.weatherCode)}</p>
                        <p className="text-sm text-muted-foreground/70">Feels like {Math.round(weather.current.feelsLike)}°C</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                      <div className="flex items-center gap-2.5">
                        <div className="icon-circle size-8 bg-blue-100 dark:bg-blue-950/30">
                          <Droplets className="size-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Humidity</p>
                          <p className="font-semibold">{weather.current.humidity}%</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <div className="icon-circle size-8 bg-slate-100 dark:bg-slate-950/30">
                          <Wind className="size-4 text-slate-600" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Wind</p>
                          <p className="font-semibold">{weather.current.windSpeed} km/h</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <div className="icon-circle size-8 bg-purple-100 dark:bg-purple-950/30">
                          <Gauge className="size-4 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Pressure</p>
                          <p className="font-semibold">{Math.round(weather.current.pressure)} hPa</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <div className="icon-circle size-8 bg-amber-100 dark:bg-amber-950/30">
                          <Eye className="size-4 text-amber-600" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">UV Index</p>
                          <p className="font-semibold">{weather.current.uvIndex}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Sun Card */}
              <Card className="border-0 shadow-sm gradient-amber">
                <CardContent className="p-6 flex flex-col justify-center h-full">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="icon-circle size-10 bg-orange-100 dark:bg-orange-950/30">
                        <Sunrise className="size-5 text-orange-500" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Sunrise</p>
                        <p className="text-lg font-semibold">{new Date(weather.daily.sunrise[0]).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="icon-circle size-10 bg-indigo-100 dark:bg-indigo-950/30">
                        <Sunset className="size-5 text-indigo-500" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Sunset</p>
                        <p className="text-lg font-semibold">{new Date(weather.daily.sunset[0]).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Growing Conditions Score */}
            {growingScore && (
              <Card className={cn("border-0 shadow-sm border", growingScore.bgColor)}>
                <CardContent className="p-5">
                  <div className="flex items-center gap-4">
                    <div className={cn("text-5xl font-bold tracking-tight", growingScore.color)}>
                      {growingScore.score}
                      <span className="text-lg text-muted-foreground font-normal ml-1">/10</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold flex items-center gap-2">
                        <Sprout className="size-4 text-emerald-500" />
                        Growing Conditions Score
                      </p>
                      <p className="text-sm text-muted-foreground mt-0.5">{growingScore.recommendation}</p>
                    </div>
                    <div className="hidden sm:flex items-center gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <ThermometerSun className="size-3.5" />
                        {weather.current.temperature >= 20 && weather.current.temperature <= 30 ? '+3' : weather.current.temperature >= 15 && weather.current.temperature <= 35 ? '+2' : '+1'}
                      </div>
                      <div className="flex items-center gap-1">
                        <Droplets className="size-3.5" />
                        {weather.current.humidity >= 50 && weather.current.humidity <= 70 ? '+2' : '+1'}
                      </div>
                      <div className="flex items-center gap-1">
                        <CloudRain className="size-3.5" />
                        {weather.current.precipitation >= 0.5 && weather.current.precipitation <= 5 ? '+2' : '+1'}
                      </div>
                      <div className="flex items-center gap-1">
                        <Sun className="size-3.5" />
                        {weather.current.uvIndex >= 3 && weather.current.uvIndex <= 7 ? '+2' : '+1'}
                      </div>
                      <div className="flex items-center gap-1">
                        <Wind className="size-3.5" />
                        {weather.current.windSpeed <= 15 ? '+1' : '0'}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Weather Alerts Section */}
            {alerts.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Weather Alerts</h3>
                <div className="space-y-2">
                  {alerts.map((alert, idx) => {
                    const config = severityConfig[alert.severity];
                    return (
                      <Card
                        key={`${alert.type}-${idx}`}
                        className={cn('border-0 shadow-sm border-l-4', config.border, config.bg)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <AlertTriangle className={cn('size-5 shrink-0 mt-0.5', config.iconColor)} />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="font-semibold text-sm">{alert.title}</h4>
                                <Badge className={cn('text-[10px] px-1.5 py-0', config.badge)}>
                                  {config.label}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mt-0.5">{alert.description}</p>
                              <p className="text-xs mt-1.5 opacity-80">
                                <span className="font-medium">Recommended action:</span> {alert.farmingAction}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                <span className="font-medium">Mitigation tip:</span> {hazardMitigation[alert.type]}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* Weather Timeline for alerts */}
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-4">
                    <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <Timer className="size-4 text-amber-500" />
                      Hazard Timeline Today
                    </h4>
                    <div className="relative">
                      <div className="absolute left-3 top-0 bottom-0 w-px bg-border" />
                      <div className="space-y-3">
                        {alerts.map((alert, idx) => (
                          <div key={`timeline-${idx}`} className="flex items-start gap-3 pl-1">
                            <div className={cn(
                              "relative z-10 size-2.5 rounded-full mt-1.5 shrink-0",
                              alert.severity === 'extreme' ? 'bg-rose-500' :
                              alert.severity === 'high' ? 'bg-amber-500' :
                              alert.severity === 'moderate' ? 'bg-yellow-400' : 'bg-blue-400'
                            )} />
                            <div>
                              <p className="text-sm font-medium">{alert.title}</p>
                              <p className="text-xs text-muted-foreground">Peaks during the day — monitor conditions</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Seasonal Context */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="icon-circle size-9 bg-emerald-100 dark:bg-emerald-950/30">
                    <Sun className="size-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{season}</p>
                    <p className="text-xs text-muted-foreground">
                      {season === 'Hot Season' && 'High heat stress risk — prioritize shade and watering.'}
                      {season === 'Rainy Season' && 'Monsoon conditions — ensure drainage and watch for fungal issues.'}
                      {season === 'Cool Season' && 'Optimal growing conditions for leafy greens and herbs.'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Hourly Forecast */}
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Hourly Forecast</h3>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {hourlySlice?.time.map((t, i) => (
                  <Card key={t} className="min-w-[96px] flex-shrink-0 shadow-sm">
                    <CardContent className="flex flex-col items-center gap-1 p-3">
                      <span className="text-[11px] text-muted-foreground font-medium">
                        {new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                      <span className="text-2xl my-1">{getWeatherIcon(hourlySlice.weatherCode[i])}</span>
                      <span className="font-semibold text-sm">{Math.round(hourlySlice.temperature[i])}°</span>
                      <span className="text-[10px] text-blue-500 font-medium">{hourlySlice.precipitation[i]}%</span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* 7-Day Forecast */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">7-Day Forecast</h3>
              <div className="space-y-2">
                {weather.daily.time.map((t, i) => {
                  const expanded = expandedDays.has(i);
                  return (
                    <Card key={t} className="shadow-sm card-hover cursor-pointer" onClick={() => toggleDay(i)}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <span className="text-2xl">{getWeatherIcon(weather.daily.weatherCode[i])}</span>
                            <div>
                              <p className="font-medium text-sm">
                                {new Date(t).toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })}
                              </p>
                              <p className="text-xs text-muted-foreground">{getWeatherDescription(weather.daily.weatherCode[i])}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <p className="font-semibold text-sm">
                                {Math.round(weather.daily.temperatureMax[i])}° <span className="text-muted-foreground font-normal">/ {Math.round(weather.daily.temperatureMin[i])}°</span>
                              </p>
                              <div className="flex items-center justify-end gap-1 text-xs text-blue-500">
                                <CloudRain className="size-3" />
                                <span>{weather.daily.precipitationProbabilityMax[i]}%</span>
                              </div>
                            </div>
                            <div className="text-muted-foreground">
                              {expanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                            </div>
                          </div>
                        </div>
                        {expanded && (
                          <div className="mt-4 pt-4 border-t grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div className="flex items-center gap-2">
                              <Thermometer className="size-4 text-amber-500" />
                              <div>
                                <p className="text-xs text-muted-foreground">High / Low</p>
                                <p className="text-sm font-medium">{Math.round(weather.daily.temperatureMax[i])}° / {Math.round(weather.daily.temperatureMin[i])}°</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Sunrise className="size-4 text-orange-500" />
                              <div>
                                <p className="text-xs text-muted-foreground">Sunrise / Sunset</p>
                                <p className="text-sm font-medium">
                                  {new Date(weather.daily.sunrise[i]).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} / {new Date(weather.daily.sunset[i]).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <CloudRain className="size-4 text-blue-500" />
                              <div>
                                <p className="text-xs text-muted-foreground">Precipitation</p>
                                <p className="text-sm font-medium">{weather.daily.precipitationProbabilityMax[i]}% chance</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Wind className="size-4 text-slate-500" />
                              <div>
                                <p className="text-xs text-muted-foreground">Wind / UV</p>
                                <p className="text-sm font-medium">{Math.round(weather.daily.windSpeedMax[i])} km/h — UV {Math.round(weather.daily.uvIndexMax[i])}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </PageShell>
  );
}
