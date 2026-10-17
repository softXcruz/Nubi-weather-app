// Define type for the component unit toggle
export type Unit = "c" | "f";

// Define the type for Geo location
export type GeoLocation = {
    name: string;
    local_names?: Record<string, string> 
    lat: number;
    lon: number;
    country: string;
    state?: string;
    isOwn?: boolean;
}

// OpenWeather /data/2.5/weather response (only the fields we use)
export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string; // "10d" -> the last letter is d (day) or n (night)
}

export interface CurrentWeather {
  weather: WeatherCondition[];
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  wind: { speed: number; deg: number; gust?: number };
  visibility?: number; // meters
  dt: number; // observation time (unix, UTC)
  timezone: number; // city offset from UTC, in seconds
  sys: { country?: string; sunrise: number; sunset: number };
  name: string;
}

// OpenWeather /data/2.5/forecast response (only the fields we use)
export interface ForecastEntry {
  dt: number; // unix, UTC
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
  };
  weather: WeatherCondition[];
  pop: number; // probability of precipitation, 0 to 1
  wind: { speed: number };
}

export interface Forecast {
  list: ForecastEntry[];
  city: {
    name: string;
    country: string;
    timezone: number; // offset from UTC, in seconds
    sunrise: number;
    sunset: number;
  };
}

// One aggregated day (built by us from the 3-hour entries)
export interface DayForecast {
  key: string; // "2026-10-16" in the city's local time
  dt: number;
  min: number; // °C
  max: number; // °C
  pop: number; // highest chance of rain that day, 0 to 1
  condition: WeatherCondition;
}