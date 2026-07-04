import * as THREE from "https://unpkg.com/three@0.185.0/build/three.module.js";
import { projects } from "./projects.js";

const canvas = document.getElementById("portfolio-webgl");
const index = document.getElementById("field-index");
const controls = document.querySelectorAll("[data-field-mode]");

const collect = (project) => [project.title, project.meta, project.hook, project.context, project.process, project.outcome, project.credits].join(" ");
const buckets = {
  all: projects,
  publishing: projects.filter((item) => /publikation|publishing|print|literatur|text/i.test(collect(item))),
  image: projects.filter((item) => /bild|fotografie|midjourney|collage|real/i.test(collect(item))),
  data: projects.filter((item) => /daten|data|patient|algorithm/i.test(collect(item))),
  space: projects.filter((item) => /raum|stadt|3d|ar\/vr|clo3d|installation|nairobi/i.test(collect(item)))
};

let active = "all";
let focusIndex = 0;
let autoFocus = true;
let nextFocusAt = 0;

const variants = ["terminal", "scan", "splat", "repair"];
const variant = variants[Math.floor(Math.random() * variants.length)];
document.body.dataset.fieldEffect = variant;

const variantIndex = variants.indexOf(variant);
const paletteSets = [
  [0xa0beff, 0x0fffd7, 0xf4f0e8, 0x5a78ff],
  [0x7df9ff, 0xd8ff5c, 0xf4f0e8, 0x5a78ff],
  [0xf4f0e8, 0xa0beff, 0xd8ff5c, 0x8c7cff],
  [0xd8ff5c, 0xa0beff, 0xf4f0e8, 0x0fffd7]
];
const palette = paletteSets[variantIndex];

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 80);
camera.position.set(0, 0, 15);

const group = new THREE.Group();
scene.add(group);

const background = new THREE.Mesh(
  new THREE.PlaneGeometry(42, 24, 1, 1),
  new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      mode: { value: variantIndex },
      resolution: { value: new THREE.Vector2(1, 1) }
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      precision highp float;
      uniform float time;
      uniform int mode;
      uniform vec2 resolution;
      varying vec2 vUv;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
      }

      float lineField(vec2 uv, float angle, float density) {
        float v = uv.x * cos(angle) + uv.y * sin(angle);
        return smoothstep(0.965, 1.0, fract(v * density));
      }

      void main() {
        vec2 uv = vUv;
        vec2 p = uv - 0.5;
        float grain = hash(gl_FragCoord.xy + time);
        float n = noise(uv * 8.0 + time * 0.08);
        float scan = smoothstep(0.55, 0.58, sin((uv.y * resolution.y) * 1.75));
        float vignette = smoothstep(0.82, 0.12, length(p));
        vec3 ink = vec3(0.015, 0.018, 0.05);
        vec3 blue = vec3(0.08, 0.06, 0.78);
        vec3 pale = vec3(0.62, 0.75, 1.0);
        vec3 green = vec3(0.78, 1.0, 0.36);
        vec3 cyan = vec3(0.05, 1.0, 0.84);
        vec3 col = ink;

        if (mode == 0) {
          float grid = lineField(uv + vec2(time * 0.01, 0.0), 0.0, 18.0) + lineField(uv, 1.5708, 13.0);
          float blocks = step(0.78, noise(floor(uv * vec2(18.0, 10.0)) + time * 0.25));
          col = mix(ink, blue, 0.55 + n * 0.18);
          col += pale * grid * 0.22 + cyan * blocks * 0.12;
        } else if (mode == 1) {
          float bands = lineField(uv + vec2(0.0, time * 0.025), 1.5708, 44.0);
          float tear = smoothstep(0.44, 0.48, noise(vec2(uv.y * 2.0, time * 0.35)));
          col = mix(ink, vec3(0.025, 0.03, 0.08), 0.7);
          col += pale * bands * 0.26 + green * tear * 0.08;
        } else if (mode == 2) {
          float splat = 0.0;
          for (int i = 0; i < 9; i++) {
            float fi = float(i);
            vec2 c = vec2(hash(vec2(fi, 2.0)), hash(vec2(fi, 7.0)));
            c += vec2(sin(time * 0.12 + fi), cos(time * 0.1 + fi * 2.0)) * 0.035;
            float d = length((uv - c) * vec2(1.4, 1.0));
            splat += exp(-d * d * (10.0 + fi));
          }
          col = mix(ink, blue, 0.34);
          col += mix(cyan, pale, n) * splat * 0.2;
        } else {
          float net = lineField(uv + n * 0.025, 0.76, 22.0) + lineField(uv - n * 0.02, -0.82, 19.0);
          float pulse = smoothstep(0.35, 0.0, abs(length(p) - (0.18 + sin(time * 0.4) * 0.05)));
          col = mix(ink, vec3(0.02, 0.03, 0.12), 0.8);
          col += green * net * 0.18 + pale * pulse * 0.16;
        }

        col += grain * 0.045;
        col *= vignette;
        col -= scan * 0.025;
        gl_FragColor = vec4(col, 1.0);
      }
    `,
    depthWrite: false,
    depthTest: false
  })
);
background.position.z = -12;
scene.add(background);

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2(9, 9);
const startTime = performance.now();
const objects = [];
const links = [];
let hovered = null;
let targetSpin = 0;

const makeLabel = (project, i) => {
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 256;
  const ctx = c.getContext("2d");
  const accent = `#${palette[i % palette.length].toString(16).padStart(6, "0")}`;
  ctx.clearRect(0, 0, c.width, c.height);
  ctx.fillStyle = accent;
  ctx.fillRect(0, 0, 14, 256);
  ctx.fillStyle = "#f4f0e8";
  ctx.font = "700 70px Syne, sans-serif";
  ctx.textBaseline = "top";
  ctx.fillText(project.title.toUpperCase(), 44, 26, 900);
  ctx.font = "500 32px IBM Plex Mono, monospace";
  ctx.fillText(project.meta.toUpperCase(), 48, 126, 870);
  ctx.fillStyle = accent;
  ctx.font = "700 26px IBM Plex Mono, monospace";
  ctx.fillText(String(i + 1).padStart(2, "0"), 48, 184);
  const texture = new THREE.CanvasTexture(c);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  return texture;
};

