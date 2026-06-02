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
    past_days: '7',
  });

  const res = await fetch(`${BASE_URL}?${params.toString()}`);
  if (!res.ok) {
    throw new Error(`Weather API error: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();

  // Hourly: next 24 hours from current time
  const nowHour = new Date().getHours();
  const currentHourIndex = json.hourly.time.findIndex((t: string) => {
    const d = new Date(t);
    return d.getHours() === nowHour;
  });
  const startIdx = currentHourIndex >= 0 ? currentHourIndex : 0;
  const hourlySlice = 24;

  // Daily past: last 7 days (indices 0–6)
  const pastDaily = {
    time: json.daily.time.slice(0, 7),
    temperatureMax: json.daily.temperature_2m_max.slice(0, 7),
    temperatureMin: json.daily.temperature_2m_min.slice(0, 7),
    weatherCode: json.daily.weather_code.slice(0, 7),
    precipitationSum: json.daily.precipitation_sum.slice(0, 7),
    precipitationProbabilityMax: json.daily.precipitation_probability_max.slice(0, 7),
    windSpeedMax: json.daily.wind_speed_10m_max.slice(0, 7),
    uvIndexMax: json.daily.uv_index_max.slice(0, 7),
    sunrise: json.daily.sunrise.slice(0, 7),
    sunset: json.daily.sunset.slice(0, 7),
  };

  // Daily forecast: next 7 days (indices 7–13)
  const forecastDaily = {
    time: json.daily.time.slice(7, 14),
    weatherCode: json.daily.weather_code.slice(7, 14),
    temperatureMax: json.daily.temperature_2m_max.slice(7, 14),
    temperatureMin: json.daily.temperature_2m_min.slice(7, 14),
    precipitationSum: json.daily.precipitation_sum.slice(7, 14),
    precipitationProbabilityMax: json.daily.precipitation_probability_max.slice(7, 14),
    windSpeedMax: json.daily.wind_speed_10m_max.slice(7, 14),
    uvIndexMax: json.daily.uv_index_max.slice(7, 14),
    sunrise: json.daily.sunrise.slice(7, 14),
    sunset: json.daily.sunset.slice(7, 14),
  };

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
      time: json.hourly.time.slice(startIdx, startIdx + hourlySlice),
      temperature: json.hourly.temperature_2m.slice(startIdx, startIdx + hourlySlice),
      weatherCode: json.hourly.weather_code.slice(startIdx, startIdx + hourlySlice),
      precipitation: json.hourly.precipitation_probability.slice(startIdx, startIdx + hourlySlice),
      humidity: json.hourly.relative_humidity_2m.slice(startIdx, startIdx + hourlySlice),
    },
    daily: forecastDaily,
    history: pastDaily,
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

export function getUvRecommendation(uv: number): { level: string; advice: string; color: string } {
  if (uv <= 2) return { level: 'Low', advice: 'No protection needed.', color: 'text-emerald-600' };
  if (uv <= 5) return { level: 'Moderate', advice: 'Wear sunglasses and use SPF 30+ sunscreen.', color: 'text-yellow-600' };
  if (uv <= 7) return { level: 'High', advice: 'Limit sun exposure 10am–4pm. SPF 30+, hat, and shade.', color: 'text-orange-600' };
  if (uv <= 10) return { level: 'Very High', advice: 'Minimize sun exposure. SPF 50+, protective clothing.', color: 'text-red-600' };
  return { level: 'Extreme', advice: 'Avoid sun exposure. Full protection essential.', color: 'text-purple-600' };
}

export function calculateGrowingScore(temp: number, humidity: number, precipitation: number): number {
  let score = 5;
  // Temperature: ideal 20-30°C
  if (temp >= 20 && temp <= 30) score += 3;
  else if (temp >= 15 && temp <= 35) score += 1;
  else score -= 1;

  // Humidity: ideal 50-70%
  if (humidity >= 50 && humidity <= 70) score += 2;
  else if (humidity >= 40 && humidity <= 80) score += 0;
  else score -= 1;

  // Precipitation: moderate is good (0.5–5mm)
  if (precipitation >= 0.5 && precipitation <= 5) score += 1;
  else if (precipitation > 15) score -= 1;

  return Math.max(1, Math.min(10, score));
}
