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

const galleryModal = document.getElementById("galleryModal");
const galleryModalImage = document.getElementById("galleryModalImage");
const galleryModalCaption = document.getElementById("galleryModalCaption");
const galleryTrack = document.getElementById("galleryTrack");

function buildGalleryGroup(images, isClone = false) {
	const group = document.createElement("div");
	group.className = "gallery-group";
	if (isClone) {
		group.setAttribute("aria-hidden", "true");
	}

	images.forEach((image) => {
		const button = document.createElement("button");
		button.className = "gallery-item";
		button.type = "button";
		button.dataset.galleryImage = image.full || image.thumb;
		button.dataset.galleryCaption = image.caption || "Gallery image";
		if (isClone) {
			button.setAttribute("tabindex", "-1");
			button.setAttribute("aria-hidden", "true");
		}

		const img = document.createElement("img");
		img.src = image.thumb;
		img.alt = isClone ? "" : image.alt || image.caption || "Gallery image";
		button.appendChild(img);
		group.appendChild(button);
	});

	return group;
}

async function loadGallery() {
	if (!galleryTrack) return;
	const fromWindow = window.GALLERY_IMAGES;
	const isFileProtocol = window.location.protocol === "file:";

	if (isFileProtocol) {
		if (!Array.isArray(fromWindow) || fromWindow.length === 0) return;
		galleryTrack.innerHTML = "";
		galleryTrack.appendChild(buildGalleryGroup(fromWindow, false));
		galleryTrack.appendChild(buildGalleryGroup(fromWindow, true));
		return;
	}

	try {
		const res = await fetch("data/gallery-images.json");
		if (!res.ok) throw new Error("Gallery JSON fetch failed");
		const images = await res.json();
		if (!Array.isArray(images) || images.length === 0) throw new Error("Gallery JSON empty");
		galleryTrack.innerHTML = "";
		galleryTrack.appendChild(buildGalleryGroup(images, false));
		galleryTrack.appendChild(buildGalleryGroup(images, true));
	} catch (_error) {
		if (!Array.isArray(fromWindow) || fromWindow.length === 0) return;
		galleryTrack.innerHTML = "";
		galleryTrack.appendChild(buildGalleryGroup(fromWindow, false));
		galleryTrack.appendChild(buildGalleryGroup(fromWindow, true));
	}
}

function closeGalleryModal() {
	if (!galleryModal || !galleryModalImage || !galleryModalCaption) return;
	galleryModal.hidden = true;
	galleryModalImage.src = "";
	galleryModalImage.alt = "";
	galleryModalCaption.textContent = "";
	document.body.classList.remove("modal-open");
}

if (galleryModal && galleryModalImage && galleryModalCaption) {
	if (galleryTrack) {
		galleryTrack.addEventListener("click", (event) => {
			const target = event.target;
			if (!(target instanceof Element)) return;
			const item = target.closest(".gallery-item");
			if (!item || item.getAttribute("aria-hidden") === "true") return;
			const image = item.dataset.galleryImage;
			if (!image) return;
			const caption = item.dataset.galleryCaption || "Gallery image";
			galleryModalImage.src = image;
			galleryModalImage.alt = caption;
			galleryModalCaption.textContent = caption;
			galleryModal.hidden = false;
			document.body.classList.add("modal-open");
		});
	}

	galleryModal.querySelectorAll("[data-gallery-close]").forEach((closeEl) => {
		closeEl.addEventListener("click", closeGalleryModal);
	});

	document.addEventListener("keydown", (event) => {
		if (event.key === "Escape" && !galleryModal.hidden) {
			closeGalleryModal();
		}
	});
}

loadGallery();
