// Import libraries
import { useCallback, useEffect, useState } from "react";
import { fetchCurrentWeather } from "../services/openWeather";
import type { CurrentWeather, GeoLocation } from "../types/Weather";

// Types
export type WeatherStatus = "idle" | "loading" | "success" | "error";

type Result = {
    key: string; // which request this result belongs to
    data: CurrentWeather | null;
    error: string | null;
};

// Define hook
export function useCurrentWeather(city: GeoLocation | null) {
    const [result, setResult] = useState<Result | null>(null);
    const [attempt, setAttempt] = useState(0); // changing it forces a new request

    const lat = city?.lat;
    const lon = city?.lon;
    const key = lat === undefined || lon === undefined ? null : `${lat},${lon},${attempt}`;

    useEffect(() => {
        if (key === null || lat === undefined || lon === undefined) return;

        const controller = new AbortController();

        fetchCurrentWeather(lat, lon, controller.signal)
            .then((data) => setResult({ key, data, error: null }))
            .catch((err: Error) => {
                if (err.name === "AbortError") return; // a newer request replaced this one
                // keep the previous data (if any) so the screen doesn't go blank
                setResult((prev) => ({ key, data: prev?.data ?? null, error: err.message }));
            });

        return () => controller.abort();
    }, [key, lat, lon]);

    const retry = useCallback(() => setAttempt((n) => n + 1), []);

    // Derived values: no extra state, nothing to keep in sync
    const isCurrent = result !== null && result.key === key;
    const status: WeatherStatus =
        key === null ? "idle" : !isCurrent ? "loading" : result.error ? "error" : "success";

    return {
        data: result?.data ?? null,
        status,
        error: isCurrent ? result.error : null,
        retry,
    };
}