const header = document.querySelector(".header");
const toggleBtn = document.querySelector(".nav-toggle");
const nav = document.querySelector(".navbar");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let lastScrollY = window.pageYOffset;

function getHeaderOffset() {
  return header ? header.offsetHeight + 24 : 0;
}

function setMenuState(isOpen) {
  if (!nav || !toggleBtn) {
    return;
  }

  nav.classList.toggle("open", isOpen);
  toggleBtn.setAttribute("aria-expanded", String(isOpen));
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));

    if (!target) {
      return;
    }

    event.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - getHeaderOffset();

    window.scrollTo({
      top,
      behavior: prefersReducedMotion ? "auto" : "smooth"
    });

    setMenuState(false);
  });
});

window.addEventListener("scroll", () => {
  const currentY = window.pageYOffset;

  if (header) {
    header.classList.toggle("scrolled", currentY > 18);

    if (currentY > lastScrollY && currentY > 96) {
      header.classList.add("hide");
    } else {
      header.classList.remove("hide");
    }
  }

  lastScrollY = currentY <= 0 ? 0 : currentY;
});

if (toggleBtn && nav) {
  toggleBtn.addEventListener("click", () => {
    const willOpen = !nav.classList.contains("open");
    setMenuState(willOpen);
  });

  document.addEventListener("click", (event) => {
    if (!nav.contains(event.target) && !toggleBtn.contains(event.target)) {
      setMenuState(false);
    }
  });
}

const revealElements = document.querySelectorAll(".reveal, .reveal-card");
const contactModal = document.getElementById("contact-modal");
const openContactButton = document.querySelector("[data-open-contact]");
const closeContactButtons = document.querySelectorAll("[data-close-contact]");

function setContactModalState(isOpen) {
  if (!contactModal) {
    return;
  }

  contactModal.classList.toggle("is-open", isOpen);
  contactModal.setAttribute("aria-hidden", String(!isOpen));
  document.body.style.overflow = isOpen ? "hidden" : "";
}

if (openContactButton && contactModal) {
  openContactButton.addEventListener("click", () => {
    setContactModalState(true);
  });

  closeContactButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setContactModalState(false);
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && contactModal.classList.contains("is-open")) {
      setContactModalState(false);
    }
  });
}

if (prefersReducedMotion) {
  revealElements.forEach((element) => element.classList.add("visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -40px 0px"
    }
  );

  revealElements.forEach((element) => revealObserver.observe(element));
}

const canvas = document.getElementById("hex-bg");

if (canvas && !prefersReducedMotion) {
  const ctx = canvas.getContext("2d");
  let width = 0;
  let height = 0;
  let dpr = 1;
  let hexes = [];

  function random(min, max) {
    return Math.random() * (max - min) + min;
  }

  function resizeCanvas() {
    dpr = window.devicePixelRatio || 1;
    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    createHexes();
  }

  function createHexes() {
    hexes = [];
    const count = width < 768 ? 24 : 44;

    for (let index = 0; index < count; index += 1) {
      hexes.push({
        x: random(0, width),
        y: random(-height, height),
        size: random(width < 768 ? 16 : 20, width < 768 ? 34 : 66),
        speed: random(0.2, 0.75),
        drift: random(-0.14, 0.14),
        rotation: random(0, Math.PI * 2),
        rotationSpeed: random(-0.0025, 0.0025),
        alpha: random(0.09, 0.28),
        blur: random(8, 18)
      });
    }
  }

  function drawHex(x, y, radius, rotation, alpha, blur) {
    ctx.beginPath();

    for (let side = 0; side < 6; side += 1) {
      const angle = rotation + (Math.PI / 3) * side;
      const px = x + radius * Math.cos(angle);
      const py = y + radius * Math.sin(angle);

      if (side === 0) {
        ctx.moveTo(px, py);
      } else {
        ctx.lineTo(px, py);
      }
    }

    ctx.closePath();
    ctx.shadowBlur = blur;
    ctx.shadowColor = `rgba(98, 245, 208, ${alpha * 1.8})`;
    ctx.strokeStyle = `rgba(81, 220, 255, ${alpha})`;
    ctx.lineWidth = 1.2;
    ctx.stroke();
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, "rgba(31, 212, 255, 0.016)");
    gradient.addColorStop(0.5, "rgba(98, 245, 208, 0.024)");
    gradient.addColorStop(1, "rgba(31, 212, 255, 0.014)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    hexes.forEach((hex) => {
      drawHex(hex.x, hex.y, hex.size, hex.rotation, hex.alpha, hex.blur);

      hex.y += hex.speed;
      hex.x += hex.drift;
      hex.rotation += hex.rotationSpeed;

      if (hex.y - hex.size > height) {
        hex.y = -hex.size - random(40, 180);
        hex.x = random(0, width);
      }

      if (hex.x < -100) {
        hex.x = width + 100;
      }

      if (hex.x > width + 100) {
        hex.x = -100;
      }
    });

    window.requestAnimationFrame(animate);
  }

  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();
  animate();
} else if (canvas) {
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const width = window.innerWidth;
  const height = window.innerHeight;

  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, "rgba(31, 212, 255, 0.04)");
  gradient.addColorStop(1, "rgba(98, 245, 208, 0.03)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}
