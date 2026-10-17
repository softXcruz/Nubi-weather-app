// Import libraries
import type { Unit } from "../types/Weather";

// Define types
type UnitToggleProps = {
    unit: Unit;
    onChange: (u: Unit) => void;
}

// Define the component
export default function UnitToggle({ unit, onChange }: UnitToggleProps) {
    return (
        <div className="flex h-10 gap-1 rounded-2xl border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900">
            {(["c", "f"] as const).map((u) => (
                <button
                    key={u}
                    type="button"
                    onClick={() => onChange(u)}
                    aria-pressed={unit === u}
                    className={`rounded-xl cursor-pointer px-4 text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 dark:focus-visible:outline-sky-400 ${unit === u
                            ? "bg-sky-600 text-white dark:bg-amber-400"
                            : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50"
                        }`}
                >
                    °{u.toUpperCase()}
                </button>
            ))}
        </div>
    );
}