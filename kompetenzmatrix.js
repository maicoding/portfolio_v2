import * as THREE from "https://unpkg.com/three@0.185.0/build/three.module.js";

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
let liquidText = statements[0].title;

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
      liquidText = statements[index]?.title || liquidText;
      updateLiquidText(liquidText);
    }
  });
});


const liquidCanvas = document.getElementById("matrixLiquidCanvas");
let liquidRenderer = null;
let liquidScene = null;
let liquidCamera = null;
let liquidMesh = null;
let liquidTexture = null;
let liquidStart = performance.now();
const liquidPointer = { x: 0.5, y: 0.5, power: 0 };

function makeTextTexture(text) {
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 768;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#0018ff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#00ff00";
  ctx.lineWidth = 10;
  ctx.strokeRect(18, 18, canvas.width - 36, canvas.height - 36);
  ctx.fillStyle = "#ffff00";
  ctx.font = "900 78px 'Times New Roman', serif";
  ctx.fillText("claudia mai / kompetenzmatrix / text wird flüssig", 70, 100);
  ctx.fillStyle = "#ff00ff";
  ctx.font = "900 112px 'Courier New', monospace";
  ctx.fillText("<<<", 70, 218);
  ctx.fillText(">>>", 1740, 218);
  ctx.fillStyle = "#ffffff";
  ctx.font = "900 210px 'Times New Roman', serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const words = text.toUpperCase().split(" ");
  const lineA = words.slice(0, Math.ceil(words.length / 2)).join(" ");
  const lineB = words.slice(Math.ceil(words.length / 2)).join(" ");
  ctx.fillText(lineA, 1024, 360, 1840);
  ctx.fillText(lineB || " ", 1024, 570, 1840);
  ctx.strokeStyle = "#ff00ff";
  ctx.lineWidth = 5;
  ctx.strokeText(lineA, 1024, 360, 1840);
  ctx.strokeText(lineB || " ", 1024, 570, 1840);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  return texture;
}

function initLiquidText() {
  if (!liquidCanvas) return;
  liquidRenderer = new THREE.WebGLRenderer({ canvas: liquidCanvas, antialias: true, alpha: true, preserveDrawingBuffer: true });
  liquidRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
  liquidRenderer.outputColorSpace = THREE.SRGBColorSpace;
  liquidScene = new THREE.Scene();
  liquidCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  liquidTexture = makeTextTexture(liquidText);
  liquidMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2, 160, 80),
    new THREE.ShaderMaterial({
      uniforms: {
        tex: { value: liquidTexture },
        time: { value: 0 },
        pointer: { value: new THREE.Vector2(0.5, 0.5) },
        power: { value: 0 },
        resolution: { value: new THREE.Vector2(1, 1) }
      },
      vertexShader: `
        varying vec2 vUv;
        uniform float time;
        uniform vec2 pointer;
        uniform float power;
        float wave(vec2 p) {
          return sin(p.x * 18.0 + time * 1.7) * 0.025 + sin((p.x + p.y) * 24.0 - time * 2.1) * 0.018;
        }
        void main() {
          vUv = uv;
          vec3 pos = position;
          float d = distance(uv, pointer);
          float pull = smoothstep(0.45, 0.0, d) * power;
          pos.x += wave(uv) + (uv.x - pointer.x) * pull * 0.18;
          pos.y += wave(uv.yx) - (uv.y - pointer.y) * pull * 0.14;
          pos.z += pull * 0.12;
          gl_Position = vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        precision highp float;
        varying vec2 vUv;
        uniform sampler2D tex;
        uniform float time;
        uniform vec2 pointer;
        uniform float power;
        float hash(vec2 p) { return fract(sin(dot(p, vec2(41.0, 289.0))) * 43758.5453); }
        void main() {
          vec2 uv = vUv;
          float d = distance(uv, pointer);
          float melt = smoothstep(0.55, 0.0, d) * power;
          uv.x += sin(uv.y * 42.0 + time * 2.4) * (0.008 + melt * 0.045);
          uv.y += sin(uv.x * 34.0 - time * 2.0) * (0.006 + melt * 0.034);
          uv.y += melt * sin(time * 1.5 + uv.x * 18.0) * 0.06;
          vec4 col = texture2D(tex, uv);
          vec4 r = texture2D(tex, uv + vec2(0.006 + melt * 0.018, 0.0));
          vec4 b = texture2D(tex, uv - vec2(0.006 + melt * 0.018, 0.0));
          col.r = r.r;
          col.b = b.b;
          col.rgb += hash(gl_FragCoord.xy + time) * 0.045;
          col.rgb *= 0.9 + 0.1 * sin(vUv.y * 900.0);
          gl_FragColor = col;
        }
      `
    })
  );
  liquidScene.add(liquidMesh);
  resizeLiquidText();
  window.addEventListener("pointermove", (event) => {
    const rect = liquidCanvas.getBoundingClientRect();
    liquidPointer.x = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    liquidPointer.y = 1 - Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height));
    liquidPointer.power = event.clientY <= rect.bottom ? 1 : 0.22;
  });
  window.addEventListener("pointerleave", () => {
    liquidPointer.power = 0;
  });
  window.addEventListener("resize", resizeLiquidText);
  animateLiquidText();
}

function updateLiquidText(text) {
  if (!liquidMesh) return;
  const next = makeTextTexture(text);
  liquidTexture?.dispose();
  liquidTexture = next;
  liquidMesh.material.uniforms.tex.value = next;
}

function resizeLiquidText() {
  if (!liquidRenderer || !liquidCanvas) return;
  const width = liquidCanvas.clientWidth || window.innerWidth;
  const height = liquidCanvas.clientHeight || Math.round(window.innerHeight * 0.58);
  liquidRenderer.setSize(width, height, false);
  liquidMesh.material.uniforms.resolution.value.set(width, height);
}

function animateLiquidText() {
  if (!liquidRenderer) return;
  const time = (performance.now() - liquidStart) / 1000;
  liquidPointer.power += ((liquidPointer.power > 0 ? liquidPointer.power : 0) - liquidMesh.material.uniforms.power.value) * 0.08;
  liquidMesh.material.uniforms.time.value = time;
  liquidMesh.material.uniforms.pointer.value.set(liquidPointer.x, liquidPointer.y);
  liquidMesh.material.uniforms.power.value += (liquidPointer.power - liquidMesh.material.uniforms.power.value) * 0.12;
  liquidRenderer.render(liquidScene, liquidCamera);
  requestAnimationFrame(animateLiquidText);
}

initLiquidText();
