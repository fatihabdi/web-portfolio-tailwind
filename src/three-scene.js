/**
 * Gravity Stars — Fullscreen Interactive Star Background
 * Inspired by animate-ui.com gravity stars
 * Responsive mouse interaction with strong gravity, glow, and connection effects
 */

const CONFIG = {
  starCount: 150,
  starSize: 2,
  starOpacity: 0.9,
  glowIntensity: 18,
  movementSpeed: 0.4,
  mouseInfluence: 180,
  gravityStrength: 120,
  lineDist: 140,
  lineChance: 0.08,
};

let canvas, ctx, stars, mouse, animationId, oldWidth, oldHeight;

export function initThreeScene() {
  canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  ctx = canvas.getContext('2d');
  mouse = { x: -9999, y: -9999, targetX: -9999, targetY: -9999, prevX: -9999, prevY: -9999 };

  resizeCanvas();
  initStars();
  bindEvents();
  animate();
}

function resizeCanvas() {
  oldWidth = canvas.width || window.innerWidth;
  oldHeight = canvas.height || window.innerHeight;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  if (stars) {
    const scaleX = canvas.width / oldWidth;
    const scaleY = canvas.height / oldHeight;
    stars.forEach((s) => {
      s.x *= scaleX;
      s.y *= scaleY;
    });
  }
}

function initStars() {
  stars = [];
  for (let i = 0; i < CONFIG.starCount; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * CONFIG.movementSpeed * 0.8,
      vy: (Math.random() - 0.5) * CONFIG.movementSpeed * 0.4 + 0.05,
      size: Math.random() * CONFIG.starSize + 0.2,
      baseOpacity: Math.random() * 0.4 + 0.3,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: 0.015 + Math.random() * 0.025,
    });
  }
}

function bindEvents() {
  window.addEventListener('resize', resizeCanvas);

  window.addEventListener('mousemove', (e) => {
    mouse.targetX = e.clientX;
    mouse.targetY = e.clientY;
    mouse.prevX = e.clientX;
    mouse.prevY = e.clientY;
  });

  window.addEventListener('touchmove', (e) => {
    const touch = e.touches[0];
    mouse.targetX = touch.clientX;
    mouse.targetY = touch.clientY;
  });

  window.addEventListener('touchend', () => {
    mouse.targetX = -9999;
    mouse.targetY = -9999;
  });

  window.addEventListener('mouseleave', () => {
    mouse.targetX = -9999;
    mouse.targetY = -9999;
  });


}

