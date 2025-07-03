const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("canvas-container").appendChild(renderer.domElement);

// Add stars background
function createStars(count) {
  for (let i = 0; i < count; i++) {
    const geometry = new THREE.SphereGeometry(0.1, 24, 24);
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const star = new THREE.Mesh(geometry, material);
    star.position.set(
      (Math.random() - 0.5) * 200,
      (Math.random() - 0.5) * 200,
      (Math.random() - 0.5) * 200
    );
    scene.add(star);
  }
}
createStars(500);

// Light
const pointLight = new THREE.PointLight(0xffffff, 2, 200);
scene.add(pointLight);

// Sun
const sunGeometry = new THREE.SphereGeometry(2, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xfdb813 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Camera position
camera.position.set(0, 20, 35);
camera.lookAt(0, 0, 0);

// Planet data
const planetData = [
  { name: 'Mercury', color: 0xaaaaaa, distance: 4, size: 0.3, speed: 0.03 },
  { name: 'Venus', color: 0xffddaa, distance: 6, size: 0.5, speed: 0.02 },
  { name: 'Earth', color: 0x2233ff, distance: 8, size: 0.5, speed: 0.01 },
  { name: 'Mars', color: 0xff3300, distance: 10, size: 0.4, speed: 0.008 },
  { name: 'Jupiter', color: 0xffcc88, distance: 13, size: 1.1, speed: 0.006 },
  { name: 'Saturn', color: 0xffdd77, distance: 16, size: 1, speed: 0.004 },
  { name: 'Uranus', color: 0x66ccff, distance: 19, size: 0.8, speed: 0.003 },
  { name: 'Neptune', color: 0x3366ff, distance: 22, size: 0.7, speed: 0.002 }
];

const planets = {};
const orbits = {};
planetData.forEach(planet => {
  const orbit = new THREE.Object3D();
  const geometry = new THREE.SphereGeometry(planet.size, 32, 32);
  const material = new THREE.MeshStandardMaterial({ color: planet.color });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.x = planet.distance;
  orbit.add(mesh);
  scene.add(orbit);
  planets[planet.name] = mesh;
  orbits[planet.name] = orbit;

  // Orbit ring
  const ringGeometry = new THREE.RingGeometry(planet.distance - 0.02, planet.distance + 0.02, 64);
  const ringMaterial = new THREE.MeshBasicMaterial({ color: 0x444444, side: THREE.DoubleSide });
  const ring = new THREE.Mesh(ringGeometry, ringMaterial);
  ring.rotation.x = Math.PI / 2;
  scene.add(ring);
});

const speeds = {};
planetData.forEach(p => speeds[p.name] = p.speed);

// Handle slider input
Object.keys(speeds).forEach(name => {
  const slider = document.getElementById(name);
  if (slider) {
    slider.addEventListener('input', (e) => {
      speeds[name] = parseFloat(e.target.value);
    });
  }
});

// Pause/Resume functionality
let paused = false;
const pauseBtn = document.getElementById("toggleAnimation");
pauseBtn.addEventListener("click", () => {
  paused = !paused;
  pauseBtn.textContent = paused ? " Resume" : " Pause";
});

// Animate with camera rotation
let angle = 0;
function animate() {
  requestAnimationFrame(animate);

  if (!paused) {
    Object.keys(orbits).forEach(name => {
      orbits[name].rotation.y += speeds[name];
    });
  }

  // Camera auto orbit
  angle += 0.0005;
  camera.position.x = Math.sin(angle) * 35;
  camera.position.z = Math.cos(angle) * 35;
  camera.lookAt(0, 0, 0);

  renderer.render(scene, camera);
}
animate();

// Responsive
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
