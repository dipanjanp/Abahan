// ------------------------------------------------------------
// Theme: Toggle (Day/Night)
// - data-theme: actual applied (day/night)
// ------------------------------------------------------------

const html = document.documentElement;
const THEME_KEY = "abahan_theme_mode"; // day | night

const btn = document.getElementById("themeToggle");
const icon = btn.querySelector("i");

function apply(theme) {
	html.setAttribute("data-theme", theme);
	localStorage.setItem(THEME_KEY, theme);
	icon.className = theme === "night" ? "fa-solid fa-sun" : "fa-solid fa-moon";
	btn.setAttribute("aria-label", theme === "night" ? "Switch to light mode" : "Switch to dark mode");
}

function inferTheme() {
	const hour = new Date().getHours();
	return (hour >= 7 && hour < 18) ? "day" : "night";
}

// Init from saved preference, fall back to time-based
const saved = localStorage.getItem(THEME_KEY);
apply(saved || inferTheme());

btn.addEventListener("click", () => {
	apply(html.getAttribute("data-theme") === "night" ? "day" : "night");
});