function animate() {
  animationId = requestAnimationFrame(animate);

  // Smooth mouse following — faster for more responsive feel
  mouse.x += (mouse.targetX - mouse.x) * 0.12;
  mouse.y += (mouse.targetY - mouse.y) * 0.12;



  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Track stars near mouse for connection line boost
  const nearMouse = [];

  // First pass: update positions, collect near-mouse stars
  stars.forEach((star) => {
    star.pulse += star.pulseSpeed;
    const pulseFactor = Math.sin(star.pulse) * 0.25 + 0.75;

    // --- Gravity towards mouse ---
    const dx = mouse.x - star.x;
    const dy = mouse.y - star.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const distNorm = dist / CONFIG.mouseInfluence;

    if (dist < CONFIG.mouseInfluence && dist > 1) {
      // Stronger gravity closer to mouse (inverse square-ish)
      const strength = (1 - distNorm) * CONFIG.gravityStrength;
      const force = (strength / dist) * 0.5;
      const fx = (dx / dist) * force;
      const fy = (dy / dist) * force;

      // Add some swirl/orbit effect for more organic feel
      const swirl = 0.3 * (1 - distNorm);
      star.vx += fx + (-dy / dist) * force * swirl;
      star.vy += fy + (dx / dist) * force * swirl;

      // Track for connection boost
      nearMouse.push(star);
    } else if (star.x < -50 || star.x > canvas.width + 50 || star.y < -50 || star.y > canvas.height + 50) {
      // Gentle pull back toward viewport when star drifts far off screen
      const cx = canvas.width / 2 - star.x;
      const cy = canvas.height / 2 - star.y;
      const cDist = Math.sqrt(cx * cx + cy * cy);
      if (cDist > 0) {
        star.vx += (cx / cDist) * 0.005;
        star.vy += (cy / cDist) * 0.005;
      }
    }

    // Damping
    star.vx *= 0.96;
    star.vy *= 0.96;

    // Speed cap
    const speed = Math.sqrt(star.vx * star.vx + star.vy * star.vy);
    if (speed > 3) {
      star.vx = (star.vx / speed) * 3;
      star.vy = (star.vy / speed) * 3;
    }

    star.x += star.vx;
    star.y += star.vy;

    // Wrap around screen edges (viewport, since canvas is fixed)
    if (star.x < -15) { star.x = canvas.width + 15; }
    if (star.x > canvas.width + 15) { star.x = -15; }
    if (star.y < -15) { star.y = canvas.height + 15; }
    if (star.y > canvas.height + 15) { star.y = -15; }
  });

  // Second pass: draw stars
  stars.forEach((star) => {
    const displayY = star.y;
    const pulseFactor = Math.sin(star.pulse) * 0.25 + 0.75;

    // Distance from mouse for dynamic effects
    const dx = mouse.x - star.x;
    const dy = mouse.y - displayY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const mouseProximity = Math.max(0, 1 - dist / CONFIG.mouseInfluence);

    // Dynamic brightness: stars near mouse glow brighter
    const brightnessBoost = mouseProximity * 2;
    const alpha = Math.min(star.baseOpacity * pulseFactor * CONFIG.starOpacity + brightnessBoost * 0.3, 1);
    const size = star.size * pulseFactor + mouseProximity * 1.5;

    // --- Draw Glow ---
    const glowRadius = size * CONFIG.glowIntensity * (0.25 + mouseProximity * 0.4);
    const glowAlpha = alpha * (0.3 + mouseProximity * 0.5);

    const gradient = ctx.createRadialGradient(
      star.x, displayY, 0,
      star.x, displayY, glowRadius
    );
    gradient.addColorStop(0, `rgba(6, 182, 212, ${glowAlpha * 0.5})`);
    gradient.addColorStop(0.4, `rgba(6, 182, 212, ${glowAlpha * 0.15})`);
    gradient.addColorStop(1, 'rgba(6, 182, 212, 0)');

    ctx.beginPath();
    ctx.arc(star.x, displayY, glowRadius, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();

    // --- Draw Star Core ---
    ctx.beginPath();
    ctx.arc(star.x, displayY, size, 0, Math.PI * 2);
    // Core gets warmer/brighter near mouse
    const coreBrightness = 200 + Math.floor(mouseProximity * 55);
    ctx.fillStyle = `rgba(${coreBrightness}, ${coreBrightness}, 255, ${alpha})`;
    ctx.fill();
  });

  // --- Draw Connection Lines ---
  // More visible near mouse, dynamic
  // When many stars are near mouse, draw more connections for a denser web effect
  const useAllStars = nearMouse.length > 5;
  const starsPool = useAllStars ? stars : nearMouse;
  const lineChanceMult = useAllStars ? CONFIG.lineChance * 1.5 : CONFIG.lineChance;

  for (let i = 0; i < starsPool.length; i++) {
    if (Math.random() > lineChanceMult) continue;

    const star = starsPool[i];
    const displayY1 = star.y;

    // Check a limited number of neighbors for performance
    const maxNeighbors = Math.min(i + 15, starsPool.length);

    for (let j = i + 1; j < maxNeighbors; j++) {
      const other = starsPool[j];
      const displayY2 = other.y;

      const dx = star.x - other.x;
      const dy = displayY1 - displayY2;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < CONFIG.lineDist) {
        const distRatio = 1 - dist / CONFIG.lineDist;

        // Boost connections near mouse
        const starProx1 = Math.max(0, 1 - Math.sqrt((mouse.x - star.x) ** 2 + (mouse.y - displayY1) ** 2) / CONFIG.mouseInfluence);
        const starProx2 = Math.max(0, 1 - Math.sqrt((mouse.x - other.x) ** 2 + (mouse.y - displayY2) ** 2) / CONFIG.mouseInfluence);
        const proximityBoost = Math.max(starProx1, starProx2);

        const lineAlpha = distRatio * (0.08 + proximityBoost * 0.25);

        ctx.beginPath();
        ctx.moveTo(star.x, displayY1);
        ctx.lineTo(other.x, displayY2);
        ctx.strokeStyle = `rgba(6, 182, 212, ${lineAlpha})`;
        ctx.lineWidth = 0.4 + proximityBoost * 0.8;
        ctx.stroke();
        break;
      }
    }
  }
}

export function destroyThreeScene() {
  if (animationId) cancelAnimationFrame(animationId);
  window.removeEventListener('resize', resizeCanvas);
}
