// Import libraries
import { useCallback, useEffect, useState } from "react";

// Types
type Theme = "light" | "dark";

// Constants
const STORAGE_KEY = "theme";

function getInitialTheme(): Theme {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved === "light" || saved === "dark") return saved;
    } catch {
        // localStorage is blocked: fall back to the system preference
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function useTheme() {
    const [theme, setTheme] = useState<Theme>(getInitialTheme);

    useEffect(() => {
        document.documentElement.classList.toggle("dark", theme === "dark");
        try {
            localStorage.setItem(STORAGE_KEY, theme);
        } catch {
            // localStorage is blocked: the theme still works, it just won't be remembered
        }
    }, [theme]);

    const toggle = useCallback(
        () => setTheme((t) => (t === "dark" ? "light" : "dark")),
        []
    );

    return { theme, dark: theme === "dark", toggle };
}