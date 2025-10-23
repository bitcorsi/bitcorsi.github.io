/**
 * Form Submission
 * Handles form submission to Google Sheets with client-side validation
 */
document.getElementById('form-iscrizione').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const formData = {
    nome: document.getElementById('nome').value.trim(),
    email: document.getElementById('email').value.trim(),
    telefono: document.getElementById('telefono').value.trim(),
    corso: document.getElementById('corso').value,
    note: document.getElementById('note').value.trim()
  };
  
  const messageEl = document.getElementById('form-message');
  const submitBtn = this.querySelector('button[type="submit"]');
  
  // Client-side validation
  if (!formData.nome) {
    messageEl.style.color = 'red';
    messageEl.textContent = '❌ Inserisci nome e cognome.';
    messageEl.style.display = 'block';
    return;
  }
  if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
    messageEl.style.color = 'red';
    messageEl.textContent = '❌ Inserisci un’email valida.';
    messageEl.style.display = 'block';
    return;
  }
  if (!/^\+?\d{8,15}$/.test(formData.telefono.replace(/\s/g, ''))) {
    messageEl.style.color = 'red';
    messageEl.textContent = '❌ Inserisci un numero di telefono valido.';
    messageEl.style.display = 'block';
    return;
  }
  if (!formData.corso) {
    messageEl.style.color = 'red';
    messageEl.textContent = '❌ Seleziona un corso.';
    messageEl.style.display = 'block';
    return;
  }
  
  try {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Invio in corso...';
    
    // Replace with your Google Sheets script URL or a CORS-enabled endpoint
    const response = await fetch('https://script.google.com/macros/s/AKfycby7zd1Kjhnm80gyKtVB60EO-g9Y833cpAzLh8epnd2r0SZtSZqYQtWL6wXNfVIV8EZH/exec', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    
    // Note: 'no-cors' mode is not used to allow response checking (requires CORS-enabled endpoint)
    if (!response.ok) throw new Error('Submission failed');
    
    messageEl.style.color = '#FF6B35';
    messageEl.textContent = '✅ Richiesta inviata! Ti contatteremo a breve.';
    messageEl.style.display = 'block';
    this.reset();
  } catch (error) {
    messageEl.style.color = 'red';
    messageEl.textContent = '❌ Errore. Scrivici su WhatsApp al +39 370 306 9215.';
    messageEl.style.display = 'block';
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Invia richiesta';
  }
});

/**
 * Smooth Scrolling
 * Applies smooth scrolling to anchor links
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    const target = document.querySelector(targetId);
    if (target) {
      window.scrollTo({
        top: target.offsetTop - 48, // Adjusted for smaller header (was 95px)
        behavior: 'smooth'
      });
    }
  });
});

/**
 * Course Filtering
 * Filters courses based on age or tool
 */
document.querySelectorAll('.filters button').forEach(button => {
  button.addEventListener('click', () => {
    const filter = button.getAttribute('data-filter');
    
    // Update active state
    document.querySelectorAll('.filters button').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    
    // Filter courses
    document.querySelectorAll('.course-card').forEach(card => {
      const age = card.getAttribute('data-age');
      const tool = card.getAttribute('data-tool');
      
      if (filter === 'all' || age === filter || tool === filter) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  });
});

/**
 * Modal Functionality
 * Opens and closes modals for tool cards
 */
document.querySelectorAll('.tool-card').forEach(card => {
  card.addEventListener('click', () => {
    const popupId = card.getAttribute('data-popup');
    const modal = document.getElementById(popupId);
    if (modal) {
      modal.classList.add('active');
      modal.querySelector('.modal-content').focus(); // Improve accessibility
    }
  });
});

document.addEventListener('click', e => {
  if (e.target.classList.contains('close-btn') || e.target.classList.contains('modal')) {
    const modal = e.target.closest('.modal');
    if (modal) {
      modal.classList.remove('active');
    }
  }
});

/**
 * Keyboard Accessibility for Modals
 * Close modal with Escape key
 */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal.active').forEach(modal => {
      modal.classList.remove('active');
    });
  }
});

/**
 * Section Animation
 * Adds animate-in class when sections enter viewport
 */
const sections = document.querySelectorAll('.section');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-in');
      observer.unobserve(entry.target); // Stop observing once animated
    }
  });
}, { threshold: 0.1 });

sections.forEach(section => observer.observe(section));
