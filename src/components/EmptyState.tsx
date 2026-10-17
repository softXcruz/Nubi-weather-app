// Import libraries
import { CloudSun, Loader2, MapPin } from "lucide-react";

// Types
type EmptyStateProps = {
    locating: boolean;
    onUseLocation: () => void;
};

// Define component
export default function EmptyState({ locating, onUseLocation }: EmptyStateProps) {
    return (
        <section className="grid place-items-center rounded-[20px] border border-dashed border-slate-300 bg-white px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-900">
            <CloudSun className="size-12 text-sky-600 dark:text-amber-400" aria-hidden />
            <h2 className="mt-4 text-xl font-bold text-slate-950 dark:text-white">
                Where do you want to check the weather?
            </h2>
            <p className="mt-2 max-w-sm text-sm text-slate-600 dark:text-slate-400">
                Search for a city above, or use your current location.
            </p>
            <button
                type="button"
                onClick={onUseLocation}
                disabled={locating}
                className="mt-6 inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl bg-sky-600 px-4 text-sm font-bold text-white transition-colors hover:bg-sky-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 disabled:cursor-wait disabled:opacity-70 dark:bg-amber-400 dark:text-slate-950 dark:hover:bg-amber-300 dark:focus-visible:outline-amber-400"
            >
                {locating ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <MapPin className="size-4" aria-hidden />}
                {locating ? "Finding your location…" : "Use my location"}
            </button>
        </section>
    );
}