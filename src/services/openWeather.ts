// Import types
import type { CurrentWeather, Forecast, GeoLocation } from "../types/Weather";

// Import the key
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY as string;
const GEO_URL = "https://api.openweathermap.org/geo/1.0";
const WEATHER_URL = "https://api.openweathermap.org/data/2.5";

// In development, fail with a clear message when the key is missing
function assertApiKey(): void {
  if (import.meta.env.DEV && !API_KEY) {
    throw new Error("Missing API key. Add VITE_OPENWEATHER_API_KEY to .env.local and restart the dev server");
  }
}

// Define function to search cities
export async function searchCities(query: string, signal?: AbortSignal): Promise<GeoLocation[]> {
    assertApiKey();
    // Consult the url with the key API
    const url = `${GEO_URL}/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`;
    const res = await fetch(url, { signal });

    // If the response is not ok then...
    if (!res.ok) {
        throw new Error(`OpenWeather API error: ${res.statusText} || ${res.status}`)
    }

    // Save data
    const data = await res.json();
    return data;
}

// Convert coordinates into a city (reverse geocoding)
export async function reverseGeocode(
    lat: number,
    lon: number,
    signal?: AbortSignal
): Promise<GeoLocation | null> {
    assertApiKey();
    const url = `${GEO_URL}/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`;
    const res = await fetch(url, { signal });

    if (!res.ok) {
        if (res.status === 401) throw new Error("Invalid or not yet activated API key");
        throw new Error(`Reverse geocoding failed (${res.status})`);
    }

    const data: GeoLocation[] = await res.json();
    return data[0] ?? null; // empty array when the point has no nearby city (e.g. the ocean)
}

// Current weather by coordinates (always metric, we convert in the UI)
export async function fetchCurrentWeather(
    lat: number,
    lon: number,
    signal?: AbortSignal
): Promise<CurrentWeather> {
    assertApiKey();
    const url = `${WEATHER_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
    const res = await fetch(url, { signal });

    if (!res.ok) {
        if (res.status === 401) throw new Error("Invalid or not yet activated API key");
        if (res.status === 429) throw new Error("Too many requests. Try again in a minute");
        throw new Error(`Weather request failed (${res.status})`);
    }

    return res.json();
}

// 5 day forecast, in 3-hour steps (always metric, we convert in the UI)
export async function fetchForecast(
    lat: number,
    lon: number,
    signal?: AbortSignal
): Promise<Forecast> {
    assertApiKey();
    const url = `${WEATHER_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
    const res = await fetch(url, { signal });

    if (!res.ok) {
        if (res.status === 401) throw new Error("Invalid or not yet activated API key");
        if (res.status === 429) throw new Error("Too many requests. Try again in a minute");
        throw new Error(`Forecast request failed (${res.status})`);
    }

    return res.json();
}