<div align="center">

<img src="public/logo-nubi.png" alt="Nubi logo" height="72">

# Nubi

Real-time weather with city search, geolocation and light/dark themes.

[Live demo](https://nubi-weather-sxc.vercel.app) · [Report a bug](https://github.com/softXcruz/Nubi-weather-app/issues)

![React](https://img.shields.io/badge/React-20232a?logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-0F172A?logo=tailwindcss&logoColor=38BDF8)
![Vercel](https://img.shields.io/badge/Vercel-000000?logo=vercel&logoColor=white)

<img src="docs/screenshot-dark.png" alt="Nubi in dark mode" width="900">

</div>

## About

I built this to practice working with a real API end to end: search with autocomplete, geolocation, loading and error states, light and dark themes, and a deploy that keeps the API key out of the browser.

## What it does

- Shows current conditions, the next few hours, a 5-day forecast, wind, humidity, visibility, pressure and sunrise/sunset.
- Searches cities as you type and lets you pick from a list, including keyboard navigation (arrow keys, Enter, Escape).
- Asks for your location on the first visit and lets you jump back to it with one button. If you decline, you can search instead.
- Switches between °C and °F instantly, without a new request.
- Follows your system theme, or whatever you picked last, in light and dark.
- Works on phones. The header, cards and hourly strip all reflow below 768 px.

## Stack

- React 19 and TypeScript
- Vite
- Tailwind CSS v4
- OpenWeather API (geocoding, current weather, 5-day forecast)
- Vercel, with one serverless function as an API proxy
- lucide-react for icons

## Running it locally

You need Node 20 or newer and a free OpenWeather API key. New keys can take a while to activate, so a 401 on the first try is normal.

```bash
git clone https://github.com/softXcruz/Nubi-weather-app.git
cd Nubi-weather-app
npm install
```

Create a `.env.local` file in the project root:

```
VITE_OPENWEATHER_API_KEY=your_key_here
```

Then start the dev server:

```bash
npm run dev
```

Other scripts: `npm run lint`, `npm run build`, `npm run preview`.

## How it's put together

<details>
<summary>Project structure</summary>

```
src/
  components/   UI pieces (SearchBar, CurrentWeather, HourlyForecast, ...)
  hook/         useCitySearch, useCurrentWeather, useForecast, useOwnLocation, useTheme
  services/     openWeather.ts, the only file that talks to the API
  utils/        formatting, unit conversion, grouping forecast entries by day
  types/        shared TypeScript types
api/
  weather.ts    serverless proxy used in production
```

</details>

## Decisions worth mentioning

**The API key stays on the server in production.** Anything prefixed with `VITE_` ends up in the public JavaScript bundle. In development the app calls OpenWeather directly using `.env.local`. In production it calls `/api/weather`, a small Vercel function that adds the key and only forwards a short list of allowed endpoints.

**Search is debounced and cancellable.** Each keystroke restarts a 400 ms timer, and any request still in flight is aborted when the text changes. That stops a slow response for "gu" from overwriting a newer one for "guadalajara". Input is also validated before anything is sent.

**Data is always fetched in metric.** Temperature, wind, distance and pressure are converted in the browser, so changing units never costs a request.

**Times use the city's timezone, not yours.** OpenWeather returns UTC timestamps plus an offset. Looking at Tokyo from Mexico shows Tokyo's local time.

**Daily forecast is derived.** The free plan only offers forecasts in 3-hour steps, so the daily rows are built by grouping those entries by local day and taking the min, max and highest chance of rain.

**Stale responses can't win.** Weather hooks track which request a result belongs to, so switching cities quickly never shows data from the previous one.

## Limitations

- The free OpenWeather plan has no hourly forecast, so "Next hours" uses 3-hour blocks.
- The first day's High and Low only cover the part of the day that's left.
- There is no UV index or weather alerts, both of which require a paid plan.
- Geolocation needs HTTPS and some in-app browsers (Instagram, WhatsApp) block it. Open the link in Safari or Chrome.

## Deploying your own

1. Fork the repo and import it into Vercel. The Vite preset works without changes.
2. Add an environment variable named `OPENWEATHER_API_KEY`. Do not use the `VITE_` prefix.
3. Deploy.

## Credits

Weather data from [OpenWeather](https://openweathermap.org/).

Built by [Your name](https://github.com/softXcruz).
