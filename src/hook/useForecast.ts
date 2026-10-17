// Import libraries
import { useCallback, useEffect, useState } from "react";
import { fetchForecast } from "../services/openWeather";
import type { Forecast, GeoLocation } from "../types/Weather";
import type { WeatherStatus } from "./useCurrentWeather";

// Types
type Result = {
    key: string;
    data: Forecast | null;
    error: string | null;
};

// Define hook
export function useForecast(city: GeoLocation | null) {
    const [result, setResult] = useState<Result | null>(null);
    const [attempt, setAttempt] = useState(0);

    const lat = city?.lat;
    const lon = city?.lon;
    const key = lat === undefined || lon === undefined ? null : `${lat},${lon},${attempt}`;

    useEffect(() => {
        if (key === null || lat === undefined || lon === undefined) return;

        const controller = new AbortController();

        fetchForecast(lat, lon, controller.signal)
            .then((data) => setResult({ key, data, error: null }))
            .catch((err: Error) => {
                if (err.name === "AbortError") return;
                setResult((prev) => ({ key, data: prev?.data ?? null, error: err.message }));
            });

        return () => controller.abort();
    }, [key, lat, lon]);

    const retry = useCallback(() => setAttempt((n) => n + 1), []);

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