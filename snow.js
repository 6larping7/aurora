// drifting dust — slow, soft, pale. matches a calm moonlit scene.
(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const c = document.getElementById('snow');
  const ctx = c.getContext('2d');
  let w = 0, h = 0, dpr = window.devicePixelRatio || 1;
  const particles = [];
  const COUNT = Math.min(70, Math.floor(window.innerWidth / 20));

  function resize() {
    w = window.innerWidth;
    h = window.innerHeight;
    c.width = w * dpr;
    c.height = h * dpr;
    c.style.width = w + 'px';
    c.style.height = h + 'px';
    ctx.scale(dpr, dpr);
  }
  window.addEventListener('resize', resize);
  resize();

  for (let i = 0; i < COUNT; i++) {
    particles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.6 + 0.4,
      vy: Math.random() * 0.25 + 0.08,
      vx: (Math.random() - 0.5) * 0.15,
      a: Math.random() * 0.4 + 0.15,
      phase: Math.random() * Math.PI * 2,
    });
  }

  function tick(t) {
    ctx.clearRect(0, 0, w, h);
    for (const p of particles) {
      p.y += p.vy;
      p.x += p.vx + Math.sin((t * 0.0005) + p.phase) * 0.2;
      if (p.y > h + 4) { p.y = -4; p.x = Math.random() * w; }
      if (p.x < -4) p.x = w + 4;
      if (p.x > w + 4) p.x = -4;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(231, 220, 232, ${p.a})`;
      ctx.fill();
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();
