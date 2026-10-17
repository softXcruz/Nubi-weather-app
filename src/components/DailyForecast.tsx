// Import libraries
import WeatherIcon from "./WeatherIcon";
import { capitalize, formatLocalWeekday, toTemp } from "../utils/weather";
import type { DayForecast, Unit } from "../types/Weather";
import type { WeatherStatus } from "../hook/useCurrentWeather";

// Types
type DailyForecastProps = {
    days: DayForecast[];
    timezone: number;
    status: WeatherStatus;
    unit: Unit;
};

// Shared styles
const CARD = "rounded-[20px] border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900";
const LABEL = "mb-4 text-xs font-bold uppercase text-slate-600 dark:text-slate-400";

// Define component
export default function DailyForecast({ days, timezone, status, unit }: DailyForecastProps) {
    // Loading skeleton
    if (days.length === 0) {
        return (
            <section className={CARD} aria-busy={status === "loading"} aria-label="5-day forecast">
                <p className={LABEL}>Next 5 days</p>
                <div className="animate-pulse space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="h-10 rounded-xl bg-slate-100 dark:bg-slate-800" />
                    ))}
                </div>
            </section>
        );
    }

    // Temperatures in the selected unit, and the global range for the bars
    const rows = days.map((d) => ({ ...d, lo: toTemp(d.min, unit), hi: toTemp(d.max, unit) }));
    const globalMin = Math.min(...rows.map((r) => r.lo));
    const globalMax = Math.max(...rows.map((r) => r.hi));
    const span = globalMax - globalMin || 1;

    return (
        <section aria-label="5-day forecast" className={CARD}>
            <p className={LABEL}>Next 5 days</p>

            {rows.map((day, i) => (
                <div
                    key={day.key}
                    className="grid grid-cols-[3rem_1fr_auto] items-center gap-3 border-t border-slate-200 py-3.5 text-[15px] first:border-t-0 dark:border-slate-800"
                >
                    <span className="font-bold text-slate-950 dark:text-white">
                        {i === 0 ? "Today" : formatLocalWeekday(day.dt, timezone)}
                    </span>

                    <span className="flex min-w-0 items-center gap-2 text-slate-600 dark:text-slate-400">
                        <WeatherIcon id={day.condition.id} isDay className="size-5 shrink-0" />
                        <span className="hidden truncate sm:block">{capitalize(day.condition.description)}</span>
                        {day.pop >= 0.1 && (
                            <span className="text-xs font-semibold text-sky-600 dark:text-sky-400">
                                {Math.round(day.pop * 100)}%
                            </span>
                        )}
                    </span>

                    <span className="flex items-center gap-2.5 text-slate-600 dark:text-slate-400">
                        {day.lo}°
                        <span className="relative h-1.5 w-16 rounded-full bg-slate-200 sm:w-22.5 dark:bg-slate-800">
                            <i
                                className="absolute top-0 h-1.5 rounded-full bg-amber-500 dark:bg-amber-400"
                                style={{
                                    left: `${((day.lo - globalMin) / span) * 100}%`,
                                    width: `${Math.max(((day.hi - day.lo) / span) * 100, 8)}%`,
                                }}
                            />
                        </span>
                        <span className="font-semibold text-slate-950 dark:text-white">{day.hi}°</span>
                    </span>
                </div>
            ))}
        </section>
    );
}