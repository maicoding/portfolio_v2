import { projects } from "./projects.js";

const hero = document.querySelector(".hero-section");
const leftImage = document.querySelector(".hero-pane-left img");
const rightImage = document.querySelector(".hero-pane-right img");
const heroTitle = document.querySelector(".hero-title");
const scrollTop = document.getElementById("scrollTop");
const dotButtons = Array.from(document.querySelectorAll(".pixel-dots button"));
const sections = ["hero", "chat", "desktop"].map((id) => document.getElementById(id));

window.addEventListener("mousemove", (event) => {
  if (!hero || !leftImage || !rightImage) return;
  const rect = hero.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width;
  const y = (event.clientY - rect.top) / rect.height;
  leftImage.style.transform = `translate(${x * -8}px, ${y * -8}px) scale(1.06)`;
  rightImage.style.transform = `translate(${x * 5}px, ${y * 5}px) scale(1.06)`;
});

setInterval(() => {
  heroTitle?.classList.add("is-glitch");
  window.setTimeout(() => heroTitle?.classList.remove("is-glitch"), 180);
}, 4000);

dotButtons.forEach((button) => {
  button.addEventListener("click", () => {
    document.getElementById(button.dataset.jump)?.scrollIntoView({ behavior: "smooth" });
  });
});

function updateNav() {
  const scrollY = window.scrollY;
  scrollTop.classList.toggle("is-visible", scrollY > 600);
  let active = 0;
  sections.forEach((section, index) => {
    if (section && scrollY >= section.offsetTop - window.innerHeight * 0.45) active = index;
  });
  dotButtons.forEach((button, index) => button.classList.toggle("is-active", index === active));
}

window.addEventListener("scroll", updateNav, { passive: true });
scrollTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
updateNav();

const speedlines = document.querySelector(".speedlines");
if (speedlines) {
  for (let i = 0; i < 30; i += 1) {
    const line = document.createElement("span");
    line.style.width = `${80 + (i * 37) % 300}px`;
    line.style.top = `${(i * 37) % 100}%`;
    line.style.left = `${(i * 53) % 100}%`;
    line.style.opacity = String(0.06 + ((i * 3) % 10) * 0.01);
    speedlines.appendChild(line);
  }
}

const chatTexts = [
  "Postdigital Publishing", "Bildsysteme", "Daten werden Material", "Design / Forschung / Lehre",
  "REAL/MIX", "City of Play", "Follow the white rabbit", "Patient 01034063",
  "NICE lab 50/50", "Future x Nature", "1984 to go", "Print bleibt beweglich",
  "Werkzeuge sind Kontexte", "Archive loaded", "Kommunikation", "Systemidentitäten",
  "Co-Creation", "Urteilskraft", "Kontextsteuerung", "Story Memory Action",
  "Publikation", "KI-Literacy", "Werkzeugkritik", "Dynamische Identitäten"
];
const chatTypes = ["dark", "light", "blue", "white"];
const chatBubbles = document.getElementById("chatBubbles");
if (chatBubbles) {
  chatTexts.forEach((text, index) => {
    const bubble = document.createElement("div");
    bubble.className = `chat-bubble chat-${chatTypes[index % chatTypes.length]}`;
    const row = Math.floor(index / 5);
    const col = index % 5;
    bubble.style.top = `${(row / 7) * 82 + ((index * 7) % 5)}%`;
    bubble.style.left = `${(col / 5) * 86 + ((index * 13) % 8) - 5}%`;
    bubble.style.animationDelay = `${(index * 0.7) % 4}s`;
    bubble.style.animationDuration = `${4 + (index % 3)}s`;
    bubble.textContent = text;
    chatBubbles.appendChild(bubble);
  });
}

const matrixRain = document.getElementById("matrixRain");
if (matrixRain) {
  for (let i = 0; i < 24; i += 1) {
    const col = document.createElement("div");
    col.className = "matrix-col";
    col.style.left = `${(i * 37) % 100}%`;
    col.style.animationDuration = `${3 + (i % 7) * 0.7}s`;
    col.style.animationDelay = `${(i % 6) * 0.45}s`;
    col.textContent = Array.from({ length: 44 }, (_, j) => String.fromCharCode(33 + ((i * 17 + j * 11) % 93))).join("\n");
    matrixRain.appendChild(col);
  }
}

const mosaic = document.getElementById("mosaic");
if (mosaic) {
  for (let i = 0; i < 300; i += 1) {
    const cell = document.createElement("i");
    const row = Math.floor(i / 20);
    const col = i % 20;
    const isFace = row >= 3 && row <= 12 && col >= 5 && col <= 15;
    const hue = 20 + (i * 3) % 22;
    const sat = isFace ? 30 + (i * 7) % 28 : 10;
    const light = isFace ? 42 + (i * 5) % 28 : 18 + (i * 2) % 10;
    cell.style.backgroundColor = `hsl(${hue}, ${sat}%, ${light}%)`;
    mosaic.appendChild(cell);
  }
}

const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const projectGrid = document.getElementById("projectGrid");
const projectDialog = document.getElementById("projectDialog");
const dialogContent = document.getElementById("dialogContent");
const dialogClose = document.getElementById("dialogClose");

function openProject(id) {
  const project = projects.find((item) => item.id === id);
  if (!project || !projectDialog || !dialogContent) return;
  dialogContent.innerHTML = `
    <figure class="dialog-media">
      <img src="${escapeHtml(project.image)}" alt="${escapeHtml(project.title)}" />
    </figure>
    <article class="dialog-copy">
      <p class="dialog-index">${escapeHtml(project.meta)}</p>
      <h2>${escapeHtml(project.title)}</h2>
      <p class="dialog-hook">${escapeHtml(project.hook)}</p>
      <dl>
        <div><dt>Kontext</dt><dd>${escapeHtml(project.context)}</dd></div>
        <div><dt>Verfahren</dt><dd>${escapeHtml(project.process)}</dd></div>
        <div><dt>Ergebnis</dt><dd>${escapeHtml(project.outcome)}</dd></div>
        <div><dt>Rahmen</dt><dd>${escapeHtml(project.credits)}</dd></div>
      </dl>
    </article>
  `;
  projectDialog.showModal();
}

if (projectGrid) {
  projectGrid.innerHTML = projects.map((project, index) => `
    <button class="project-card" type="button" data-id="${escapeHtml(project.id)}">
      <img src="${escapeHtml(project.image)}" alt="" loading="lazy" />
      <div>
        <span>${String(index + 1).padStart(2, "0")} / ${escapeHtml(project.meta)}</span>
        <h3>${escapeHtml(project.title)}</h3>
      </div>
    </button>
  `).join("");

  projectGrid.addEventListener("click", (event) => {
    const card = event.target.closest(".project-card");
    const id = card?.getAttribute("data-id");
    if (id) openProject(id);
  });
}

dialogClose?.addEventListener("click", () => projectDialog?.close());
projectDialog?.addEventListener("click", (event) => {
  if (event.target === projectDialog) projectDialog.close();
});
