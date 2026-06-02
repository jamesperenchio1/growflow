"use client";

import { CloudSun, Droplets, Wind, Thermometer, Eye, Sunrise, Sunset, Gauge, RefreshCw, CloudRain, Sun, Cloud } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useWeather } from "@/hooks/use-weather";
import { getWeatherIcon, getWeatherDescription } from "@/lib/api/weather";
import { useAppStore } from "@/store/app-store";

export default function WeatherPage() {
  const { location } = useAppStore();
  const { weather, loading, error, refresh } = useWeather();

  return (
    <PageShell>
      <div className="space-y-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Weather</h2>
            <p className="text-muted-foreground">{location.name} — 7-day forecast</p>
          </div>
          <Button variant="outline" size="sm" onClick={refresh} disabled={loading} className="gap-2">
            <RefreshCw className={loading ? "size-4 animate-spin" : "size-4"} />
            Refresh
          </Button>
        </div>

        {error && (
          <Card className="border-destructive/50">
            <CardContent className="py-6 text-center text-destructive">
              Failed to load weather data. Please check your connection.
            </CardContent>
          </Card>
        )}

        {weather && (
          <>
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
                  <div className="text-center sm:text-left">
                    <div className="text-5xl font-bold">{Math.round(weather.current.temperature)}°C</div>
                    <p className="text-lg text-muted-foreground">
                      {getWeatherIcon(weather.current.weatherCode)} {getWeatherDescription(weather.current.weatherCode)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Feels like {Math.round(weather.current.feelsLike)}°C
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Droplets className="size-4 text-blue-500" />
                      <span>Humidity {weather.current.humidity}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Wind className="size-4 text-slate-500" />
                      <span>Wind {weather.current.windSpeed} km/h</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Gauge className="size-4 text-purple-500" />
                      <span>Pressure {Math.round(weather.current.pressure)} hPa</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye className="size-4 text-amber-500" />
                      <span>UV Index {weather.current.uvIndex}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sunrise className="size-4 text-orange-500" />
                      <span>{new Date(weather.daily.sunrise[0]).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sunset className="size-4 text-indigo-500" />
                      <span>{new Date(weather.daily.sunset[0]).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div>
              <h3 className="mb-3 text-lg font-semibold">Hourly</h3>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {weather.hourly.time.map((t, i) => (
                  <Card key={t} className="min-w-[100px] flex-shrink-0">
                    <CardContent className="flex flex-col items-center gap-1 p-3">
                      <span className="text-xs text-muted-foreground">
                        {new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                      <span className="text-xl">{getWeatherIcon(weather.hourly.weatherCode[i])}</span>
                      <span className="font-medium">{Math.round(weather.hourly.temperature[i])}°</span>
                      <span className="text-xs text-blue-500">{weather.hourly.precipitation[i]}%</span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-lg font-semibold">7-Day Forecast</h3>
              <div className="space-y-2">
                {weather.daily.time.map((t, i) => (
                  <Card key={t}>
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{getWeatherIcon(weather.daily.weatherCode[i])}</span>
                        <div>
                          <p className="font-medium">
                            {new Date(t).toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {getWeatherDescription(weather.daily.weatherCode[i])}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {Math.round(weather.daily.temperatureMax[i])}° / {Math.round(weather.daily.temperatureMin[i])}°
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
