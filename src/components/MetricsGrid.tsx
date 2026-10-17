// Import libraries
import { Droplets, Eye, Gauge, Wind } from "lucide-react";
import {
    humidityLabel, pressureLabel, toDistance, toPressure,
    toWind, visibilityLabel, windDirection,
} from "../utils/weather";
import type { CurrentWeather, Unit } from "../types/Weather";

// Types
type MetricCardProps = {
    icon: React.ReactNode;
    label: string;
    value: string;
    hint: string;
};

type MetricsGridProps = {
    weather: CurrentWeather | null;
    unit: Unit;
};

// Shared styles
const GRID = "grid grid-cols-2 gap-4 sm:gap-6 xl:grid-cols-4";
const CARD = "rounded-[20px] border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900";

// Single metric card
function MetricCard({ icon, label, value, hint }: MetricCardProps) {
    return (
        <div className={CARD}>
            <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase text-slate-600 dark:text-slate-400">
                <span className="text-sky-600 dark:text-amber-400" aria-hidden>{icon}</span>
                {label}
            </p>
            <p className="text-2xl font-extrabold text-slate-950 sm:text-[28px] dark:text-white">{value}</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{hint}</p>
        </div>
    );
}

// Define component
export default function MetricsGrid({ weather, unit }: MetricsGridProps) {
    // Loading skeleton
    if (!weather) {
        return (
            <section className={`${GRID} animate-pulse`} aria-busy="true" aria-label="Loading details">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className={`${CARD} h-33`} />
                ))}
            </section>
        );
    }

    const { main, wind, visibility } = weather;
    // Visibility is optional in the API. If it's missing we show a dash.
    const hasVisibility = typeof visibility === "number";

    return (
        <section aria-label="Weather details" className={GRID}>
            <MetricCard
                icon={<Wind className="size-4" />}
                label="Wind"
                value={toWind(wind.speed, unit)}
                hint={`From ${windDirection(wind.deg)}${wind.gust ? ` · Gusts ${toWind(wind.gust, unit)}` : ""}`}
            />
            <MetricCard
                icon={<Droplets className="size-4" />}
                label="Humidity"
                value={`${main.humidity}%`}
                hint={humidityLabel(main.humidity)}
            />
            <MetricCard
                icon={<Eye className="size-4" />}
                label="Visibility"
                value={hasVisibility ? toDistance(visibility, unit) : "—"}
                hint={hasVisibility ? visibilityLabel(visibility) : "Not available"}
            />
            <MetricCard
                icon={<Gauge className="size-4" />}
                label="Pressure"
                value={toPressure(main.pressure, unit)}
                hint={pressureLabel(main.pressure)}
            />
        </section>
    );
}