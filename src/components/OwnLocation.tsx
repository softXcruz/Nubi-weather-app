// Import libraries
import { Loader2, MapPinIcon } from "lucide-react";

// Types
type OwnLocationProps = {
    active: boolean;   // the current city is the user's location
    loading: boolean;  // waiting for the browser / API
    onClick: () => void;
}

// Define the component
export default function OwnLocation({ active, loading, onClick }: OwnLocationProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={loading}
            aria-label="Use my location"
            aria-pressed={active}
            title="Use my location"
            className={`relative grid size-10 place-items-center rounded-2xl border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-wait
                ${active
                    ? 'border-red-200 bg-red-600 text-white hover:bg-red-500 focus-visible:outline-red-600 dark:border-red-400'
                    : 'border-slate-200 bg-white text-slate-600 hover:text-slate-900 focus-visible:outline-sky-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:text-slate-50'}
                ${loading ? '' : 'cursor-pointer'}
            `}
        >
            {loading ? <Loader2 className="size-5 animate-spin" aria-hidden /> : <MapPinIcon className="size-5" aria-hidden />}
        </button>
    )
}