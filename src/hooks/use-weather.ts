import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchWeather } from '@/lib/api/weather';
import { evaluateThaiHazards } from '@/data/hazards';
import type { WeatherData, ThaiHazard } from '@/types';
import { useAppStore } from '@/store/app-store';

const WEATHER_QUERY_KEY = 'weather';

interface UseWeatherResult {
  weather: WeatherData | null;
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
  alerts: ThaiHazard[];
}

export function useWeather(): UseWeatherResult {
  const location = useAppStore((s) => s.location);
  const thaiHazardsEnabled = useAppStore((s) => s.thaiHazardsEnabled);
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<WeatherData, Error>({
    queryKey: [WEATHER_QUERY_KEY, location.lat, location.lon],
    queryFn: () => fetchWeather(location.lat, location.lon),
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 30,    // 30 minutes
    retry: 2,
  });

  const refresh = async () => {
    await queryClient.invalidateQueries({ queryKey: [WEATHER_QUERY_KEY, location.lat, location.lon] });
  };

  let alerts: ThaiHazard[] = [];
  if (thaiHazardsEnabled && data) {
    alerts = evaluateThaiHazards(
      new Date(),
      data.current.temperature,
      data.current.precipitation,
      data.current.humidity,
      data.current.windSpeed
    );
  }

  return {
    weather: data ?? null,
    loading: isLoading,
    error: error ?? null,
    refresh,
    alerts,
  };
}
