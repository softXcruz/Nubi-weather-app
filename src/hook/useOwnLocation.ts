// Import libraries
import { useCallback, useEffect, useRef, useState } from "react";
import { reverseGeocode } from "../services/openWeather";
import type { GeoLocation } from "../types/Weather";

// Types
export type LocationStatus = "idle" | "locating" | "success" | "error";

// Define hook
export function useOwnLocation(onLocated: (city: GeoLocation) => void) {
    const [status, setStatus] = useState<LocationStatus>("idle");
    const [message, setMessage] = useState<string | null>(null);

    // Always call the latest callback without re-creating `locate`
    const onLocatedRef = useRef(onLocated);
    useEffect(() => {
        onLocatedRef.current = onLocated;
    });

    // Each request gets an id, so an old response never overwrites a newer action
    const requestId = useRef(0);

    const locate = useCallback((fresh = false) => {
        const id = ++requestId.current;

        const fail = (text: string) => {
            if (id !== requestId.current) return;
            setStatus("error");
            setMessage(text);
        };

        if (!("geolocation" in navigator)) {
            fail("Your browser does not support geolocation. Search for a city instead.");
            return;
        }

        setStatus("locating");
        setMessage(null);

        navigator.geolocation.getCurrentPosition(
            async ({ coords }) => {
                const { latitude: lat, longitude: lon } = coords;

                // Turn coordinates into a city name. If it fails we still keep the coordinates.
                let place: GeoLocation | null = null;
                try {
                    place = await reverseGeocode(lat, lon);
                } catch (err) {
                    console.error("[location] reverse geocode error:", err); // DEBUG
                }

                if (id !== requestId.current) return; // the user did something else meanwhile

                onLocatedRef.current({
                    name: place?.name ?? "My location",
                    country: place?.country ?? "",
                    state: place?.state,
                    lat, // we use the real coordinates, not the city center
                    lon,
                    isOwn: true,
                });
                setStatus("success");
            },
            (err) => {
                if (err.code === err.PERMISSION_DENIED) {
                    fail("Location access is blocked. Allow it in your browser settings, or search for a city.");
                } else if (err.code === err.TIMEOUT) {
                    fail("Finding your location took too long. Try again or search for a city.");
                } else {
                    fail("We couldn't determine your location. Search for a city instead.");
                }
            },
            {
                enableHighAccuracy: false,
                timeout: 10000,
                maximumAge: fresh ? 0 : 5 * 60 * 1000, // button = fresh position, startup = cached is fine
            }
        );
    }, []);

    // Cancel anything in progress and hide messages (used when the user searches a city)
    const reset = useCallback(() => {
        requestId.current++;
        setStatus("idle");
        setMessage(null);
    }, []);

    return { status, message, locate, reset };
}