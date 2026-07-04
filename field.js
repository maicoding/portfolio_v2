import * as THREE from "https://unpkg.com/three@0.185.0/build/three.module.js";
import { projects } from "./projects.js";

const canvas = document.getElementById("portfolio-webgl");
const index = document.getElementById("field-index");
const controls = document.querySelectorAll("[data-field-mode]");

const buckets = {
  all: projects,
  publishing: projects.filter((item) => /publikation|publishing|print|literatur|text/i.test([item.title, item.context, item.process, item.credits].join(" "))),
  image: projects.filter((item) => /bild|fotografie|midjourney|collage|real/i.test([item.title, item.context, item.process, item.outcome].join(" "))),
  data: projects.filter((item) => /daten|data|patient|algorithm/i.test([item.title, item.context, item.process, item.outcome].join(" "))),
  space: projects.filter((item) => /raum|stadt|3d|ar\/vr|clo3d|installation|nairobi/i.test([item.title, item.context, item.process, item.outcome].join(" ")))
};

let active = "all";

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 80);
camera.position.set(0, 0, 16);

const group = new THREE.Group();
scene.add(group);

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2(9, 9);
const clock = new THREE.Clock();
const meshes = [];
let hovered = null;
let targetSpin = 0;

const palette = [0xf73f16, 0x2fd0ff, 0xf0d811, 0xf4f0e8];
const geometry = new THREE.PlaneGeometry(2.8, 3.8, 18, 18);

const makeTexture = (project, i) => {
  const size = { w: 640, h: 880 };
  const c = document.createElement("canvas");
  c.width = size.w;
  c.height = size.h;
  const ctx = c.getContext("2d");
  const accent = `#${palette[i % palette.length].toString(16).padStart(6, "0")}`;
  ctx.fillStyle = i % 2 ? "#f4f0e8" : "#050505";
  ctx.fillRect(0, 0, size.w, size.h);
  ctx.fillStyle = accent;
  ctx.fillRect(0, 0, size.w, 18);
  ctx.fillRect(0, size.h - 92, size.w, 92);
  ctx.strokeStyle = i % 2 ? "#050505" : "#f4f0e8";
  ctx.lineWidth = 3;
  for (let y = 70; y < size.h - 120; y += 54) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(size.w, y + ((i % 3) - 1) * 22);
    ctx.stroke();
  }
  ctx.fillStyle = i % 2 ? "#050505" : "#f4f0e8";
  ctx.font = "700 68px Syne, sans-serif";
  ctx.textBaseline = "top";
  const words = project.title.toUpperCase().split(" ");
  let line = "";
  let y = 112;
  words.forEach((word) => {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width > 520) {
      ctx.fillText(line, 48, y);
      line = word;
      y += 66;
    } else {
      line = next;
    }
  });
  ctx.fillText(line, 48, y);
  ctx.font = "500 30px IBM Plex Mono, monospace";
  ctx.fillText(project.meta.toUpperCase(), 48, size.h - 70);
  ctx.font = "500 24px IBM Plex Mono, monospace";
  ctx.fillText(String(i + 1).padStart(2, "0"), 48, 38);
  const texture = new THREE.CanvasTexture(c);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  return texture;
};

