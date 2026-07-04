import { projects } from "./projects.js";

const worksGrid = document.getElementById("works-grid");
const drawer = document.getElementById("story-drawer");
const drawerContent = document.getElementById("drawer-content");
const drawerClose = document.getElementById("drawer-close");
const glitchTitle = document.getElementById("glitch-title");
const siteTag = document.querySelector(".site-tag");

const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const digitalPattern = /post digital|postdigital|digital|algorithm|ki|ar\/vr|3d|midjourney|clo3d|daten|interface/i;

const isPostdigital = (project) =>
  digitalPattern.test([project.title, project.meta, project.hook, project.context, project.process, project.outcome, project.credits].join(" "));

const isPublication = (project) =>
  /publikation|publishing|print|mail|text|literatur/i.test([project.title, project.context, project.process, project.credits].join(" "));

const fieldTag = (project) => {
  if (/algorithm|ki|midjourney/i.test(project.process + project.context)) return "algorithmisch";
  if (/3d|ar\/vr|clo3d/i.test(project.process + project.context)) return "raumfehler";
  if (/publikation|print|publishing/i.test(project.title + project.credits)) return "publikation";
  if (/daten|data/i.test(project.title + project.context)) return "datenkörper";
  return "postdigital";
};

const renderCards = () => {
  if (!worksGrid) {
    return;
  }

  worksGrid.innerHTML = projects
    .map(
      (project, index) => `
      <button class="work-card${isPostdigital(project) ? " is-postdigital" : ""}${isPublication(project) ? " is-publication" : ""}" type="button" data-id="${escapeHtml(project.id)}" data-tone="${escapeHtml(project.tone)}" data-field-tag="${escapeHtml(fieldTag(project))}">
        <span class="work-card__pulse" aria-hidden="true"></span>
        <p class="work-card__index">${String(index + 1).padStart(2, "0")}</p>
        <h3 class="work-card__title">${escapeHtml(project.title)}</h3>
        <p class="work-card__meta">${escapeHtml(project.meta)}</p>
      </button>
    `
    )
    .join("");
};

const openDrawer = (projectId) => {
  const project = projects.find((item) => item.id === projectId);
  if (!project || !drawer || !drawerContent) {
    return;
  }

  const mediaHtml = project.image
    ? `
      <figure class="drawer-media">
        <img src="${escapeHtml(project.image)}" alt="${escapeHtml(project.title)}" loading="lazy" decoding="async" />
      </figure>
    `
    : "";

  drawerContent.innerHTML = `
    <p class="chapter-kicker">AKTE</p>
    <h2 class="drawer-title">${escapeHtml(project.title)}</h2>
    <p class="drawer-sub">${escapeHtml(project.meta)}</p>
    ${mediaHtml}

    <section class="story-block">
      <h3>Frage</h3>
      <p>${escapeHtml(project.hook)}</p>
    </section>
    <section class="story-block">
      <h3>Kontext</h3>
      <p>${escapeHtml(project.context)}</p>
    </section>
    <section class="story-block">
      <h3>Verfahren</h3>
      <p>${escapeHtml(project.process)}</p>
    </section>
    <section class="story-block">
      <h3>Ergebnis</h3>
      <p>${escapeHtml(project.outcome)}</p>
    </section>
    <section class="story-block">
      <h3>Rahmen</h3>
      <p>${escapeHtml(project.credits)}</p>
    </section>
  `;

  drawer.classList.add("is-open");
  drawer.setAttribute("aria-hidden", "false");
};

const closeDrawer = () => {
  if (!drawer) {
    return;
  }
  drawer.classList.remove("is-open");
  drawer.setAttribute("aria-hidden", "true");
};

const setupDrawerEvents = () => {
  if (!worksGrid) {
    return;
  }

  worksGrid.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    const card = target.closest(".work-card");
    if (!card) {
      return;
    }

    const projectId = card.getAttribute("data-id");
    if (projectId) {
      openDrawer(projectId);
    }
  });

  drawerClose?.addEventListener("click", closeDrawer);

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeDrawer();
    }
  });
};

const setupGlitch = () => {
  if (!glitchTitle) {
    return;
  }

  window.setInterval(() => {
    glitchTitle.classList.add("glitching");
    window.setTimeout(() => {
      glitchTitle.classList.remove("glitching");
    }, 140);
  }, 3400);
};

const setupChapterObserver = () => {
  const sections = document.querySelectorAll(".section[data-chapter]");
  if (sections.length === 0 || !siteTag) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const chapter = entry.target.getAttribute("data-chapter") || "CH_00";
          siteTag.textContent = `CLAUDIA MAI / PORTFOLIO V2 / ${chapter}`;
        }
      });
    },
    {
      threshold: 0.45
    }
  );

  sections.forEach((section) => observer.observe(section));
};

window.addEventListener("open-project", (event) => {
  const projectId = event.detail?.id;
  if (projectId) {
    openDrawer(projectId);
  }
});

renderCards();
setupDrawerEvents();
setupGlitch();
setupChapterObserver();
