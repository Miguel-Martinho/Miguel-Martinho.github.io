// Builds the project grid and the project popup from the PROJECTS list in projects.js.

const grid = document.getElementById("projectGrid");
const modal = document.getElementById("projectModal");
const modalInfo = document.getElementById("modalInfo");
const carousel = document.getElementById("carousel");
const track = document.getElementById("carouselTrack");
const dots = document.getElementById("carouselDots");
const counter = document.getElementById("carouselCounter");
const prevButton = document.getElementById("carouselPrev");
const nextButton = document.getElementById("carouselNext");

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let currentSlide = 0;
let slideCount = 0;
let lastFocused = null;

function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
}

function createMedia(item, { eager = false } = {}) {
    if (item.type === "video") {
        const video = el("video");
        video.src = item.src;
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.preload = eager ? "auto" : "metadata";
        video.setAttribute("aria-label", item.caption || "");
        return video;
    }
    const img = el("img");
    img.src = item.src;
    img.alt = item.caption || "";
    img.decoding = "async";
    if (!eager) img.loading = "lazy";
    return img;
}

// ---------- Grid ----------

function renderGrid() {
    for (const project of PROJECTS) {
        const card = el(project.comingSoon ? "div" : "button", "card");
        const media = el("div", "card-media");

        if (project.comingSoon) {
            card.classList.add("coming-soon");
            media.append(el("span", "card-title", project.title), el("span", "badge", "Coming soon"));
        } else {
            card.type = "button";
            card.setAttribute("aria-label", `Open project: ${project.title}`);
            const thumb = createMedia(project.thumbnail || project.media[0]);
            thumb.alt = "";
            media.append(thumb);

            const label = el("span", "card-label");
            label.append(el("span", "card-title", project.title));
            if (project.subtitle) label.append(el("span", "card-subtitle", project.subtitle));
            media.append(label);

            card.addEventListener("click", () => openProject(project.id, true));

            if (thumb.tagName === "VIDEO" && !reducedMotion) {
                thumb.autoplay = true;
                thumb.play().catch(() => {});
            }
        }

        card.append(media);
        grid.append(card);
    }
}

// ---------- Popup ----------

function renderInfo(project) {
    modalInfo.replaceChildren();

    const title = el("h1", null, project.title);
    title.id = "modalTitle";
    modalInfo.append(title);
    if (project.subtitle) modalInfo.append(el("p", "modal-subtitle", project.subtitle));

    const facts = [["Year", project.year], ["Role", project.role]].filter(([, value]) => value);
    if (facts.length) {
        const dl = el("dl", "facts");
        for (const [term, value] of facts) dl.append(el("dt", null, term), el("dd", null, value));
        modalInfo.append(dl);
    }

    if (project.tags?.length) {
        const tags = el("ul", "tags");
        for (const tag of project.tags) tags.append(el("li", null, tag));
        modalInfo.append(tags);
    }

    const description = el("div", "description");
    for (const paragraph of project.description || []) description.append(el("p", null, paragraph));
    modalInfo.append(description);

    if (project.links?.length) {
        const links = el("div", "project-links");
        for (const link of project.links) {
            const a = el("a", "button", link.label);
            a.href = link.url;
            a.target = "_blank";
            a.rel = "noopener";
            links.append(a);
        }
        modalInfo.append(links);
    }
}

function renderCarousel(project) {
    track.replaceChildren();
    dots.replaceChildren();
    slideCount = project.media.length;
    currentSlide = 0;

    project.media.forEach((item, i) => {
        const slide = el("div", "slide");
        slide.setAttribute("role", "group");
        slide.setAttribute("aria-label", `${i + 1} of ${slideCount}`);
        slide.append(createMedia(item, { eager: i === 0 }));
        if (item.caption) slide.append(el("p", "slide-caption", item.caption));
        track.append(slide);

        const dot = el("button", "dot");
        dot.type = "button";
        dot.setAttribute("aria-label", `Go to image ${i + 1}`);
        dot.addEventListener("click", () => goToSlide(i));
        dots.append(dot);
    });

    carousel.classList.toggle("single", slideCount <= 1);
    track.scrollLeft = 0;
    updateCarouselUI();
}

