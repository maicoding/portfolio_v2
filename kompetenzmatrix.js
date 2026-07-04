const statements = [
  {
    title: "Daten werden Material",
    text: "Gestaltung arbeitet mit Datensätzen, Kontexten und Verhaltensspuren. Form entsteht aus Auswahl, Gewichtung und Übersetzung."
  },
  {
    title: "Regeln werden Form",
    text: "Generative Systeme verschieben Gestaltung in Richtung Regelwerk, Parameter, Inputs und Outputkritik."
  },
  {
    title: "Bedeutung wird knapp",
    text: "Wenn Bilder schnell entstehen, entscheidet die Fähigkeit, Relevanz, Kontext und Haltung sichtbar zu machen."
  },
  {
    title: "Varianten brauchen Urteil",
    text: "Mehr Output erhöht den Bedarf an Auswahlkriterien, Kuratierung, Vergleich und Verwerfung."
  },
  {
    title: "Systeme erzählen",
    text: "Ein gutes generatives System trägt Daten, Herkunft und Absicht in sich und kann dadurch eine eigene Stimme ausbilden."
  },
  {
    title: "Zusammenarbeit wird Infrastruktur",
    text: "Mensch, KI, Daten und Teams bilden Arbeitsgefüge. Gestaltung liegt in der Orchestrierung dieser Beziehungen."
  }
];

const rows = [
  { id: "daten-material", x: 49, y: 8, before: "Inhalte als Text, Bild oder Briefing", term: "Daten als Material", shift: "Daten werden zu formgebenden Eingaben, Quellen und strukturierendem Material.", source: "Design Unlimited: Where there is Data, there’s Design" },
  { id: "uebersetzung", x: 55, y: 13, before: "Komplexität reduzieren", term: "Bedeutung übersetzen", shift: "Designer:innen übersetzen Daten in lesbare Formen, Beziehungen und Entscheidungen.", source: "Buchauszug: Designers translate data into form and create meaning." },
  { id: "regelwerk", x: 47, y: 18, before: "Einzelne Artefakte gestalten", term: "Regelwerke entwerfen", shift: "Gestaltung wird als System aus Regeln, Parametern und Eingaben gedacht.", source: "Generative Systems Redefine the Role of Designers" },
  { id: "kuratierung", x: 57, y: 23, before: "Handwerkliche Ausführung", term: "Kuratierung und Urteilskraft", shift: "Variantenproduktion verlangt präzise Kriterien, Auswahl und Begründung.", source: "Abgeleitet aus Wiederholung, Variation und Outputkritik" },
  { id: "kontext", x: 48, y: 28, before: "Oberfläche optimieren", term: "Kontext gestalten", shift: "Relevanz entsteht aus der Verbindung von Marke, Umgebung, Publikum und Daten.", source: "Distinctiveness in Form and Content" },
  { id: "systemidentitaet", x: 56, y: 33, before: "Logo, Farbe, Typografie", term: "Systemidentität", shift: "Wiedererkennbarkeit entsteht durch Regeln, Quellen, Presets und autonome Variation.", source: "Branding Systems und Dynamic Identities" },
  { id: "orchestrierung", x: 46, y: 38, before: "Produktion ausführen", term: "Orchestrierung", shift: "Designer:innen steuern Workflows aus Mensch, Maschine, Daten und Medien.", source: "Team Up, Co-Creation, Artificial Intelligence" },
  { id: "prompt-kontext", x: 57, y: 43, before: "Software bedienen", term: "Prompt- und Kontextsteuerung", shift: "Die Qualität der Eingabe bestimmt Richtung, Ton, Material und Grenzen des Systems.", source: "Abgeleitet aus generativen Arbeitsweisen" },
  { id: "kritik", x: 47, y: 48, before: "Toolbeherrschung", term: "Kritisches Denken", shift: "KI erzeugt plausible Ergebnisse. Bewertung, Bias-Erkennung und Quellenkritik werden zentral.", source: "Artificial Intelligence und Usage" },
  { id: "story", x: 56, y: 53, before: "Botschaften platzieren", term: "Story, Memory, Action", shift: "Gestaltung muss Erinnerung, Handlung und Anschlussfähigkeit erzeugen.", source: "Kapitelstruktur: Story, Memory, Action" },
  { id: "haltung", x: 48, y: 58, before: "Visuelle Perfektion", term: "Haltung und Originalität", shift: "Template-Logik und AI Slop erhöhen den Wert eigenständiger Entscheidungen.", source: "Standing out in a World of Templates" },
  { id: "interaktion", x: 56, y: 63, before: "Statisches Ergebnis", term: "Dynamische Interaktion", shift: "Form kann in Echtzeit auf Menschen, Räume und digitale Umgebungen reagieren.", source: "Form Follows Vision" },
  { id: "literacy", x: 47, y: 68, before: "Softwarekompetenz", term: "KI-Literacy", shift: "Kompetenz umfasst Grenzen, Risiken, Rechte, Manipulation und technische Bedingungen.", source: "Artificial Intelligence und Usage" },
  { id: "strategie", x: 56, y: 73, before: "Kreative Idee", term: "Strategische Kreativität", shift: "Ideen müssen Systeme tragen, Daten aufnehmen und langfristig unterscheidbar bleiben.", source: "Distinctiveness in Form and Content" },
  { id: "verantwortung", x: 48, y: 78, before: "Formgebung", term: "Verantwortung", shift: "Wer Systeme baut, prägt Verhalten, Wahrnehmung und mögliche Zukünfte.", source: "Quo Vadis Design? und Goals" },
  { id: "zoom-out", x: 56, y: 83, before: "Einzelproblem lösen", term: "Systemisch denken", shift: "Der Blick auf Zusammenhänge macht Muster, Regeln und neue Handlungsspielräume sichtbar.", source: "New Ideas" },
  { id: "co-creation", x: 47, y: 88, before: "Einzelautorenschaft", term: "Co-Creation", shift: "Autorschaft verteilt sich auf Personen, Modelle, Datenquellen und Prozesse.", source: "Team Up und Co-Creation" },
  { id: "agentisch", x: 56, y: 93, before: "Designer:in als Ausführende:r", term: "Designer:in als Systemregie", shift: "Die Rolle verschiebt sich zur Entscheidung über Regeln, Eingaben, Grenzen und Qualität.", source: "Generative Systems Redefine the Role of Designers" }
];

