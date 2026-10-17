// Import libraries
import { useEffect, useState } from "react";
import { searchCities } from "../services/openWeather";
import type { GeoLocation } from "../types/Weather";

// Define the type for the component search
export type SearchStatus = "idle" | "loading" | "success" | "empty" | "error";

// Constants
const min_chars = 2;
const max_chars = 40;
const debounce_ms = 400;
const valid_charts = /^[\p{L}\p{M}\s.'\-,]+$/u;

// Validate the text before calling the API
export function validateQuery(raw: string): { valid: boolean; message: string | null } {
    const q = raw.trim();
    if (q.length === 0) return { valid: false, message: null }; // nothing typed, no message
    if (q.length < min_chars) return { valid: false, message: `Type at least ${min_chars} characters` };
    if (q.length > max_chars) return { valid: false, message: `Maximum ${max_chars} characters` };
    if (!valid_charts.test(q)) return { valid: false, message: "Use only letters, spaces, . ' - ," };
    return { valid: true, message: null };
}

// Define hook
export function useCitySearch(query: string, enabled = true) {
    const [results, setResults] = useState<GeoLocation[]>([]);
    const [status, setStatus] = useState<SearchStatus>("idle");
    const [error, setError] = useState<string | null>(null);

    const q = query.trim();
    const { valid, message } = validateQuery(q);

    useEffect(() => {
        if (!valid || !enabled) return;

        const controller = new AbortController();

        // Wait for the user to stop typing
        const timer = setTimeout(async () => {
            setStatus("loading");
            setError(null);
            try {
                const data = await searchCities(q, controller.signal);
                setResults(data);
                setStatus(data.length > 0 ? "success" : "empty");
            } catch (err) {
                if ((err as Error).name === "AbortError") return; 
                setResults([]);
                setError((err as Error).message);
                setStatus("error");
            }
        }, debounce_ms);

        // Cleanup: runs when the text changes or the component unmounts
        return () => {
            clearTimeout(timer);
            controller.abort();
        };
    }, [q, valid, enabled]);

    return {
        results: valid ? results : [],
        status: valid ? status : "idle",
        error: valid ? error : null,
        validationMessage: message,
    };
}