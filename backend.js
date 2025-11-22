// ================================
// PROJECT MODAL CONTENT
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

window.addEventListener('click', function (e) {
  const modal = document.getElementById('modal');
  if (e.target === modal) closeModal();
});

// ================================
// SMOOTH SCROLL
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
// NAVBAR HIDE ON SCROLL
// ================================
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  if (currentScroll > lastScroll && currentScroll > 100) {
    header.classList.add('hide');
  } else {
    header.classList.remove('hide');
  }
  lastScroll = currentScroll;
});

// ================================
// FADE-IN ON LOAD
// ================================
window.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".fade-item").forEach(item => {
        item.classList.add("active");
    });
});
