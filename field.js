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

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 80);
camera.position.set(0, 0, 15);

const group = new THREE.Group();
scene.add(group);

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2(9, 9);
const clock = new THREE.Clock();
const objects = [];
const links = [];
let hovered = null;
let targetSpin = 0;

const palette = [0xf73f16, 0x2fd0ff, 0xf0d811, 0xf4f0e8];

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
  const time = clock.getElapsedTime();
  if (autoFocus && time > nextFocusAt) {
    focusNext();
    nextFocusAt = time + 4.2;
  }

  group.rotation.y += (targetSpin - group.rotation.y) * 0.035;
  group.rotation.z = Math.sin(time * 0.2) * 0.04;
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
