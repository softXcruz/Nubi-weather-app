// Import libraries
import { Moon, Sun } from "lucide-react";

// Define the types
type ThemeToggleProps = {
    dark: boolean;
    onToggle: () => void;
}

// Define the component
export default function ThemeToggle({ dark, onToggle }: ThemeToggleProps) {
    return (
        <button
            type="button"
            onClick={onToggle}
            aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
            title={dark ? "Light theme" : "Dark theme"}
            className="relative grid size-10 place-items-center cursor-pointer rounded-2xl border border-slate-200 bg-white text-slate-600 transition-colors hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:text-slate-50 dark:focus-visible:outline-sky-400"
        >
            <Sun
                className={`absolute size-5 transition-all duration-300 ${dark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
                    }`}
                aria-hidden
            />
            <Moon
                className={`absolute size-5 transition-all duration-300 ${dark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
                    }`}
                aria-hidden
            />
        </button>
    );
}