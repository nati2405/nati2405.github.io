// ================================
// PROJECT DETAILS FOR MODAL
// ================================
const projects = [
  {
    title: 'Student Debt Modeling & Simulation',
    content: `
      <p><strong>Context:</strong> Research internship developing Python simulations to study long-term policy impacts on student debt.</p>
      <p><strong>Highlights:</strong> Designed reproducible Google Colab workflows, applied discrete math & advanced calculus, and presented findings at NSF-supported forums and the BEER Conference.</p>
    `
  },
  {
    title: 'Computational Biology Predictive Modeling',
    content: `
      <p><strong>Context:</strong> Computational Biology research building predictive Random Forest models in R.</p>
      <p><strong>Highlights:</strong> Improved homology prediction accuracy, optimized RStudio + Colab workflows, and contributed analyses supporting ongoing biology research.</p>
    `
  },
  {
    title: 'AI Chatbot & Inventory Management System',
    content: `
      <p><strong>Context:</strong> HeadStarter AI fellowship project integrating machine learning with full‑stack web development.</p>
      <p><strong>Highlights:</strong> Built a Rasa-based conversational chatbot and a React/Next.js inventory system that automates updates and enhances usability.</p>
    `
  }
];

// ================================
// MODAL HANDLING
// ================================
function openModal(e, index) {
  e.preventDefault();
  const modal = document.getElementById('modal');
  const modalBody = document.getElementById('modal-body');

  modalBody.innerHTML = `
    <h3>${projects[index].title}</h3>
    ${projects[index].content}
  `;

  modal.style.display = 'flex';
}

function closeModal() {
  document.getElementById('modal').style.display = 'none';
}

// Close modal on background click
window.addEventListener('click', (e) => {
  const modal = document.getElementById('modal');
  if (e.target === modal) closeModal();
});

// ================================
// SMOOTH SCROLLING FOR NAV LINKS
// ================================
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
