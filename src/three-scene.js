import * as THREE from 'three';

export function initThreeScene() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  // --- Particle Sphere ---
  const sphereGeometry = new THREE.SphereGeometry(2.2, 64, 64);
  const particleCount = sphereGeometry.attributes.position.count;

  const positions = new Float32Array(particleCount * 3);
  const originalPositions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);

  const cyan = new THREE.Color(0x06b6d4);
  const violet = new THREE.Color(0x8b5cf6);

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    positions[i3] = sphereGeometry.attributes.position.array[i3];
    positions[i3 + 1] = sphereGeometry.attributes.position.array[i3 + 1];
    positions[i3 + 2] = sphereGeometry.attributes.position.array[i3 + 2];

    originalPositions[i3] = positions[i3];
    originalPositions[i3 + 1] = positions[i3 + 1];
    originalPositions[i3 + 2] = positions[i3 + 2];

    const mixFactor = Math.random();
    const color = cyan.clone().lerp(violet, mixFactor);
    colors[i3] = color.r;
    colors[i3 + 1] = color.g;
    colors[i3 + 2] = color.b;

    sizes[i] = Math.random() * 3 + 1;
  }

  const particlesGeometry = new THREE.BufferGeometry();
  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  particlesGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.02,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  });

  const particleSphere = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particleSphere);

  // --- Wireframe Sphere ---
  const wireframeMaterial = new THREE.MeshBasicMaterial({
    color: 0x06b6d4,
    wireframe: true,
    transparent: true,
    opacity: 0.04,
  });

  const wireframeSphere = new THREE.Mesh(
    new THREE.SphereGeometry(2.2, 24, 24),
    wireframeMaterial
  );
  scene.add(wireframeSphere);

  // --- Ambient Floating Particles ---
  const ambientCount = 500;
  const ambientPositions = new Float32Array(ambientCount * 3);
  const ambientColors = new Float32Array(ambientCount * 3);

  for (let i = 0; i < ambientCount; i++) {
    const i3 = i * 3;
    ambientPositions[i3] = (Math.random() - 0.5) * 16;
    ambientPositions[i3 + 1] = (Math.random() - 0.5) * 16;
    ambientPositions[i3 + 2] = (Math.random() - 0.5) * 10;

    const mixFactor = Math.random();
    const color = cyan.clone().lerp(violet, mixFactor);
    ambientColors[i3] = color.r;
    ambientColors[i3 + 1] = color.g;
    ambientColors[i3 + 2] = color.b;
  }

  const ambientGeometry = new THREE.BufferGeometry();
  ambientGeometry.setAttribute('position', new THREE.BufferAttribute(ambientPositions, 3));
  ambientGeometry.setAttribute('color', new THREE.BufferAttribute(ambientColors, 3));

  const ambientMaterial = new THREE.PointsMaterial({
    size: 0.015,
    vertexColors: true,
    transparent: true,
    opacity: 0.5,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const ambientParticles = new THREE.Points(ambientGeometry, ambientMaterial);
  scene.add(ambientParticles);

  // --- Ring Geometry ---
  const ringGeometry = new THREE.RingGeometry(2.8, 2.85, 128);
  const ringMaterial = new THREE.MeshBasicMaterial({
    color: 0x8b5cf6,
    transparent: true,
    opacity: 0.08,
    side: THREE.DoubleSide,
  });
  const ring = new THREE.Mesh(ringGeometry, ringMaterial);
  ring.rotation.x = Math.PI * 0.35;
  scene.add(ring);

  // --- Mouse Interaction ---
  const mouse = { x: 0, y: 0 };
  const targetRotation = { x: 0, y: 0 };

  window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  });

  // --- Resize ---
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

  // --- Animation Loop ---
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsed = clock.getElapsedTime();

    // Smooth mouse follow
    targetRotation.x = mouse.y * 0.3;
    targetRotation.y = mouse.x * 0.3;

    particleSphere.rotation.x += (targetRotation.x - particleSphere.rotation.x) * 0.02;
    particleSphere.rotation.y += (targetRotation.y - particleSphere.rotation.y) * 0.02;
    particleSphere.rotation.z += 0.001;

    wireframeSphere.rotation.x = particleSphere.rotation.x;
    wireframeSphere.rotation.y = particleSphere.rotation.y;
    wireframeSphere.rotation.z = particleSphere.rotation.z;

    ring.rotation.z += 0.002;

    // Pulse particle sphere
    const pulse = Math.sin(elapsed * 0.5) * 0.05 + 1;
    particleSphere.scale.set(pulse, pulse, pulse);
    wireframeSphere.scale.set(pulse, pulse, pulse);

    // Animate ambient particles
    const ambientPos = ambientParticles.geometry.attributes.position.array;
    for (let i = 0; i < ambientCount; i++) {
      const i3 = i * 3;
      ambientPos[i3 + 1] += Math.sin(elapsed + i) * 0.0005;
      ambientPos[i3] += Math.cos(elapsed + i * 0.5) * 0.0003;
    }
    ambientParticles.geometry.attributes.position.needsUpdate = true;

    // Subtle particle displacement
    const spherePos = particleSphere.geometry.attributes.position.array;
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const offsetX = Math.sin(elapsed * 0.8 + i * 0.01) * 0.02;
      const offsetY = Math.cos(elapsed * 0.6 + i * 0.01) * 0.02;
      const offsetZ = Math.sin(elapsed * 0.4 + i * 0.02) * 0.02;
      spherePos[i3] = originalPositions[i3] + offsetX;
      spherePos[i3 + 1] = originalPositions[i3 + 1] + offsetY;
      spherePos[i3 + 2] = originalPositions[i3 + 2] + offsetZ;
    }
    particleSphere.geometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
  }

  animate();
}
