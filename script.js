(function () {
  "use strict";

  const canvas = document.getElementById("leaves");
  const ctx = canvas.getContext("2d");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let leaves = [];
  let w = 0;
  let h = 0;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  window.addEventListener("resize", resize);
  resize();

  const palette = ["#d4a94f", "#e6c47a", "#8f9a5a", "#c73e3a", "#b58a3c"];

  function makeLeaf(initial) {
    const size = 5 + Math.random() * 7;
    return {
      x: Math.random() * w,
      y: initial ? Math.random() * h : -20,
      size: size,
      vy: 0.4 + Math.random() * 0.9,
      vx: (Math.random() - 0.5) * 0.6,
      sway: Math.random() * Math.PI * 2,
      swaySpeed: 0.008 + Math.random() * 0.02,
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.03,
      color: palette[Math.floor(Math.random() * palette.length)],
      opacity: 0.5 + Math.random() * 0.4,
    };
  }

  function leafCount() {
    return Math.min(60, Math.max(16, Math.floor((w * h) / 26000)));
  }

  function drawLeaf(l) {
    ctx.save();
    ctx.translate(l.x, l.y);
    ctx.rotate(l.rot);
    ctx.globalAlpha = l.opacity;
    ctx.fillStyle = l.color;
    ctx.beginPath();
    ctx.ellipse(0, 0, l.size, l.size * 0.55, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(l.size * 0.6, -l.size * 0.3, l.size * 0.9, 0);
    ctx.strokeStyle = l.color;
    ctx.globalAlpha = l.opacity * 0.6;
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
  }

  function frame() {
    ctx.clearRect(0, 0, w, h);
    for (const l of leaves) {
      l.sway += l.swaySpeed;
      l.x += l.vx + Math.sin(l.sway) * 0.4;
      l.y += l.vy;
      l.rot += l.rotSpeed;
      if (l.y > h + 30) {
        Object.assign(l, makeLeaf(false));
        l.y = -30;
      }
      if (l.x > w + 40) l.x = -40;
      if (l.x < -40) l.x = w + 40;
      drawLeaf(l);
    }
    requestAnimationFrame(frame);
  }

  function init() {
    if (reduceMotion) return;
    leaves = Array.from({ length: leafCount() }, () => makeLeaf(true));
    frame();
  }

  init();

  const form = document.getElementById("notify");
  const email = document.getElementById("email");
  const msg = document.getElementById("form-msg");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const value = email.value.trim();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

    if (!valid) {
      msg.textContent = "Please enter a valid email address.";
      msg.classList.add("error");
      return;
    }

    msg.classList.remove("error");
    msg.textContent = "Спасибо! You're on the list. We'll write to you soon.";
    form.reset();
  });
})();
