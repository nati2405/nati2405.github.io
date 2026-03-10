// ================================
// PROJECT DETAILS FOR MODAL
// ================================
const projects = [
  {
    title: 'Student Debt Modeling & Simulation',
    content: `
      <p><strong>Context:</strong> Research internship building Python-based simulations to model long-term effects of student loan policy systems.</p>
      <p><strong>Highlights:</strong> Designed reproducible Google Colab workflows, applied discrete math & calculus modeling, and presented results at NSF-supported research forums.</p>
    `
  },

  {
    title: 'Computational Biology Predictive Modeling',
    content: `
      <p><strong>Context:</strong> Contributed to the CURE-2025 Computational Biology project focusing on homology prediction.</p>
      <p><strong>Highlights:</strong> Built Random Forest models in R, improved prediction performance, and optimized analysis workflows in RStudio + Colab.</p>
    `
  },

  {
    title: 'AI Chatbot & Inventory Management System',
    content: `
      <p><strong>Context:</strong> Full-stack application built during the Headstarter AI Fellowship.</p>
      <p><strong>Highlights:</strong> Created a Rasa-powered conversational chatbot, automated product tracking, and built a full inventory dashboard using React/Next.js.</p>
    `
  }
];

// ================================
// OPEN MODAL
// ================================
function openModal(index) {
  const modal = document.getElementById('modal');
  const modalBody = document.getElementById('modal-body');

  modalBody.innerHTML = `
    <h3>${projects[index].title}</h3>
    ${projects[index].content}
  `;

  modal.style.display = 'flex';
}

// ================================
// CLOSE MODAL
// ================================
function closeModal() {
  document.getElementById('modal').style.display = 'none';
}

// Close modal when clicking outside box
window.addEventListener('click', function (e) {
  const modal = document.getElementById('modal');
  if (e.target === modal) {
    closeModal();
  }
});

// ================================
// SMOOTH SCROLL FOR NAV LINKS
// ================================
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ================================
// NAVBAR HIDE/SHOW ON SCROLL
// ================================
// Smooth & stable on all devices, including iPhone Safari

let lastScrollY = window.pageYOffset;
const header = document.querySelector(".header");

window.addEventListener("scroll", () => {
  const currentY = window.pageYOffset;

  // Scrolling down → hide navbar
  if (currentY > lastScrollY && currentY > 80) {
    header.classList.add("hide");
  }
  // Scrolling up → show navbar
  else {
    header.classList.remove("hide");
  }

  // Prevent negative scroll values on Safari
  lastScrollY = currentY <= 0 ? 0 : currentY;
});
const toggleBtn = document.querySelector(".nav-toggle");
const nav = document.querySelector(".navbar");

if (toggleBtn && nav) {
  toggleBtn.addEventListener("click", () => {
    nav.classList.toggle("open");
  });


  // close menu when clicking a link
  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      toggleBtn.setAttribute("aria-expanded", "false");
    });
  });

  // close menu when tapping outside
  document.addEventListener("click", (e) => {
    if (!nav.contains(e.target) && !toggleBtn.contains(e.target)) {
      nav.classList.remove("open");
      toggleBtn.setAttribute("aria-expanded", "false");
    }
  });
}

/* CHANGE: live falling neon hex background */
const canvas = document.getElementById("hex-bg");

if (canvas) {
  const ctx = canvas.getContext("2d");
  let w, h, dpr;
  let hexes = [];

  function random(min, max) {
    return Math.random() * (max - min) + min;
  }

  function resizeCanvas() {
    dpr = window.devicePixelRatio || 1;
    w = window.innerWidth;
    h = window.innerHeight;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    createHexes();
  }

  function createHexes() {
    hexes = [];
    const count = w < 768 ? 28 : 48; /* CHANGE: responsive density */

    for (let i = 0; i < count; i++) {
      hexes.push({
        x: random(0, w),
        y: random(-h, h),
        size: random(w < 768 ? 16 : 22, w < 768 ? 38 : 68),
        speed: random(0.25, 0.9),
        drift: random(-0.12, 0.12),
        rotation: random(0, Math.PI * 2),
        rotationSpeed: random(-0.002, 0.002),
        alpha: random(0.10, 0.30),
        blur: random(8, 18)
      });
    }
  }

  function drawHex(x, y, r, rotation, alpha, blur) {
    ctx.beginPath();

    for (let i = 0; i < 6; i++) {
      const angle = rotation + (Math.PI / 3) * i;
      const px = x + r * Math.cos(angle);
      const py = y + r * Math.sin(angle);

      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }

    ctx.closePath();
    ctx.shadowBlur = blur;
    ctx.shadowColor = `rgba(35, 220, 255, ${alpha * 1.8})`;
    ctx.strokeStyle = `rgba(35, 220, 255, ${alpha})`;
    ctx.lineWidth = 1.4;
    ctx.stroke();
  }

  function animate() {
    ctx.clearRect(0, 0, w, h);

    /* CHANGE: subtle dark blue moving glow wash */
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, "rgba(0, 190, 255, 0.015)");
    grad.addColorStop(0.5, "rgba(0, 255, 200, 0.025)");
    grad.addColorStop(1, "rgba(0, 120, 255, 0.015)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    for (const hex of hexes) {
      drawHex(hex.x, hex.y, hex.size, hex.rotation, hex.alpha, hex.blur);

      hex.y += hex.speed;
      hex.x += hex.drift;
      hex.rotation += hex.rotationSpeed;

      if (hex.y - hex.size > h) {
        hex.y = -hex.size - random(20, 200);
        hex.x = random(0, w);
      }

      if (hex.x < -100) hex.x = w + 100;
      if (hex.x > w + 100) hex.x = -100;
    }

    requestAnimationFrame(animate);
  }

  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();
  animate();
}