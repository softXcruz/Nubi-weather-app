// Import libraries
import SearchBar from "./SearchBar";
import UnitToggle from "./UnitToggle";
import ThemeToggle from "./controls/ThemeToggle";
import type { GeoLocation, Unit } from "../types/Weather";
import OwnLocation from "./OwnLocation";

// Types
type HeaderProps = {
    unit: Unit;
    onUnitChange: (u: Unit) => void;
    dark: boolean;
    onThemeToggle: () => void;
    onCitySelect: (city: GeoLocation) => void;
    ownLocationActive: boolean;
    locating: boolean;
    onOwnLocation: () => void;
}

// Define Header component
export default function Header({ unit, onUnitChange, dark, onThemeToggle, onCitySelect, ownLocationActive, locating, onOwnLocation }: HeaderProps) {
    return (
        <header className="mb-6 flex flex-wrap items-center justify-between gap-x-3 gap-y-4 md:mb-8 md:flex-nowrap md:gap-6">
            {/* Logo */}
            <div className="flex items-center gap-2">
                <img src="/logo-nubi.png" alt="logo" className="h-8" />
                <h1 className="text-2xl font-bold text-slate-950 md:text-3xl dark:text-white">Nubi</h1>
            </div>

            {/* Search*/}
            <div className="order-3 w-full md:order-0 md:ml-auto md:max-w-md md:flex-1">
                <SearchBar onSelect={onCitySelect}/>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
                <UnitToggle unit={unit} onChange={onUnitChange} />
                <OwnLocation active={ownLocationActive} loading={locating} onClick={onOwnLocation} />
                <ThemeToggle dark={dark} onToggle={onThemeToggle} />
            </div>
        </header>
    )
}
