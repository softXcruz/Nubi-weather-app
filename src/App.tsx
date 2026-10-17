// Import libraries
import { useCallback, useEffect, useRef, useState } from "react";
import { useMemo } from "react";
import EmptyState from "./components/EmptyState";
import Footer from "./components/Footer";
import { toTemp } from "./utils/weather";
import MetricsGrid from "./components/MetricsGrid";
import SunCard from "./components/SunCard";
import Header from "./components/Header"
import { useTheme } from "./hook/useTheme"
import { useOwnLocation } from "./hook/useOwnLocation";
import type { GeoLocation, Unit } from "./types/Weather";
import { loadSavedCity, saveCity } from "./utils/city";
import CurrentWeather from "./components/CurrentWeather";
import { useCurrentWeather } from "./hook/useCurrentWeather";
import { useForecast } from "./hook/useForecast";
import { groupByDay } from "./utils/weather";
import HourlyForecast from "./components/HourlyForecast";
import DailyForecast from "./components/DailyForecast";

// Define main component
function App() {
  // State to toggling the theme
  const { dark, toggle } = useTheme();
  // State for unit
  const [unit, setUnit] = useState<Unit>("c");
  // State for the selected city (restored from localStorage if it exists)
  const [city, setCity] = useState<GeoLocation | null>(loadSavedCity);

  // Called when the browser gives us the user's location
  const handleLocated = useCallback((located: GeoLocation) => {
    setCity(located);
    saveCity(located);
  }, []);

  const { status, message, locate, reset } = useOwnLocation(handleLocated);

  const { data: weather, status: weatherStatus, error: weatherError, retry } = useCurrentWeather(city);
  const { data: forecast, status: forecastStatus, error: forecastError, retry: retryForecast } = useForecast(city);

  // Group the 3-hour entries into days (only recalculated when the forecast changes)
  const days = useMemo(
    () => (forecast ? groupByDay(forecast.list, forecast.city.timezone) : []),
    [forecast]
  );

  // Today's real High/Low (the forecast range, widened with the current temperature)
  const todayRange =
    days[0] && weather
      ? { max: Math.max(days[0].max, weather.main.temp), min: Math.min(days[0].min, weather.main.temp) }
      : null;

  // Called when the user picks a city from the search
  const handleCitySelect = (selected: GeoLocation) => {
    reset(); // cancel any pending location request and hide messages
    setCity(selected);
    saveCity(selected);
  };

  // On the first visit (no saved city) ask for the location once
  const askedRef = useRef(false);
  useEffect(() => {
    if (askedRef.current) return; // StrictMode runs effects twice in dev
    askedRef.current = true;
    if (!city) locate();
  }, [city, locate]);

  // Show the temperature and city in the browser tab
  useEffect(() => {
    if (city && weather) {
      const place = city.name === "My location" ? weather.name : city.name;
      document.title = `${toTemp(weather.main.temp, unit)}° ${place} | Nubi`;
    } else {
      document.title = "Nubi | Real-Time Weather";
    }
  }, [city, weather, unit]);

  return (
    <>
      <div className="mx-auto max-w-340 min-h-screen px-4 py-6 sm:px-10">
        <Header
          unit={unit}
          onUnitChange={setUnit}
          dark={dark}
          onThemeToggle={toggle}
          onCitySelect={handleCitySelect}
          ownLocationActive={Boolean(city?.isOwn)}
          locating={status === "locating"}
          onOwnLocation={() => locate(true)}
        />

        {/* Location feedback */}
        {(status === "locating" || message) && (
          <p
            role="status"
            className={`mb-4 rounded-2xl border px-4 py-3 text-sm ${message
              ? "border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200"
              : "border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400"
              }`}
          >
            {message ?? "Finding your location…"}
          </p>
        )}
        {message && !city && (
          <p role="status" className="mb-4 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200">
            {message}
          </p>
        )}

        {city ? (
          <main className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            <div className="flex min-w-0 flex-col gap-6">
              <CurrentWeather
                city={city}
                weather={weather}
                status={weatherStatus}
                error={weatherError}
                unit={unit}
                range={todayRange}
                onRetry={retry}
              />
              <HourlyForecast
                current={weather}
                forecast={forecast}
                status={forecastStatus}
                error={forecastError}
                unit={unit}
                onRetry={retryForecast}
              />
              <MetricsGrid
                weather={weather}
                unit={unit}
              />
            </div>

            <aside className="flex min-w-0 flex-col gap-6">
              <DailyForecast
                days={days}
                timezone={forecast?.city.timezone ?? 0}
                status={forecastStatus}
                unit={unit}
              />
              <SunCard
                weather={weather}
              />
            </aside>
          </main>
        ) : (
          <main>
            <EmptyState locating={status === "locating"} onUseLocation={() => locate(true)} />
          </main>
        )}
        <Footer/>
      </div>
    </>
  )
}

export default App