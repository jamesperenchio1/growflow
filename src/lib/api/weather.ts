import type { WeatherData } from '@/types';

const BASE_URL = 'https://api.open-meteo.com/v1/forecast';

export async function fetchWeather(lat: number, lon: number): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    current: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m,pressure_msl,dew_point_2m,cloud_cover,uv_index',
    hourly: 'temperature_2m,relative_humidity_2m,precipitation_probability,weather_code',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,uv_index_max,sunrise,sunset',
    timezone: 'auto',
    forecast_days: '7',
  });

  const res = await fetch(`${BASE_URL}?${params.toString()}`);
  if (!res.ok) {
    throw new Error(`Weather API error: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();

  // Hourly: next 12 hours
  const hourlySlice = 12;

  return {
    current: {
      temperature: json.current.temperature_2m,
      feelsLike: json.current.apparent_temperature,
      humidity: json.current.relative_humidity_2m,
      windSpeed: json.current.wind_speed_10m,
      windDirection: json.current.wind_direction_10m,
      weatherCode: json.current.weather_code,
      precipitation: json.current.precipitation,
      uvIndex: json.current.uv_index,
      pressure: json.current.pressure_msl,
      dewPoint: json.current.dew_point_2m,
      cloudCover: json.current.cloud_cover,
    },
    hourly: {
      time: json.hourly.time.slice(0, hourlySlice),
      temperature: json.hourly.temperature_2m.slice(0, hourlySlice),
      weatherCode: json.hourly.weather_code.slice(0, hourlySlice),
      precipitation: json.hourly.precipitation_probability.slice(0, hourlySlice),
      humidity: json.hourly.relative_humidity_2m.slice(0, hourlySlice),
    },
    daily: {
      time: json.daily.time,
      weatherCode: json.daily.weather_code,
      temperatureMax: json.daily.temperature_2m_max,
      temperatureMin: json.daily.temperature_2m_min,
      precipitationSum: json.daily.precipitation_sum,
      precipitationProbabilityMax: json.daily.precipitation_probability_max,
      windSpeedMax: json.daily.wind_speed_10m_max,
      uvIndexMax: json.daily.uv_index_max,
      sunrise: json.daily.sunrise,
      sunset: json.daily.sunset,
    },
  };
}

const WEATHER_CODE_MAP: Record<number, { icon: string; description: string }> = {
  0: { icon: '☀️', description: 'Clear sky' },
  1: { icon: '🌤️', description: 'Mainly clear' },
  2: { icon: '⛅', description: 'Partly cloudy' },
  3: { icon: '☁️', description: 'Overcast' },
  45: { icon: '🌫️', description: 'Fog' },
  48: { icon: '🌫️', description: 'Depositing rime fog' },
  51: { icon: '🌦️', description: 'Light drizzle' },
  53: { icon: '🌦️', description: 'Moderate drizzle' },
  55: { icon: '🌧️', description: 'Dense drizzle' },
  56: { icon: '🌧️', description: 'Light freezing drizzle' },
  57: { icon: '🌧️', description: 'Dense freezing drizzle' },
  61: { icon: '🌧️', description: 'Slight rain' },
  63: { icon: '🌧️', description: 'Moderate rain' },
  65: { icon: '🌧️', description: 'Heavy rain' },
  66: { icon: '🌨️', description: 'Light freezing rain' },
  67: { icon: '🌨️', description: 'Heavy freezing rain' },
  71: { icon: '🌨️', description: 'Slight snow fall' },
  73: { icon: '🌨️', description: 'Moderate snow fall' },
  75: { icon: '❄️', description: 'Heavy snow fall' },
  77: { icon: '❄️', description: 'Snow grains' },
  80: { icon: '🌦️', description: 'Slight rain showers' },
  81: { icon: '🌦️', description: 'Moderate rain showers' },
  82: { icon: '🌧️', description: 'Violent rain showers' },
  85: { icon: '🌨️', description: 'Slight snow showers' },
  86: { icon: '🌨️', description: 'Heavy snow showers' },
  95: { icon: '⛈️', description: 'Thunderstorm' },
  96: { icon: '⛈️', description: 'Thunderstorm with slight hail' },
  99: { icon: '⛈️', description: 'Thunderstorm with heavy hail' },
};

export function getWeatherIcon(code: number): string {
  return WEATHER_CODE_MAP[code]?.icon ?? '❓';
}

export function getWeatherDescription(code: number): string {
  return WEATHER_CODE_MAP[code]?.description ?? 'Unknown';
}