let activeId = rows[0].id;
let swipe = null;

const lanes = document.getElementById("matrixLanes");
const links = document.getElementById("matrixLinks");
const nodes = document.getElementById("matrixNodes");
const detail = document.getElementById("matrixDetail");
const slides = document.getElementById("statementSlides");
const dots = document.getElementById("matrixDots");

function renderStatements() {
  slides.innerHTML = statements.map((statement, index) => `
    <article class="matrix-slide">
      <span>${String(index + 1).padStart(2, "0")}</span>
      <h2>${statement.title}</h2>
      <p>${statement.text}</p>
    </article>
  `).join("");
  dots.innerHTML = statements.map((_, index) => `<span class="${index === 0 ? "is-active" : ""}"></span>`).join("");
}

function renderLanes() {
  lanes.innerHTML = rows.map((row) => `
    <div class="matrix-lane">
      <div>${row.before}</div>
      <div></div>
      <div>${row.shift}</div>
    </div>
  `).join("");
}

function renderLinks() {
  links.innerHTML = rows.map((row) => `
    <path d="M 28 ${row.y} C 36 ${row.y}, 39 ${row.y}, ${row.x} ${row.y}"></path>
    <path d="M ${row.x} ${row.y} C 64 ${row.y}, 67 ${row.y}, 100 ${row.y}"></path>
  `).join("");
}

function renderNodes() {
  nodes.innerHTML = rows.map((row) => `
    <button class="matrix-node ${row.id === activeId ? "is-active" : ""}" type="button" data-id="${row.id}" style="--x:${row.x};--y:${row.y}">
      <span>${row.term}</span>
    </button>
  `).join("");
}

function renderDetail() {
  const row = rows.find((item) => item.id === activeId) || rows[0];
  detail.innerHTML = `
    <span class="matrix-source">${row.source}</span>
    <h2>${row.term}</h2>
    <dl>
      <div><dt>Früher</dt><dd>${row.before}</dd></div>
      <div><dt>Verschiebung</dt><dd>${row.shift}</dd></div>
    </dl>
  `;
}

function render() {
  renderLanes();
  renderLinks();
  renderNodes();
  renderDetail();
}

function activate(id) {
  activeId = id;
  renderNodes();
  renderDetail();
}

renderStatements();
render();

nodes.addEventListener("click", (event) => {
  const node = event.target.closest(".matrix-node");
  if (!node) return;
  activate(node.dataset.id);
});

document.getElementById("matrixPrev").addEventListener("click", () => swipe?.prev());
document.getElementById("matrixNext").addEventListener("click", () => swipe?.next());

window.addEventListener("load", () => {
  swipe = new Swipe(document.getElementById("statementSwipe"), {
    auto: 5000,
    continuous: true,
    callback(index) {
      dots.querySelectorAll("span").forEach((dot, i) => dot.classList.toggle("is-active", i === index));
    }
  });
});