function goToSlide(index) {
    index = Math.max(0, Math.min(slideCount - 1, index));
    track.scrollTo({ left: index * track.clientWidth, behavior: reducedMotion ? "auto" : "smooth" });
}

function updateCarouselUI() {
    prevButton.disabled = currentSlide === 0;
    nextButton.disabled = currentSlide === slideCount - 1;
    counter.textContent = `${currentSlide + 1} / ${slideCount}`;
    [...dots.children].forEach((dot, i) => dot.setAttribute("aria-current", String(i === currentSlide)));

    // Only the visible video plays
    [...track.children].forEach((slide, i) => {
        const video = slide.querySelector("video");
        if (!video) return;
        if (i === currentSlide && !reducedMotion) video.play().catch(() => {});
        else video.pause();
    });
}

track.addEventListener("scroll", () => {
    const index = Math.round(track.scrollLeft / track.clientWidth);
    if (index !== currentSlide) {
        currentSlide = index;
        updateCarouselUI();
    }
}, { passive: true });

prevButton.addEventListener("click", () => goToSlide(currentSlide - 1));
nextButton.addEventListener("click", () => goToSlide(currentSlide + 1));

// Keep the current slide in place when the window is resized / phone is rotated
window.addEventListener("resize", () => {
    if (modal.open) track.scrollLeft = currentSlide * track.clientWidth;
});

function openProject(id, fromGrid = false) {
    const project = PROJECTS.find(p => p.id === id && !p.comingSoon);
    if (!project) return;

    if (fromGrid) {
        lastFocused = document.activeElement;
        history.pushState({ project: id }, "", `#project/${id}`);
    }

    renderInfo(project);
    renderCarousel(project);
    modalInfo.scrollTop = 0;
    modal.querySelector(".modal-inner").scrollTop = 0;

    if (!modal.open) modal.showModal();
    document.body.classList.add("modal-open");
    updateCarouselUI();
}

function hideModal() {
    document.body.classList.remove("modal-open");
    track.querySelectorAll("video").forEach(v => v.pause());
    if (modal.open) modal.close();
    if (lastFocused) lastFocused.focus({ preventScroll: true });
    lastFocused = null;
}

// Closing goes back in history when the popup was opened from the grid,
// so the phone's back button and the X behave the same.
function closeProject() {
    if (history.state?.project) {
        history.back();
    } else {
        history.replaceState(null, "", location.pathname + location.search + "#work");
        hideModal();
    }
}

// Safety net in case the browser closes the dialog by itself (e.g. pressing Esc twice quickly)
modal.addEventListener("close", () => {
    if (location.hash.startsWith("#project/")) closeProject();
    else hideModal();
});

document.getElementById("modalClose").addEventListener("click", closeProject);

// Esc key
modal.addEventListener("cancel", event => {
    event.preventDefault();
    closeProject();
});

// Clicking the dark backdrop around the popup
modal.addEventListener("click", event => {
    if (event.target === modal) closeProject();
});

modal.addEventListener("keydown", event => {
    if (event.key === "ArrowLeft") { event.preventDefault(); goToSlide(currentSlide - 1); }
    if (event.key === "ArrowRight") { event.preventDefault(); goToSlide(currentSlide + 1); }
});

// ---------- Links like index.html#project/nok ----------

function syncWithUrl() {
    const match = location.hash.match(/^#project\/(.+)$/);
    if (match) openProject(decodeURIComponent(match[1]));
    else hideModal();
}

window.addEventListener("popstate", syncWithUrl);

// ---------- Highlight the current section in the nav ----------

function trackActiveSection() {
    const links = [...document.querySelectorAll(".nav-link")];
    const sections = links.map(link => document.querySelector(link.getAttribute("href")));

    const observer = new IntersectionObserver(entries => {
        for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            links.forEach(link => link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`));
        }
    }, { rootMargin: "-40% 0px -55% 0px" });

    sections.forEach(section => section && observer.observe(section));
}

// ---------- Start ----------

document.getElementById("year").textContent = new Date().getFullYear();
renderGrid();
trackActiveSection();
syncWithUrl();
