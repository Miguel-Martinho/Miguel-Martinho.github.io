// Builds the project grids and the project viewer from the PROJECTS list in projects.js.

const $ = id => document.getElementById(id);

const modal = $("projectModal");
const viewerLayout = $("viewerLayout");
const viewerMedia = $("viewerMedia");
const modalInfo = $("modalInfo");

const lightbox = $("lightbox");
const carousel = $("carousel");
const track = $("carouselTrack");
const dots = $("carouselDots");
const counter = $("carouselCounter");
const prevButton = $("carouselPrev");
const nextButton = $("carouselNext");

// Name, role and picture come from the sidebar, so they only need changing in index.html
const AUTHOR = {
    name: document.querySelector(".profile-name").textContent,
    role: document.querySelector(".profile-role").textContent,
    picture: document.querySelector(".profile-pic").getAttribute("src"),
};

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const canHover = window.matchMedia("(hover: hover)").matches;
const openProjects = PROJECTS.filter(p => !p.comingSoon);

let currentProject = null;
let currentSlide = 0;
let slideCount = 0;
let lastFocused = null;

// ---------- Helpers ----------

// el("button", { className: "dot", "aria-label": "…", onclick: fn }, child, "text", …)
// Props become properties when the element has one (src, type, hidden…), attributes otherwise,
// and "on…" props become event listeners. Empty children are skipped.
function el(tag, props = {}, ...children) {
    const node = document.createElement(tag);
    for (const [key, value] of Object.entries(props)) {
        if (value == null) continue;
        if (key.startsWith("on")) node.addEventListener(key.slice(2), value);
        else if (key in node) node[key] = value;
        else node.setAttribute(key, value);
    }
    node.append(...children.filter(child => child != null && child !== ""));
    return node;
}

function createMedia(item, { eager = false, decorative = false } = {}) {
    const label = decorative ? "" : item.caption || "";
    if (item.type === "video") {
        return el("video", {
            src: item.src, muted: true, loop: true, playsInline: true,
            preload: eager ? "auto" : "metadata", "aria-label": label,
        });
    }
    return el("img", { src: item.src, alt: label, decoding: "async", loading: eager ? null : "lazy" });
}

const thumbnailOf = project => createMedia(project.thumbnail || project.media[0], { decorative: true });

function play(video) {
    if (!reducedMotion) video.play().catch(() => {});
}

function pauseVideos(container) {
    container.querySelectorAll("video").forEach(video => video.pause());
}

// Videos only play while they are on screen
const videoObserver = new IntersectionObserver(entries => {
    for (const entry of entries) {
        if (entry.isIntersecting) play(entry.target);
        else entry.target.pause();
    }
}, { threshold: 0.25 });

function observeVideos(container) {
    container.querySelectorAll("video").forEach(video => videoObserver.observe(video));
}

function unobserveVideos(container) {
    container.querySelectorAll("video").forEach(video => videoObserver.unobserve(video));
}

// ---------- Grid ----------

// Grid videos sit still on their first frame and only play while hovered.
// Phones and tablets can't hover, so there they play while on screen instead.
function playOnHover(card, video) {
    if (!canHover) return videoObserver.observe(video);
    video.preload = "auto"; // so the first frame shows while it waits
    card.addEventListener("mouseenter", () => play(video));
    card.addEventListener("mouseleave", () => video.pause());
}

function createCard(project) {
    if (project.comingSoon) {
        return el("div", { className: "card coming-soon" },
            el("div", { className: "card-media" },
                el("span", { className: "card-title" }, project.title),
                el("span", { className: "badge" }, "Coming soon")));
    }

    const thumb = thumbnailOf(project);
    const card = el("button", {
        className: "card", type: "button", "aria-label": `Open project: ${project.title}`,
        onclick: () => openProject(project.id, true),
    }, el("div", { className: "card-media" }, thumb,
        el("span", { className: "card-label" },
            el("span", { className: "card-title" }, project.title),
            // Always present (blank if there's no subtitle) so every box is the same height
            el("span", { className: "card-subtitle" }, project.subtitle || " "))));

    if (thumb.tagName === "VIDEO") playOnHover(card, thumb);
    return card;
}

