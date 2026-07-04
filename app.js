import { projects } from "./projects.js";

const worksGrid = document.getElementById("works-grid");
const drawer = document.getElementById("story-drawer");
const drawerContent = document.getElementById("drawer-content");
const drawerClose = document.getElementById("drawer-close");
const glitchTitle = document.getElementById("glitch-title");
const siteTag = document.querySelector(".site-tag");
const agentInput = document.getElementById("agent-input");
const agentFeed = document.getElementById("agent-feed");
const agentState = document.querySelector("[data-agent-state]");
const agentClock = document.querySelector("[data-agent-clock]");
const worksHint = document.getElementById("works-hint");

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

const agentTag = (project) => {
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
      <button class="work-card${isPostdigital(project) ? " is-postdigital" : ""}${isPublication(project) ? " is-publication" : ""}" type="button" data-id="${escapeHtml(project.id)}" data-tone="${escapeHtml(project.tone)}" data-agent-tag="${escapeHtml(agentTag(project))}">
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
    <p class="chapter-kicker">STORY LAYER</p>
    <h2 class="drawer-title">${escapeHtml(project.title)}</h2>
    <p class="drawer-sub">${escapeHtml(project.meta)}</p>
    ${mediaHtml}

    <section class="story-block">
      <h3>Hook</h3>
      <p>${escapeHtml(project.hook)}</p>
    </section>
    <section class="story-block">
      <h3>Context</h3>
      <p>${escapeHtml(project.context)}</p>
    </section>
    <section class="story-block">
      <h3>Process</h3>
      <p>${escapeHtml(project.process)}</p>
    </section>
    <section class="story-block">
      <h3>Outcome</h3>
      <p>${escapeHtml(project.outcome)}</p>
    </section>
    <section class="story-block">
      <h3>Credits</h3>
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

const feed = (label, text) => {
  if (!agentFeed) return;
  const item = document.createElement("p");
  item.innerHTML = `<strong>${escapeHtml(label)}</strong> ${escapeHtml(text)}`;
  agentFeed.prepend(item);
  while (agentFeed.children.length > 7) {
    agentFeed.lastElementChild?.remove();
  }
};

const setMode = (mode, label, hint) => {
  document.body.dataset.mode = mode;
  if (agentState) agentState.textContent = label;
  if (worksHint) worksHint.textContent = hint;
};

const executeAgentCommand = (command) => {
  const normalized = command.toLowerCase();
  const postdigitalCards = [...document.querySelectorAll(".work-card.is-postdigital")];
  document.querySelectorAll(".work-card").forEach((card) => card.classList.remove("is-current"));

  if (/rundgang|autonom/.test(normalized)) {
    setMode("tour", "rundgang", "Autonomer Rundgang aktiv");
    let index = 0;
    const step = () => {
      postdigitalCards.forEach((card) => card.classList.remove("is-current"));
      const card = postdigitalCards[index % postdigitalCards.length];
      card?.classList.add("is-current");
      card?.scrollIntoView({ behavior: "smooth", block: "center" });
      feed("Rundgang", card?.querySelector(".work-card__title")?.textContent || "postdigital");
      index += 1;
      if (index < Math.min(postdigitalCards.length, 5)) window.setTimeout(step, 1300);
    };
    step();
    return;
  }

  if (/publikation|publishing|print/.test(normalized)) {
    setMode("publication", "publikation", "Nur Publikationsbezüge sichtbar");
    feed("Filter", "Publikationen und Textsysteme freigelegt");
    return;
  }

  if (/forensisch|marker|markiere|tool/.test(normalized)) {
    setMode("forensic", "forensisch", "Postdigitale Spuren markiert");
    feed("Analyse", "Tool Ästhetik, Datenkörper und Publikationslogik markiert");
    return;
  }

  if (/anti|navigation|öffne|oeffne/.test(normalized)) {
    setMode("anti", "anti navigation", "Postdigitaler Teil priorisiert");
    feed("Anti Nav", "Nebenspuren gedimmt, postdigitale Pfade bleiben offen");
    return;
  }

  if (/spiel|game/.test(normalized)) {
    setMode("game", "spielzustand", "Postdigitale Karten sind aktive Felder");
    feed("Spiel", "Klicks öffnen Story Layer, markierte Karten zählen als Felder");
    return;
  }

  if (/störung|stoerung|sortiere/.test(normalized)) {
    setMode("nervous", "störung", "Archiv nach Störpotenzial aktiviert");
    const cards = [...document.querySelectorAll(".work-card")];
    cards
      .sort((a, b) => Number(b.classList.contains("is-postdigital")) - Number(a.classList.contains("is-postdigital")))
      .forEach((card) => worksGrid?.append(card));
    feed("Sortierung", "Digitale Fremdkörper nach vorn gezogen");
    return;
  }

  if (/ausstellung|fremdkörper|fremdkoerper/.test(normalized)) {
    setMode("forensic", "ausstellungsebene", "Ausstellungsebene aktiv");
    postdigitalCards.slice(0, 4).forEach((card) => card.classList.add("is-current"));
    feed("Ebene", "Vier Arbeiten als temporäre Ausstellung markiert");
    return;
  }

  setMode("nervous", "nervös", "Postdigitaler Modus aktiv");
  feed("Befehl", command);
};

const setupPostdigitalAgent = () => {
  if (agentFeed?.children.length === 0) {
    feed("System", "Lokaler Agent steuert nur den postdigitalen Teil und die Startseite");
    feed("Bereich", `${projects.filter(isPostdigital).length} Projekte erkannt`);
  }

  agentInput?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      executeAgentCommand(agentInput.value);
    }
  });

  document.querySelectorAll("[data-agent-command]").forEach((button) => {
    button.addEventListener("click", () => {
      const command = button.getAttribute("data-agent-command") || "";
      if (agentInput) agentInput.value = command;
      executeAgentCommand(command);
    });
  });

  window.setInterval(() => {
    if (!agentClock) return;
    agentClock.textContent = new Date().toLocaleTimeString("de-DE", { hour12: false });
  }, 1000);
};

renderCards();
setupDrawerEvents();
setupGlitch();
setupChapterObserver();
setupPostdigitalAgent();
