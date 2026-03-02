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

const renderCards = () => {
  if (!worksGrid) {
    return;
  }

  worksGrid.innerHTML = projects
    .map(
      (project, index) => `
      <button class="work-card" type="button" data-id="${escapeHtml(project.id)}" data-tone="${escapeHtml(project.tone)}">
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

const setupSignalCanvas = () => {
  const canvas = document.getElementById("signal-canvas");
  if (!(canvas instanceof HTMLCanvasElement)) {
    return;
  }

  const context = canvas.getContext("2d");
  if (!context) {
    return;
  }

  const points = [];
  const pointCount = 32;

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  const seedPoints = () => {
    points.length = 0;
    for (let i = 0; i < pointCount; i += 1) {
      points.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4
      });
    }
  };

  const draw = () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "rgba(6, 6, 6, 0.18)";
    context.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < points.length; i += 1) {
      const a = points[i];
      a.x += a.vx;
      a.y += a.vy;

      if (a.x <= 0 || a.x >= canvas.width) {
        a.vx *= -1;
      }
      if (a.y <= 0 || a.y >= canvas.height) {
        a.vy *= -1;
      }

      context.fillStyle = "rgba(47, 208, 255, 0.55)";
      context.fillRect(a.x, a.y, 1.8, 1.8);

      for (let j = i + 1; j < points.length; j += 1) {
        const b = points[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const distance = Math.hypot(dx, dy);

        if (distance < 170) {
          context.strokeStyle = `rgba(247, 63, 22, ${0.14 - distance / 1500})`;
          context.lineWidth = 1;
          context.beginPath();
          context.moveTo(a.x, a.y);
          context.lineTo(b.x, b.y);
          context.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  };

  resize();
  seedPoints();
  draw();

  window.addEventListener("resize", () => {
    resize();
    seedPoints();
  });
};

renderCards();
setupDrawerEvents();
setupGlitch();
setupChapterObserver();
setupSignalCanvas();