// Each grid (Portfolio, Experience) shows the projects whose category matches its data-category
function renderGrids() {
    document.querySelectorAll(".project-grid[data-category]").forEach(grid => {
        grid.append(...PROJECTS.filter(p => p.category === grid.dataset.category).map(createCard));
    });
}

// ---------- Project viewer ----------

function renderMedia(project) {
    unobserveVideos(viewerMedia);
    viewerMedia.replaceChildren(
        // Title above the images, only shown on phones
        el("div", { className: "viewer-mobile-header" },
            el("h2", {}, project.title),
            project.subtitle && el("p", {}, project.subtitle)),
        el("div", { className: "media-stack" }, ...project.media.map((item, i) =>
            el("figure", { className: "media-item" },
                el("button", { type: "button", "aria-label": `View image ${i + 1} fullscreen`, onclick: () => openLightbox(i) },
                    createMedia(item, { eager: i === 0 })),
                item.caption && el("figcaption", {}, item.caption)))),
    );
    observeVideos(viewerMedia);
}

function renderInfo(project) {
    const facts = [["Year", project.year], ["Role", project.role]].filter(([, value]) => value);
    const others = openProjects.filter(p => p.id !== project.id);

    modalInfo.replaceChildren(...[
        el("div", { className: "author" },
            el("img", { src: AUTHOR.picture, alt: "" }),
            el("div", {},
                el("span", { className: "author-name" }, AUTHOR.name),
                el("span", { className: "author-role" }, AUTHOR.role))),

        el("h1", { id: "modalTitle" }, project.title),
        project.subtitle && el("p", { className: "modal-subtitle" }, project.subtitle),

        el("div", { className: "description" }, ...(project.description || []).map(text => el("p", {}, text))),

        facts.length && el("dl", { className: "facts" },
            ...facts.flatMap(([term, value]) => [el("dt", {}, term), el("dd", {}, value)])),

        project.tags?.length && el("ul", { className: "tags" }, ...project.tags.map(tag => el("li", {}, tag))),

        project.links?.length && el("div", { className: "project-links" }, ...project.links.map(link =>
            el("a", { className: "button", href: link.url, target: "_blank", rel: "noopener" }, link.label))),

        // Other projects, like "More by this artist"
        others.length && el("h2", { className: "info-heading" }, `More by ${AUTHOR.name}`),
        others.length && el("div", { className: "more-grid" }, ...others.map(other =>
            el("button", {
                className: "more-card", type: "button", "aria-label": `Open project: ${other.title}`,
                onclick: () => switchProject(other.id),
            }, thumbnailOf(other), el("span", {}, other.title)))),
    ].filter(Boolean));
}

function openProject(id, fromGrid = false) {
    const project = openProjects.find(p => p.id === id);
    if (!project) return;

    if (fromGrid) {
        lastFocused = document.activeElement;
        history.pushState({ project: id }, "", `#project/${id}`);
    }

    currentProject = project;
    closeLightbox();
    renderMedia(project);
    renderInfo(project);
    for (const scroller of [viewerMedia, modalInfo, viewerLayout]) scroller.scrollTop = 0;

    if (!modal.open) modal.showModal();
    document.body.classList.add("modal-open");
}

// Moving between projects inside the viewer replaces the link instead of adding history,
// so "close" / the back button still go straight back to the grid.
function switchProject(id) {
    history.replaceState(history.state ? { project: id } : null, "", `#project/${id}`);
    openProject(id);
}

function stepProject(direction) {
    const index = openProjects.indexOf(currentProject);
    switchProject(openProjects[(index + direction + openProjects.length) % openProjects.length].id);
}

function hideModal() {
    closeLightbox();
    document.body.classList.remove("modal-open");
    pauseVideos(modal);
    if (modal.open) modal.close();
    lastFocused?.focus({ preventScroll: true });
    lastFocused = null;
}

// Closing goes back in history when the viewer was opened from the grid,
// so the phone's back button and the X behave the same.
function closeProject() {
    if (history.state?.project) return history.back();
    // Land back on the section the project belongs to
    history.replaceState(null, "", `${location.pathname}${location.search}#${currentProject?.category || "portfolio"}`);
    hideModal();
}

