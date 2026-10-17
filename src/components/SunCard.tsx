// Import libraries
import { Sunrise, Sunset } from "lucide-react";
import { formatDuration, formatLocalTime } from "../utils/weather";
import type { CurrentWeather } from "../types/Weather";

// Types
type SunCardProps = {
    weather: CurrentWeather | null;
};

// Shared styles
const CARD = "rounded-[20px] border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900";
const LABEL = "mb-4 text-xs font-bold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-400";

// Define component
export default function SunCard({ weather }: SunCardProps) {
    // Loading skeleton
    if (!weather) {
        return (
            <section className={`${CARD} h-42.5 animate-pulse`} aria-busy="true" aria-label="Loading sun times" />
        );
    }

    const { sunrise, sunset } = weather.sys;
    const { dt, timezone } = weather;

    // Some places (polar regions) have no sunrise or sunset on some days
    if (!sunrise || !sunset || sunset <= sunrise) {
        return (
            <section className={CARD} aria-label="Sun">
                <p className={LABEL}>Sun</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Sun times are not available for this location today.</p>
            </section>
        );
    }

    // "Now" = the moment of the weather observation
    const progress = Math.min(100, Math.max(0, ((dt - sunrise) / (sunset - sunrise)) * 100));
    const status =
        dt < sunrise
            ? `Sunrise in ${formatDuration(sunrise - dt)}`
            : dt > sunset
                ? "The sun has set"
                : `${formatDuration(sunset - dt)} of daylight left`;

    return (
        <section aria-label="Sun" className={CARD}>
            <p className={LABEL}>Sun</p>

            <div className="flex justify-between">
                <div>
                    <p className="flex items-center gap-1.5 text-[15px] text-slate-600 dark:text-slate-400">
                        <Sunrise className="size-4 text-amber-500 dark:text-amber-400" aria-hidden /> Sunrise
                    </p>
                    <p className="mt-1 text-[22px] font-bold text-slate-950 dark:text-white">{formatLocalTime(sunrise, timezone)}</p>
                </div>
                <div className="text-right">
                    <p className="flex items-center justify-end gap-1.5 text-[15px] text-slate-600 dark:text-slate-400">
                        <Sunset className="size-4 text-amber-500 dark:text-amber-400" aria-hidden /> Sunset
                    </p>
                    <p className="mt-1 text-[22px] font-bold text-slate-950 dark:text-white">{formatLocalTime(sunset, timezone)}</p>
                </div>
            </div>

            <div
                role="progressbar"
                aria-label="Daylight progress"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(progress)}
                className="relative mt-5 h-1.5 rounded-full bg-slate-200 dark:bg-slate-800"
            >
                <i
                    className="absolute left-0 top-0 h-1.5 rounded-full bg-amber-500 dark:bg-amber-400"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">{status}</p>
        </section>
    );
}