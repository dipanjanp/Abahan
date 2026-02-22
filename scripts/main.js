// Force light theme for now.
document.documentElement.setAttribute("data-theme", "day");

const menuBtn = document.querySelector(".menu-btn");
const navLinks = document.getElementById("mainNavLinks");
const mobileQuery = window.matchMedia("(max-width: 980px)");

function closeMenu() {
	if (!menuBtn || !navLinks) return;
	navLinks.classList.remove("menu-open");
	menuBtn.setAttribute("aria-expanded", "false");
}

if (menuBtn && navLinks) {
	menuBtn.addEventListener("click", () => {
		const nextOpen = !navLinks.classList.contains("menu-open");
		navLinks.classList.toggle("menu-open", nextOpen);
		menuBtn.setAttribute("aria-expanded", String(nextOpen));
	});

	document.addEventListener("click", (event) => {
		if (!mobileQuery.matches) return;
		const target = event.target;
		if (!(target instanceof Element)) return;
		if (menuBtn.contains(target) || navLinks.contains(target)) return;
		closeMenu();
	});

	navLinks.querySelectorAll("a").forEach((link) => {
		link.addEventListener("click", closeMenu);
	});

	mobileQuery.addEventListener("change", () => {
		if (!mobileQuery.matches) closeMenu();
	});
}