const makeNode = (project, i) => {
  const label = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: makeLabel(project, i),
      transparent: true,
      opacity: 0.62,
      depthWrite: false
    })
  );
  label.scale.set(4.7, 1.18, 1);
  label.userData.project = project;
  label.userData.kind = "label";

  const angle = (i / projects.length) * Math.PI * 2;
  const radius = 5.4 + (i % 3) * 0.8;
  label.position.set(Math.cos(angle) * radius, Math.sin(angle * 1.4) * 2.6, Math.sin(angle) * 3.7);
  group.add(label);

  const dot = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.18 + (i % 3) * 0.04, 1),
    new THREE.MeshBasicMaterial({ color: palette[i % palette.length], transparent: true, opacity: 0.9 })
  );
  dot.position.copy(label.position);
  dot.userData.project = project;
  dot.userData.kind = "dot";
  group.add(dot);

  objects.push({ project, label, dot, base: label.position.clone(), active: 1, focus: 0 });
};

projects.forEach(makeNode);

for (let i = 0; i < objects.length; i += 1) {
  const a = objects[i];
  const b = objects[(i + 2) % objects.length];
  const geometry = new THREE.BufferGeometry().setFromPoints([a.base, b.base]);
  const line = new THREE.Line(
    geometry,
    new THREE.LineBasicMaterial({ color: palette[i % palette.length], transparent: true, opacity: 0.18 })
  );
  group.add(line);
  links.push({ line, a, b });
}

const particleGeometry = new THREE.BufferGeometry();
const particleCount = 1400;
const positions = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount; i += 1) {
  positions[i * 3] = (Math.random() - 0.5) * 28;
  positions[i * 3 + 1] = (Math.random() - 0.5) * 15;
  positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
}
particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
const particles = new THREE.Points(
  particleGeometry,
  new THREE.PointsMaterial({ color: 0xf4f0e8, size: 0.014, transparent: true, opacity: 0.42 })
);
scene.add(particles);

const currentProjects = () => buckets[active] || projects;

const renderIndex = () => {
  const current = currentProjects();
  index.innerHTML = current
    .map((project, i) => `
      <button type="button" data-project-id="${project.id}" class="${project.id === current[focusIndex % current.length]?.id ? "is-focus" : ""}">
        <span>${String(i + 1).padStart(2, "0")}</span>
        ${project.title}
      </button>
    `)
    .join("");
};

const openProject = (id) => {
  window.dispatchEvent(new CustomEvent("open-project", { detail: { id } }));
};

