// Import libraries
import { useEffect, useId, useRef, useState } from "react";
import { Loader2, MapPin, Search, X } from "lucide-react";
import { citySubtitle } from "../utils/city";
import { useCitySearch } from "../hook/useCitySearch";
import type { GeoLocation } from "../types/Weather";

// Define types
type SearchBarProps = {
  onSelect: (city: GeoLocation) => void;
};

// Define component
export default function SearchBar({ onSelect }: SearchBarProps) {
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const containerRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();

  const { results, status, error, validationMessage } = useCitySearch(value, open);

  // Close the list when clicking outside
  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, []);

  const handleChange = (text: string) => {
    setValue(text);
    setOpen(true);
    setActiveIndex(-1);
  };

  const handleClear = () => {
    setValue("");
    setActiveIndex(-1);
    inputRef.current?.focus();
  };

  const handleSelect = (city: GeoLocation) => {
    onSelect(city);
    setValue(city.name);
    setOpen(false);
    setActiveIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!open) return setOpen(true);
        if (results.length) setActiveIndex((i) => (i + 1) % results.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        if (results.length) setActiveIndex((i) => (i <= 0 ? results.length - 1 : i - 1));
        break;
      case "Enter":
        e.preventDefault();
        if (open && results.length) handleSelect(results[activeIndex >= 0 ? activeIndex : 0]);
        break;
      case "Escape":
        if (open) setOpen(false); // first Escape closes the list
        else handleClear(); // second Escape clears the text
        break;
    }
  };

  // Is there something to show in the dropdown?
  const showDropdown = open && (Boolean(validationMessage) || status !== "idle");
  const showList = status === "success" && results.length > 0;
  const activeId = activeIndex >= 0 ? `${listId}-${activeIndex}` : undefined;

  return (
    <form ref={containerRef} onSubmit={(e) => e.preventDefault()} className="relative w-full">
      <label htmlFor="search" className="sr-only">Search city</label>
      <Search className="absolute left-4 top-3 size-4 text-slate-500" aria-hidden />

      <input
        ref={inputRef}
        id="search"
        type="search"
        role="combobox"
        aria-expanded={showDropdown}
        aria-controls={listId}
        aria-activedescendant={activeId}
        aria-autocomplete="list"
        aria-invalid={Boolean(validationMessage || error)}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        maxLength={80}
        autoComplete="off"
        placeholder="Search city"
        className="h-10 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-10 text-base md:text-[15px] font-medium text-slate-900 outline-none transition-shadow placeholder:text-slate-500 focus:border-sky-600 focus:ring-4 focus:ring-sky-600/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 dark:placeholder:text-slate-400 dark:focus:border-amber-400 dark:focus:ring-amber-400/20 [&::-webkit-search-cancel-button]:appearance-none"
      />

      {/* Right icon: spinner while loading, X when there is text */}
      {status === "loading" ? (
        <Loader2 className="absolute right-3 top-3 size-4 animate-spin text-slate-500 dark:text-slate-400" aria-hidden />
      ) : (
        value && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear search"
            className="absolute right-2 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-sky-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-50 dark:focus-visible:outline-amber-400"
          >
            <X className="size-4" aria-hidden />
          </button>
        )
      )}

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute left-0 top-full z-20 mt-2 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900">
          {showList ? (
            <ul id={listId} role="listbox" aria-label="City suggestions" className="max-h-80 overflow-y-auto py-2">
              {results.map((city, i) => (
                <li
                  key={`${city.lat}-${city.lon}`}
                  id={`${listId}-${i}`}
                  role="option"
                  aria-selected={i === activeIndex}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleSelect(city)}
                  onMouseEnter={() => setActiveIndex(i)}
                  className={`flex cursor-pointer items-center gap-3 px-4 py-2.5 ${i === activeIndex ? "bg-slate-100 dark:bg-slate-800" : ""
                    }`}
                >
                  <MapPin className="size-4 shrink-0 text-slate-500 dark:text-slate-400" aria-hidden />
                  <span className="min-w-0">
                    <span className="block truncate text-[15px] font-semibold text-slate-900 dark:text-slate-50">
                      {city.name}
                    </span>
                    <span className="block truncate text-sm text-slate-600 dark:text-slate-400">
                      {citySubtitle(city)}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p
              id={listId}
              role="status"
              className={`px-4 py-3 text-sm ${error ? "text-red-600 dark:text-red-400" : "text-slate-600 dark:text-slate-400"
                }`}
            >
              {error ??
                validationMessage ??
                (status === "empty" ? "No cities found" : "Searching…")}
            </p>
          )}
        </div>
      )}
    </form>
  );
}