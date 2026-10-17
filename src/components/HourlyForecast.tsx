// Import libraries
import WeatherIcon from "./WeatherIcon";
import { formatLocalHour, toTemp } from "../utils/weather";
import type { CurrentWeather, Forecast, Unit } from "../types/Weather";
import type { WeatherStatus } from "../hook/useCurrentWeather";

// Types
type HourlyForecastProps = {
    current: CurrentWeather | null;
    forecast: Forecast | null;
    status: WeatherStatus;
    error: string | null;
    unit: Unit;
    onRetry: () => void;
};

// Shared styles
const CARD = "rounded-[20px] border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900";
const LABEL = "mb-4 text-xs font-bold uppercase text-slate-600 dark:text-slate-400";
const CELL = "flex flex-col items-center gap-2.5 rounded-2xl px-2 py-4 text-sm";

// Define component
export default function HourlyForecast({ current, forecast, status, error, unit, onRetry }: HourlyForecastProps) {
    // Loading skeleton
    if (!forecast && status !== "error") {
        return (
            <section className={CARD} aria-busy="true" aria-label="Loading hourly forecast">
                <p className={LABEL}>Next hours</p>
                <div className="grid min-w-135 animate-pulse grid-cols-6 gap-2.5 overflow-x-auto">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="h-32 rounded-2xl bg-slate-100 dark:bg-slate-800" />
                    ))}
                </div>
            </section>
        );
    }

    // Error with nothing to show
    if (!forecast) {
        return (
            <section className={CARD} role="alert">
                <p className={LABEL}>Next hours</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">{error}</p>
                <button
                    type="button"
                    onClick={onRetry}
                    className="mt-3 cursor-pointer text-sm font-bold text-sky-600 underline dark:text-amber-400"
                >
                    Try again
                </button>
            </section>
        );
    }

    const { timezone } = forecast.city;
    const nowDt = current?.dt ?? 0;
    const upcoming = forecast.list.filter((e) => e.dt > nowDt).slice(0, current ? 5 : 6);

    return (
        <section aria-label="Hourly forecast" className={CARD}>
            <p className={LABEL}>Next hours</p>

            <div className="overflow-x-auto">
                <div className="grid min-w-135 grid-cols-6 gap-2.5">
                    {/* Now cell (from the current weather) */}
                    {current && (
                        <div className={`${CELL} border border-sky-600 bg-sky-100 dark:border-sky-400 dark:bg-blue-900`}>
                            <span className="text-slate-700 dark:text-slate-300">Now</span>
                            <WeatherIcon
                                id={current.weather[0].id}
                                isDay={current.weather[0].icon.endsWith("d")}
                                className="size-7"
                            />
                            <b className="text-lg text-slate-950 dark:text-white">{toTemp(current.main.temp, unit)}°</b>
                            <span className="text-slate-600 dark:text-slate-400">
                                {Math.round((forecast.list[0]?.pop ?? 0) * 100)}%
                            </span>
                        </div>
                    )}

                    {/* 3-hour blocks */}
                    {upcoming.map((entry) => (
                        <div key={entry.dt} className={`${CELL} bg-slate-50 dark:bg-slate-950`}>
                            <span className="text-slate-600 dark:text-slate-400">{formatLocalHour(entry.dt, timezone)}</span>
                            <WeatherIcon
                                id={entry.weather[0].id}
                                isDay={entry.weather[0].icon.endsWith("d")}
                                className="size-7"
                            />
                            <b className="text-lg text-slate-950 dark:text-white">{toTemp(entry.main.temp, unit)}°</b>
                            <span className="text-slate-600 dark:text-slate-400">{Math.round(entry.pop * 100)}%</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}