projects.forEach((project, i) => {
  const texture = makeTexture(project, i);
  const material = new THREE.ShaderMaterial({
    uniforms: {
      map: { value: texture },
      time: { value: 0 },
      accent: { value: new THREE.Color(palette[i % palette.length]) },
      active: { value: 1 },
      hover: { value: 0 }
    },
    vertexShader: `
      uniform float time;
      uniform float active;
      uniform float hover;
      varying vec2 vUv;
      void main() {
        vUv = uv;
        vec3 p = position;
        float wave = sin((p.x * 2.4) + time * 1.8) * 0.08;
        p.z += wave * active + hover * 0.35;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D map;
      uniform vec3 accent;
      uniform float active;
      uniform float hover;
      varying vec2 vUv;
      void main() {
        vec4 tex = texture2D(map, vUv);
        float edge = smoothstep(0.0, 0.03, vUv.x) * smoothstep(1.0, 0.97, vUv.x) * smoothstep(0.0, 0.03, vUv.y) * smoothstep(1.0, 0.97, vUv.y);
        vec3 mono = vec3(dot(tex.rgb, vec3(0.299, 0.587, 0.114)));
        vec3 color = mix(mono, tex.rgb, 0.55 + hover * 0.45);
        color = mix(color, accent, (1.0 - active) * 0.45);
        float line = step(0.986, fract(vUv.y * 18.0));
        color += accent * line * 0.18;
        gl_FragColor = vec4(color, edge * (0.42 + active * 0.58));
      }
    `,
    transparent: true,
    side: THREE.DoubleSide
  });

  const mesh = new THREE.Mesh(geometry, material);
  const angle = (i / projects.length) * Math.PI * 2;
  mesh.position.set(Math.cos(angle) * 7.2, Math.sin(angle) * 3.6, Math.sin(angle * 1.7) * 2.2);
  mesh.rotation.set(Math.sin(angle) * 0.35, -angle + Math.PI / 2, Math.cos(angle) * 0.18);
  mesh.userData.project = project;
  group.add(mesh);
  meshes.push(mesh);
});

const particlesGeometry = new THREE.BufferGeometry();
const count = 900;
const positions = new Float32Array(count * 3);
for (let i = 0; i < count; i += 1) {
  positions[i * 3] = (Math.random() - 0.5) * 26;
  positions[i * 3 + 1] = (Math.random() - 0.5) * 14;
  positions[i * 3 + 2] = (Math.random() - 0.5) * 18;
}
particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
const particles = new THREE.Points(
  particlesGeometry,
  new THREE.PointsMaterial({ color: 0xf4f0e8, size: 0.018, transparent: true, opacity: 0.55 })
);
scene.add(particles);

const renderIndex = () => {
  index.innerHTML = buckets[active]
    .map((project, i) => `
      <button type="button" data-project-id="${project.id}">
        <span>${String(i + 1).padStart(2, "0")}</span>
        ${project.title}
      </button>
    `)
    .join("");
};

const openProject = (id) => {
  window.dispatchEvent(new CustomEvent("open-project", { detail: { id } }));
};

index.addEventListener("click", (event) => {
  const button = event.target.closest("[data-project-id]");
  if (button) openProject(button.dataset.projectId);
});

controls.forEach((button) => {
  button.addEventListener("click", () => {
    active = button.dataset.fieldMode;
    controls.forEach((item) => item.classList.toggle("is-active", item === button));
    renderIndex();
    const allowed = new Set(buckets[active].map((item) => item.id));
    meshes.forEach((mesh) => {
      mesh.material.uniforms.active.value = allowed.has(mesh.userData.project.id) ? 1 : 0.14;
    });
  });
});

controls[0]?.classList.add("is-active");
renderIndex();

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
  targetSpin = pointer.x * 0.28;
};

canvas.addEventListener("pointermove", setPointer);
canvas.addEventListener("pointerleave", () => {
  pointer.set(9, 9);
  targetSpin = 0;
});
canvas.addEventListener("click", () => {
  if (hovered) openProject(hovered.userData.project.id);
});

const animate = () => {
  const time = clock.getElapsedTime();
  group.rotation.y += (targetSpin - group.rotation.y) * 0.035;
  group.rotation.z = Math.sin(time * 0.28) * 0.035;
  particles.rotation.y = time * 0.025;

  raycaster.setFromCamera(pointer, camera);
  const hit = raycaster.intersectObjects(meshes, false)[0]?.object || null;
  hovered = hit;

  meshes.forEach((mesh, i) => {
    mesh.material.uniforms.time.value = time + i * 0.2;
    mesh.material.uniforms.hover.value += ((mesh === hovered ? 1 : 0) - mesh.material.uniforms.hover.value) * 0.12;
    mesh.position.y += Math.sin(time * 0.7 + i) * 0.002;
  });

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};

resize();
window.addEventListener("resize", resize);
animate();