$("projectPrev").addEventListener("click", () => stepProject(-1));
$("projectNext").addEventListener("click", () => stepProject(1));
$("modalClose").addEventListener("click", closeProject);

// Safety net in case the browser closes the dialog by itself (e.g. pressing Esc twice quickly)
modal.addEventListener("close", () => {
    if (location.hash.startsWith("#project/")) closeProject();
    else hideModal();
});

// Esc closes the fullscreen image first, then the project
modal.addEventListener("cancel", event => {
    event.preventDefault();
    if (!lightbox.hidden) closeLightbox();
    else closeProject();
});

// ← / → move between images in fullscreen, otherwise between projects
modal.addEventListener("keydown", event => {
    const direction = { ArrowLeft: -1, ArrowRight: 1 }[event.key];
    if (!direction) return;
    event.preventDefault();
    if (!lightbox.hidden) goToSlide(currentSlide + direction);
    else stepProject(direction);
});

// ---------- Fullscreen lightbox ----------

function openLightbox(index) {
    const media = currentProject.media;
    slideCount = media.length;

    track.replaceChildren(...media.map((item, i) =>
        el("div", { className: "slide", role: "group", "aria-label": `${i + 1} of ${slideCount}` },
            createMedia(item, { eager: Math.abs(i - index) <= 1 }),
            item.caption && el("p", { className: "slide-caption" }, item.caption))));
    dots.replaceChildren(...media.map((_, i) =>
        el("button", { className: "dot", type: "button", "aria-label": `Go to image ${i + 1}`, onclick: () => goToSlide(i) })));

    carousel.classList.toggle("single", slideCount <= 1);
    pauseVideos(viewerMedia);
    lightbox.hidden = false;
    currentSlide = index;
    track.scrollLeft = index * track.clientWidth;
    updateCarouselUI();
    track.focus({ preventScroll: true });
}

function closeLightbox() {
    if (lightbox.hidden) return;
    lightbox.hidden = true;
    pauseVideos(track);
    track.replaceChildren();
    // Re-observing makes the observer restart whichever stacked videos are visible
    unobserveVideos(viewerMedia);
    observeVideos(viewerMedia);
}

function goToSlide(index) {
    index = Math.max(0, Math.min(slideCount - 1, index));
    track.scrollTo({ left: index * track.clientWidth, behavior: reducedMotion ? "auto" : "smooth" });
}

function updateCarouselUI() {
    prevButton.disabled = currentSlide === 0;
    nextButton.disabled = currentSlide === slideCount - 1;
    counter.textContent = `${currentSlide + 1} / ${slideCount}`;
    [...dots.children].forEach((dot, i) => dot.setAttribute("aria-current", i === currentSlide));

    // Only the visible video plays
    [...track.children].forEach((slide, i) => {
        const video = slide.querySelector("video");
        if (video) i === currentSlide ? play(video) : video.pause();
    });
}

track.addEventListener("scroll", () => {
    const index = Math.round(track.scrollLeft / track.clientWidth);
    if (index === currentSlide) return;
    currentSlide = index;
    updateCarouselUI();
}, { passive: true });

prevButton.addEventListener("click", () => goToSlide(currentSlide - 1));
nextButton.addEventListener("click", () => goToSlide(currentSlide + 1));
$("lightboxClose").addEventListener("click", closeLightbox);

// Clicking the dark area around a fullscreen image closes it
track.addEventListener("click", event => {
    if (event.target.classList.contains("slide")) closeLightbox();
});

// Keep the current slide in place when the window is resized / phone is rotated
window.addEventListener("resize", () => {
    if (!lightbox.hidden) track.scrollLeft = currentSlide * track.clientWidth;
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

    const observer = new IntersectionObserver(entries => {
        for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            links.forEach(link => link.classList.toggle("active", link.hash === `#${entry.target.id}`));
        }
    }, { rootMargin: "-40% 0px -55% 0px" });

    links.forEach(link => observer.observe(document.querySelector(link.hash)));
}

// ---------- Start ----------

$("year").textContent = new Date().getFullYear();
renderGrids();
trackActiveSection();
syncWithUrl();
