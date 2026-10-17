// Import libraries
import {
    Cloud, CloudDrizzle, CloudFog, CloudLightning,
    CloudMoon, CloudRain, CloudSnow, CloudSun, Moon, Sun,
} from "lucide-react";

// Types
type WeatherIconProps = {
    id: number; 
    isDay: boolean;
    className?: string;
};

// Colors
const SUN = "text-amber-500 dark:text-amber-400";
const WET = "text-sky-600 dark:text-sky-400";
const GREY = "text-slate-500 dark:text-slate-300";

// Define component
export default function WeatherIcon({ id, isDay, className = "" }: WeatherIconProps) {
    const cls = (color: string) => `${className} ${color}`;

    if (id >= 200 && id < 300) return <CloudLightning className={cls(WET)} aria-hidden />;
    if (id >= 300 && id < 400) return <CloudDrizzle className={cls(WET)} aria-hidden />;
    if (id >= 500 && id < 600) return <CloudRain className={cls(WET)} aria-hidden />;
    if (id >= 600 && id < 700) return <CloudSnow className={cls(WET)} aria-hidden />;
    if (id >= 700 && id < 800) return <CloudFog className={cls(GREY)} aria-hidden />;
    if (id === 800) {
        return isDay
            ? <Sun className={cls(SUN)} aria-hidden />
            : <Moon className={cls(GREY)} aria-hidden />;
    }
    if (id === 801 || id === 802) {
        return isDay
            ? <CloudSun className={cls(SUN)} aria-hidden />
            : <CloudMoon className={cls(GREY)} aria-hidden />;
    }
    return <Cloud className={cls(GREY)} aria-hidden />; // 803, 804 and anything unknown
}