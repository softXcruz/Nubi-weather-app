// Import types
import type { DayForecast, ForecastEntry, Unit } from "../types/Weather";

// Celsius -> selected unit, rounded
export const toTemp = (celsius: number, unit: Unit): number =>
    Math.round(unit === "c" ? celsius : (celsius * 9) / 5 + 32);

export const capitalize = (text: string): string =>
    text.charAt(0).toUpperCase() + text.slice(1);

const shifted = (dt: number, timezone: number) => new Date((dt + timezone) * 1000);

export const formatLocalDate = (dt: number, timezone: number): string =>
    shifted(dt, timezone).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        timeZone: "UTC",
    });

export const formatLocalTime = (dt: number, timezone: number): string =>
    shifted(dt, timezone).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        timeZone: "UTC",
    });

// "3 PM" in the city's local time
export const formatLocalHour = (dt: number, timezone: number): string =>
    shifted(dt, timezone).toLocaleTimeString("en-US", {
        hour: "numeric",
        timeZone: "UTC",
    });

// "Fri" in the city's local time
export const formatLocalWeekday = (dt: number, timezone: number): string =>
    shifted(dt, timezone).toLocaleDateString("en-US", {
        weekday: "short",
        timeZone: "UTC",
    });

// Group the 3-hour entries by LOCAL day and summarize each day
export function groupByDay(list: ForecastEntry[], timezone: number): DayForecast[] {
    const groups = new Map<string, ForecastEntry[]>();

    for (const entry of list) {
        const key = shifted(entry.dt, timezone).toISOString().slice(0, 10);
        const group = groups.get(key);
        if (group) group.push(entry);
        else groups.set(key, [entry]);
    }

    return [...groups.entries()]
        .map(([key, entries]) => {
            // Representative entry: the one closest to 1 PM local time
            const rep = entries.reduce((best, e) => {
                const hourE = shifted(e.dt, timezone).getUTCHours();
                const hourBest = shifted(best.dt, timezone).getUTCHours();
                return Math.abs(hourE - 13) < Math.abs(hourBest - 13) ? e : best;
            });

            return {
                key,
                dt: rep.dt,
                min: Math.min(...entries.map((e) => e.main.temp_min)),
                max: Math.max(...entries.map((e) => e.main.temp_max)),
                pop: Math.max(...entries.map((e) => e.pop)),
                condition: rep.weather[0],
            };
        })
        .slice(0, 5);
}

// Wind direction in degrees -> compass point ("NW")
const COMPASS = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
export const windDirection = (deg: number): string => COMPASS[Math.round(deg / 22.5) % 16];

// m/s -> km/h (metric) or mph (imperial)
export const toWind = (ms: number, unit: Unit): string =>
    unit === "c" ? `${Math.round(ms * 3.6)} km/h` : `${Math.round(ms * 2.23694)} mph`;

// meters -> km (metric) or miles (imperial)
export const toDistance = (meters: number, unit: Unit): string => {
    const value = unit === "c" ? meters / 1000 : meters / 1609.34;
    const rounded = value >= 10 ? Math.round(value) : Math.round(value * 10) / 10;
    return `${rounded} ${unit === "c" ? "km" : "mi"}`;
};

// hPa -> hPa (metric) or inHg (imperial)
export const toPressure = (hpa: number, unit: Unit): string =>
    unit === "c" ? `${hpa} hPa` : `${(hpa * 0.02953).toFixed(2)} inHg`;

export const humidityLabel = (percent: number): string =>
    percent < 30 ? "Dry" : percent <= 60 ? "Comfortable" : "Humid";

export const visibilityLabel = (meters: number): string =>
    meters >= 10000 ? "Clear view" : meters >= 5000 ? "Good" : meters >= 2000 ? "Moderate" : "Poor";

export const pressureLabel = (hpa: number): string =>
    hpa < 1000 ? "Low" : hpa > 1020 ? "High" : "Normal";

// 12600 seconds -> "3h 30m"
export const formatDuration = (seconds: number): string => {
    const totalMinutes = Math.max(0, Math.round(seconds / 60));
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
};