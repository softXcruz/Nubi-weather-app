export default function Footer() {
    return (
        <footer className="mt-4 text-center text-[13px] text-slate-600 dark:text-slate-400">
            Weather data by{" "}
            <a
                href="https://openweathermap.org/"
                target="_blank"
                rel="noreferrer"
                className="font-semibold underline hover:text-slate-950 dark:hover:text-white"
            >
                OpenWeather
            </a>
        </footer>
    );
}