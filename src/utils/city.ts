// Import types
import type { GeoLocation } from "../types/Weather";

const STORAGE_KEY = "nubi:city";
const countryNames = new Intl.DisplayNames(["en"], { type: "region" });

// "MX" -> "Mexico"
export function formatCountry(code: string): string {
    try {
        return countryNames.of(code) ?? code;
    } catch {
        return code;
    }
}

// "Jalisco, Mexico"
export function citySubtitle(city: GeoLocation): string {
    return [city.state, formatCountry(city.country)].filter(Boolean).join(", ");
}

// "Guadalajara, Jalisco, Mexico"
export function cityLabel(city: GeoLocation): string {
    return [city.name, citySubtitle(city)].filter(Boolean).join(", ");
}

// Check that the saved data really looks like a city
function isGeoLocation(value: unknown): value is GeoLocation {
    if (typeof value !== "object" || value === null) return false;
    const v = value as Record<string, unknown>;
    return (
        typeof v.name === "string" &&
        typeof v.country === "string" &&
        typeof v.lat === "number" &&
        typeof v.lon === "number"
    );
}

export function loadSavedCity(): GeoLocation | null {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        const parsed: unknown = JSON.parse(raw);
        return isGeoLocation(parsed) ? parsed : null;
    } catch {
        return null;
    }
}

export function saveCity(city: GeoLocation): void {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(city));
    } catch {
        // storage blocked or full: the app still works, it just won't remember
    }
}