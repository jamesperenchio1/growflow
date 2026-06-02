"use client";

import { CloudSun, Droplets, Wind, Thermometer, Eye, Sunrise, Sunset, Gauge, RefreshCw, CloudRain, Sun, Cloud, MapPin } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useWeather } from "@/hooks/use-weather";
import { getWeatherIcon, getWeatherDescription } from "@/lib/api/weather";
import { useAppStore } from "@/store/app-store";
import { cn } from "@/lib/utils";

export default function WeatherPage() {
  const { location } = useAppStore();
  const { weather, loading, error, refresh } = useWeather();

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
          <Card className="border-red-200 bg-red-50 dark:border-red-900/30 dark:bg-red-950/10 border-0">
            <CardContent className="py-8 text-center">
              <CloudSun className="size-10 text-red-400 mx-auto mb-3" />
              <p className="text-red-600 dark:text-red-400 font-medium">Failed to load weather data</p>
              <p className="text-sm text-red-500/70 dark:text-red-400/70 mt-1">Please check your connection and try again</p>
            </CardContent>
          </Card>
        )}

        {weather && (
          <>
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

            {/* Hourly */}
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Hourly Forecast</h3>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {weather.hourly.time.map((t, i) => (
                  <Card key={t} className="min-w-[96px] flex-shrink-0 shadow-sm">
                    <CardContent className="flex flex-col items-center gap-1 p-3">
                      <span className="text-[11px] text-muted-foreground font-medium">
                        {new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                      <span className="text-2xl my-1">{getWeatherIcon(weather.hourly.weatherCode[i])}</span>
                      <span className="font-semibold text-sm">{Math.round(weather.hourly.temperature[i])}°</span>
                      <span className="text-[10px] text-blue-500 font-medium">{weather.hourly.precipitation[i]}%</span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* 7-Day */}
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">7-Day Forecast</h3>
              <div className="space-y-2">
                {weather.daily.time.map((t, i) => (
                  <Card key={t} className="shadow-sm card-hover">
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-4">
                        <span className="text-2xl">{getWeatherIcon(weather.daily.weatherCode[i])}</span>
                        <div>
                          <p className="font-medium text-sm">
                            {new Date(t).toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })}
                          </p>
                          <p className="text-xs text-muted-foreground">{getWeatherDescription(weather.daily.weatherCode[i])}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-sm">
                          {Math.round(weather.daily.temperatureMax[i])}° <span className="text-muted-foreground font-normal">/ {Math.round(weather.daily.temperatureMin[i])}°</span>
                        </p>
                        <div className="flex items-center justify-end gap-1 text-xs text-blue-500">
                          <CloudRain className="size-3" />
                          <span>{weather.daily.precipitationProbabilityMax[i]}%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </PageShell>
  );
}
