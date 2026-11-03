// Builds the project grid and the project viewer from the PROJECTS list in projects.js.

const grid = document.getElementById("projectGrid");
const modal = document.getElementById("projectModal");
const viewerLayout = document.getElementById("viewerLayout");
const viewerMedia = document.getElementById("viewerMedia");
const modalInfo = document.getElementById("modalInfo");

const lightbox = document.getElementById("lightbox");
const carousel = document.getElementById("carousel");
const track = document.getElementById("carouselTrack");
const dots = document.getElementById("carouselDots");
const counter = document.getElementById("carouselCounter");
const prevButton = document.getElementById("carouselPrev");
const nextButton = document.getElementById("carouselNext");

const AUTHOR = {
    name: "Miguel Martinho",
    role: "3D & Environment Artist",
    picture: "assets/IMG_3291.png",
};

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const openProjects = PROJECTS.filter(p => !p.comingSoon);

let currentProject = null;
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

// Videos only play while they are on screen
const videoObserver = new IntersectionObserver(entries => {
    for (const entry of entries) {
        if (entry.isIntersecting && !reducedMotion) entry.target.play().catch(() => {});
        else entry.target.pause();
    }
}, { threshold: 0.25 });

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
            if (thumb.tagName === "VIDEO") videoObserver.observe(thumb);

            const label = el("span", "card-label");
            label.append(el("span", "card-title", project.title));
            if (project.subtitle) label.append(el("span", "card-subtitle", project.subtitle));
            media.append(label);

            card.addEventListener("click", () => openProject(project.id, true));
        }

        card.append(media);
        grid.append(card);
    }
}

// ---------- Project viewer ----------

function renderMedia(project) {
    viewerMedia.querySelectorAll("video").forEach(v => videoObserver.unobserve(v));
    viewerMedia.replaceChildren();

    // Title above the images, only shown on phones
    const mobileHeader = el("div", "viewer-mobile-header");
    mobileHeader.append(el("h2", null, project.title));
    if (project.subtitle) mobileHeader.append(el("p", null, project.subtitle));
    viewerMedia.append(mobileHeader);

    const stack = el("div", "media-stack");
    project.media.forEach((item, i) => {
        const figure = el("figure", "media-item");
        const button = el("button");
        button.type = "button";
        button.setAttribute("aria-label", `View image ${i + 1} fullscreen`);
        const media = createMedia(item, { eager: i === 0 });
        button.append(media);
        button.addEventListener("click", () => openLightbox(i));
        figure.append(button);
        if (item.caption) figure.append(el("figcaption", null, item.caption));
        stack.append(figure);
        if (media.tagName === "VIDEO") videoObserver.observe(media);
    });
    viewerMedia.append(stack);
}

function renderInfo(project) {
    modalInfo.replaceChildren();

    const author = el("div", "author");
    const avatar = el("img");
    avatar.src = AUTHOR.picture;
    avatar.alt = "";
    const authorText = el("div");
    authorText.append(el("span", "author-name", AUTHOR.name), el("span", "author-role", AUTHOR.role));
    author.append(avatar, authorText);
    modalInfo.append(author);

    const title = el("h1", null, project.title);
    title.id = "modalTitle";
    modalInfo.append(title);
    if (project.subtitle) modalInfo.append(el("p", "modal-subtitle", project.subtitle));

    const description = el("div", "description");
    for (const paragraph of project.description || []) description.append(el("p", null, paragraph));
    modalInfo.append(description);

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

    // Other projects, like "More by this artist"
    const others = openProjects.filter(p => p.id !== project.id);
    if (others.length) {
        modalInfo.append(el("h2", "info-heading", `More by ${AUTHOR.name}`));
        const more = el("div", "more-grid");
        for (const other of others) {
            const card = el("button", "more-card");
            card.type = "button";
            card.setAttribute("aria-label", `Open project: ${other.title}`);
            const thumb = createMedia(other.thumbnail || other.media[0]);
            thumb.alt = "";
            card.append(thumb, el("span", null, other.title));
            card.addEventListener("click", () => switchProject(other.id));
            more.append(card);
        }
        modalInfo.append(more);
    }
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
    viewerMedia.scrollTop = 0;
    modalInfo.scrollTop = 0;
    viewerLayout.scrollTop = 0;

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
    const next = openProjects[(index + direction + openProjects.length) % openProjects.length];
    switchProject(next.id);
}

document.getElementById("projectPrev").addEventListener("click", () => stepProject(-1));
document.getElementById("projectNext").addEventListener("click", () => stepProject(1));

function hideModal() {
    closeLightbox();
    document.body.classList.remove("modal-open");
    modal.querySelectorAll("video").forEach(v => v.pause());
    if (modal.open) modal.close();
    if (lastFocused) lastFocused.focus({ preventScroll: true });
    lastFocused = null;
}

// Closing goes back in history when the viewer was opened from the grid,
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

// Esc closes the fullscreen image first, then the project
modal.addEventListener("cancel", event => {
    event.preventDefault();
    if (!lightbox.hidden) closeLightbox();
    else closeProject();
});

modal.addEventListener("keydown", event => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    const direction = event.key === "ArrowLeft" ? -1 : 1;
    event.preventDefault();
    if (!lightbox.hidden) goToSlide(currentSlide + direction);
    else stepProject(direction);
});

// ---------- Fullscreen lightbox ----------

function openLightbox(index) {
    track.replaceChildren();
    dots.replaceChildren();
    slideCount = currentProject.media.length;

    currentProject.media.forEach((item, i) => {
        const slide = el("div", "slide");
        slide.setAttribute("role", "group");
        slide.setAttribute("aria-label", `${i + 1} of ${slideCount}`);
        slide.append(createMedia(item, { eager: Math.abs(i - index) <= 1 }));
        if (item.caption) slide.append(el("p", "slide-caption", item.caption));
        track.append(slide);

        const dot = el("button", "dot");
        dot.type = "button";
        dot.setAttribute("aria-label", `Go to image ${i + 1}`);
        dot.addEventListener("click", () => goToSlide(i));
        dots.append(dot);
    });

    carousel.classList.toggle("single", slideCount <= 1);
    modal.querySelectorAll(".viewer-media video").forEach(v => v.pause());
    lightbox.hidden = false;
    currentSlide = index;
    track.scrollLeft = index * track.clientWidth;
    updateCarouselUI();
    track.focus({ preventScroll: true });
}

function closeLightbox() {
    if (lightbox.hidden) return;
    lightbox.hidden = true;
    track.querySelectorAll("video").forEach(v => v.pause());
    track.replaceChildren();
    // Let the observer restart whichever stacked videos are visible
    viewerMedia.querySelectorAll("video").forEach(v => {
        videoObserver.unobserve(v);
        videoObserver.observe(v);
    });
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
document.getElementById("lightboxClose").addEventListener("click", closeLightbox);

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
