// Import libraries
import WeatherIcon from "./WeatherIcon";
import { capitalize, formatLocalDate, formatLocalTime, toTemp } from "../utils/weather";
import { citySubtitle } from "../utils/city";
import type { CurrentWeather as CurrentWeatherData, GeoLocation, Unit } from "../types/Weather";
import type { WeatherStatus } from "../hook/useCurrentWeather";

// Types
type CurrentWeatherProps = {
    city: GeoLocation | null;
    weather: CurrentWeatherData | null;
    status: WeatherStatus;
    error: string | null;
    unit: Unit;
    onRetry: () => void;
    range: { min: number; max: number } | null; // today's range, from the forecast
};

// Shared card styles
const CARD =
    "rounded-[20px] border border-sky-200 bg-sky-100 p-6 sm:p-9 dark:border-blue-800 dark:bg-blue-950";

// Define component
export default function CurrentWeather({ city, weather, status, error, unit, onRetry, range }: CurrentWeatherProps) {
    // Nothing selected yet
    if (!city) {
        return (
            <section className={CARD}>
                <p className="text-slate-700 dark:text-blue-200">
                    Search for a city or use your location to see the weather.
                </p>
            </section>
        );
    }

    // First load: skeleton
    if (!weather && status !== "error") {
        return (
            <section className={`${CARD} animate-pulse`} aria-busy="true" aria-label="Loading weather">
                <div className="h-4 w-48 rounded bg-sky-200 dark:bg-blue-900" />
                <div className="mt-3 h-3 w-64 rounded bg-sky-200 dark:bg-blue-900" />
                <div className="mt-8 h-24 w-56 rounded bg-sky-200 dark:bg-blue-900" />
                <div className="mt-4 h-5 w-40 rounded bg-sky-200 dark:bg-blue-900" />
            </section>
        );
    }

    // Error with no data to show
    if (!weather) {
        return (
            <section className={CARD} role="alert">
                <p className="font-semibold text-slate-900 dark:text-white">We couldn't load the weather</p>
                <p className="mt-1 text-sm text-slate-700 dark:text-blue-200">{error}</p>
                <button
                    type="button"
                    onClick={onRetry}
                    className="mt-4 h-10 cursor-pointer rounded-xl bg-sky-600 px-4 text-sm font-bold text-white hover:bg-sky-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 dark:bg-amber-400 dark:text-slate-950 dark:hover:bg-amber-300 dark:focus-visible:outline-amber-400"
                >
                    Try again
                </button>
            </section>
        );
    }

    const condition = weather.weather[0];
    const isDay = condition.icon.endsWith("d");
    const place = city.name === "My location" ? weather.name : city.name;
    const subtitle = citySubtitle(city);
    const refreshing = status === "loading";

    return (
        <section
            aria-label="Current weather"
            aria-busy={refreshing}
            className={`${CARD} flex flex-col items-start justify-between gap-6 transition-opacity sm:flex-row sm:items-center sm:gap-8 ${refreshing ? "opacity-60" : ""
                }`}
        >
            <div className="min-w-0">
                <p className="text-base font-semibold text-slate-900 dark:text-blue-200">
                    {place}{subtitle && ` · ${subtitle}`}
                </p>
                <p className="mt-1 text-sm text-sky-700 dark:text-blue-300">
                    {formatLocalDate(weather.dt, weather.timezone)} · {formatLocalTime(weather.dt, weather.timezone)}
                </p>

                <p className="mt-6 text-8xl font-extrabold leading-none text-slate-950 sm:mt-7 sm:text-[112px] dark:text-white">
                    {toTemp(weather.main.temp, unit)}°
                </p>
                <p className="mt-3 text-xl font-bold text-slate-950 sm:text-[22px] dark:text-white">
                    {capitalize(condition.description)}
                </p>
                <p className="mt-1.5 text-[15px] text-sky-800 dark:text-blue-200">
                    Feels like {toTemp(weather.main.feels_like, unit)}° · High {toTemp(range?.max ?? weather.main.temp_max, unit)}° · Low {toTemp(range?.min ?? weather.main.temp_min, unit)}°
                </p>

                {status === "error" && (
                    <p role="alert" className="mt-3 text-sm text-red-700 dark:text-red-300">
                        Couldn't refresh: {error}{" "}
                        <button type="button" onClick={onRetry} className="cursor-pointer font-bold underline">
                            Retry
                        </button>
                    </p>
                )}
            </div>

            <WeatherIcon id={condition.id} isDay={isDay} className="size-32 shrink-0 sm:size-44" />
        </section>
    );
}