const setFocus = (projectId, shouldRender = true) => {
  const current = currentProjects();
  const indexInBucket = current.findIndex((project) => project.id === projectId);
  focusIndex = Math.max(indexInBucket, 0);
  objects.forEach((object) => {
    object.focus = object.project.id === projectId ? 1 : 0;
  });
  if (shouldRender) renderIndex();
};

const focusNext = () => {
  const current = currentProjects();
  if (current.length === 0) return;
  focusIndex = (focusIndex + 1) % current.length;
  setFocus(current[focusIndex].id);
};

index.addEventListener("click", (event) => {
  const button = event.target.closest("[data-project-id]");
  if (!button) return;
  autoFocus = false;
  setFocus(button.dataset.projectId);
  openProject(button.dataset.projectId);
});

index.addEventListener("pointerover", (event) => {
  const button = event.target.closest("[data-project-id]");
  if (button) setFocus(button.dataset.projectId, false);
});

controls.forEach((button) => {
  button.addEventListener("click", () => {
    const mode = button.dataset.fieldMode;
    if (mode === "next") {
      autoFocus = true;
      focusNext();
      return;
    }
    active = mode;
    focusIndex = 0;
    autoFocus = true;
    controls.forEach((item) => item.classList.toggle("is-active", item === button));
    const allowed = new Set(currentProjects().map((item) => item.id));
    objects.forEach((object) => {
      object.active = allowed.has(object.project.id) ? 1 : 0.12;
    });
    setFocus(currentProjects()[0]?.id);
  });
});

controls[0]?.classList.add("is-active");
setFocus(projects[0].id);

const resize = () => {
  const { clientWidth, clientHeight } = canvas.parentElement;
  renderer.setSize(clientWidth, clientHeight, false);
  background.material.uniforms.resolution.value.set(clientWidth, clientHeight);
  camera.aspect = clientWidth / clientHeight;
  camera.updateProjectionMatrix();
};

const setPointer = (event) => {
  const rect = canvas.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
  targetSpin = pointer.x * 0.32;
  autoFocus = false;
};

canvas.addEventListener("pointermove", setPointer);
canvas.addEventListener("pointerleave", () => {
  pointer.set(9, 9);
  targetSpin = 0;
  autoFocus = true;
});
canvas.addEventListener("click", () => {
  if (hovered) openProject(hovered.userData.project.id);
});

const animate = () => {
  const time = (performance.now() - startTime) / 1000;
  if (autoFocus && time > nextFocusAt) {
    focusNext();
    nextFocusAt = time + 4.2;
  }

  group.rotation.y += (targetSpin - group.rotation.y) * 0.035;
  group.rotation.z = Math.sin(time * 0.2) * 0.04;
  background.material.uniforms.time.value = time;
  particles.rotation.y = time * 0.025;

  raycaster.setFromCamera(pointer, camera);
  const hit = raycaster.intersectObjects(objects.map((object) => object.label), false)[0]?.object || null;
  hovered = hit;
  if (hovered) setFocus(hovered.userData.project.id);

  objects.forEach((object, i) => {
    const isHover = hovered?.userData.project.id === object.project.id ? 1 : 0;
    const energy = object.active * (0.62 + object.focus * 0.72 + isHover * 0.42);
    const drift = Math.sin(time * 0.72 + i * 1.9);
    const target = object.base.clone();
    target.x += drift * 0.28;
    target.y += Math.cos(time * 0.48 + i) * 0.18;
    target.z += object.focus * 1.6 + isHover * 0.9;
    object.label.position.lerp(target, 0.06);
    object.dot.position.copy(object.label.position);
    object.label.material.opacity += (Math.min(1, energy) - object.label.material.opacity) * 0.08;
    object.label.scale.x += ((4.7 + object.focus * 1.2 + isHover * 0.8) - object.label.scale.x) * 0.08;
    object.dot.scale.setScalar(1 + object.focus * 2 + isHover);
    object.dot.material.opacity = Math.min(1, object.active + object.focus * 0.4);
  });

  links.forEach(({ line, a, b }) => {
    line.geometry.setFromPoints([a.label.position, b.label.position]);
    line.material.opacity = 0.08 + (a.focus || b.focus ? 0.32 : 0) + Math.min(a.active, b.active) * 0.12;
  });

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};

resize();
window.addEventListener("resize", resize);
animate();
