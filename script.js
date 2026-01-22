// ========================================
// INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', function() {
  init();
});

function init() {
  initMobileMenu();
  initSmoothScroll();
  initTabs();
  initFAQ();
  initContactForm();
  initCourses();
  initScrollEffects();
  initTestimonials();
}

// ========================================
// MOBILE MENU
// ========================================
function initMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const header = document.querySelector('.header');
  const navLinks = document.querySelectorAll('.nav-link');
  
  if (!menuToggle) return;
  
  // Mobile menu toggle
  menuToggle.addEventListener('click', function() {
    header.classList.toggle('menu-open');
    
    if (header.classList.contains('menu-open')) {
      document.body.style.overflow = 'hidden';
      menuToggle.innerHTML = '<i class="fas fa-times"></i>';
    } else {
      document.body.style.overflow = '';
      menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    }
  });
  
  // Close menu when clicking links
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      header.classList.remove('menu-open');
      document.body.style.overflow = '';
      menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    });
  });
  
  // Close on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && header.classList.contains('menu-open')) {
      header.classList.remove('menu-open');
      document.body.style.overflow = '';
      menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    }
  });
  
  // Header scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

// ========================================
// SMOOTH SCROLL
// ========================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      if (href === '#' || href === '#!') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        
        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => {
          link.classList.remove('active');
        });
        this.classList.add('active');
        
        // Scroll to target
        window.scrollTo({
          top: target.offsetTop - 100,
          behavior: 'smooth'
        });
      }
    });
  });
}

// ========================================
// TABS SYSTEM
// ========================================
function initTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');
  
  if (tabBtns.length === 0) return;
  
  tabBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const tabId = this.getAttribute('data-tab');
      
      // Update active tab button
      tabBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      // Show active tab content
      tabPanes.forEach(pane => {
        pane.classList.remove('active');
        if (pane.id === tabId) {
          pane.classList.add('active');
        }
      });
    });
  });
}

// ========================================
// FAQ ACCORDION
// ========================================
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  if (faqItems.length === 0) return;
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', function() {
      // Close other items
      faqItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
        }
      });
      
      // Toggle current item
      item.classList.toggle('active');
    });
  });
}

// ========================================
// CONTACT FORM
// ========================================
function initContactForm() {
  const form = document.getElementById('iscrizione-form');
  if (!form) return;
  
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const submitBtn = this.querySelector('.btn-submit');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Invio in corso...';
    submitBtn.disabled = true;
    
    try {
      const formData = new FormData(this);
      
      // Simulate form submission (replace with actual fetch)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Success message
      showNotification('✅ Iscrizione inviata con successo! Ti contatteremo entro 24 ore.', 'success');
      
      // Reset form
      form.reset();
      
      // Scroll to top of form
      form.scrollIntoView({ behavior: 'smooth', block: 'start' });
      
    } catch (error) {
      console.error('Form submission error:', error);
      showNotification('❌ Errore nell\'invio. Riprova o contattaci direttamente.', 'error');
    } finally {
      // Restore button
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  });
  
  // Helper function for notifications
  function showNotification(message, type) {
    // Remove existing notification
    const existingNotification = document.querySelector('.form-notification');
    if (existingNotification) existingNotification.remove();
    
    // Create new notification
    const notification = document.createElement('div');
    notification.className = `form-notification ${type}`;
    notification.innerHTML = `
      <p>${message}</p>
      <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    
    // Add to form
    form.appendChild(notification);
    
    // Close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
      notification.remove();
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) notification.remove();
    }, 5000);
  }
}

// ========================================
// COURSES LOADING
// ========================================
function initCourses() {
  const coursesContainer = document.getElementById('courses-container');
  if (!coursesContainer) return;
  
  // Mock courses data (replace with actual fetch from corsi.json)
  const coursesData = {
    courses: [
      {
        id: 1,
        name: "LEGO Spike Prime Base",
        age: "8-11 anni",
        duration: "8 incontri",
        price: "€180",
        badge: "Disponibile",
        status: "open",
        description: "Introduzione alla robotica con mattoncini LEGO e programmazione a blocchi.",
        features: ["Robot autonomi", "Sensori di movimento", "Programmazione visuale", "Progetto finale"],
        schedule: "Sabato 10:00-11:30"
      },
      {
        id: 2,
        name: "Arduino Avanzato",
        age: "12-16 anni",
        duration: "10 incontri",
        price: "€220",
        badge: "Ultimi posti",
        status: "open",
        description: "Creazione di progetti elettronici con sensori, LED e componenti reali.",
        features: ["Elettronica base", "Sensori analogici", "Progetti IoT", "Coding C++"],
        schedule: "Sabato 11:30-13:00"
      },
      {
        id: 3,
        name: "micro:bit Creativo",
        age: "8-13 anni",
        duration: "6 incontri",
        price: "€150",
        badge: "In partenza",
        status: "open",
        description: "Programmazione di dispositivi portatili con LED, sensori e Bluetooth.",
        features: ["LED matrix", "Sensori integrati", "Bluetooth", "Progetti wearable"],
        schedule: "Sabato 9:00-10:30"
      }
    ]
  };
  
  // Simulate API delay
  setTimeout(() => {
    renderCourses(coursesData.courses);
  }, 800);
  
  function renderCourses(courses) {
    coursesContainer.innerHTML = '';
    
    courses.forEach(course => {
      const courseCard = document.createElement('div');
      courseCard.className = 'course-card';
      courseCard.innerHTML = `
        <div class="course-badge ${course.status === 'open' ? 'badge-open' : 'badge-closed'}">
          ${course.badge}
        </div>
        <div class="course-header">
          <h3>${course.name}</h3>
          <div class="course-price">${course.price}</div>
          <div class="course-period">${course.duration}</div>
        </div>
        <div class="course-body">
          <div class="course-meta">
            <span class="meta-item"><i class="fas fa-child"></i> ${course.age}</span>
            <span class="meta-item"><i class="fas fa-calendar"></i> ${course.schedule}</span>
          </div>
          <p class="course-description">${course.description}</p>
          <ul class="course-features">
            ${course.features.map(feature => `<li><i class="fas fa-check"></i> ${feature}</li>`).join('')}
          </ul>
        </div>
        <div class="course-footer">
          <a href="#contatti" class="btn btn-primary btn-course">
            <i class="fas fa-calendar-plus"></i> Prenota ora
          </a>
        </div>
      `;
      
      coursesContainer.appendChild(courseCard);
    });
  }
}

// ========================================
// SCROLL EFFECTS
// ========================================
function initScrollEffects() {
  // Animate elements on scroll
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  }, observerOptions);
  
  // Observe elements to animate
  document.querySelectorAll('.feature-card, .testimonial-card, .tool-detail').forEach(el => {
    observer.observe(el);
  });
  
  // Add CSS for animations
  const style = document.createElement('style');
  style.textContent = `
    .feature-card, .testimonial-card, .tool-detail {
      opacity: 0;
      transform: translateY(30px);
      transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .feature-card.animate-in, 
    .testimonial-card.animate-in, 
    .tool-detail.animate-in {
      opacity: 1;
      transform: translateY(0);
    }
    
    .feature-card:nth-child(2) { transition-delay: 0.1s; }
    .feature-card:nth-child(3) { transition-delay: 0.2s; }
    .feature-card:nth-child(4) { transition-delay: 0.3s; }
  `;
  document.head.appendChild(style);
}

// ========================================
// TESTIMONIALS SLIDER
// ========================================
function initTestimonials() {
  const testimonials = document.querySelector('.testimonials-slider');
  if (!testimonials) return;
  
  // Auto-rotate testimonials
  let currentIndex = 0;
  const testimonialCards = testimonials.querySelectorAll('.testimonial-card');
  
  if (testimonialCards.length <= 1) return;
  
  function rotateTestimonials() {
    testimonialCards.forEach((card, index) => {
      card.style.opacity = index === currentIndex ? '1' : '0';
      card.style.transform = index === currentIndex ? 'translateX(0)' : 'translateX(100%)';
      card.style.position = index === currentIndex ? 'relative' : 'absolute';
      card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    currentIndex = (currentIndex + 1) % testimonialCards.length;
  }
  
  // Start rotation only on desktop
  if (window.innerWidth > 768) {
    setInterval(rotateTestimonials, 5000);
  }
}

// ========================================
// FORM NOTIFICATION STYLES
// ========================================
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
  .form-notification {
    position: relative;
    padding: 15px 20px;
    border-radius: var(--radius);
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    animation: slideIn 0.3s ease;
  }
  
  .form-notification.success {
    background: rgba(16, 185, 129, 0.1);
    border: 2px solid rgba(16, 185, 129, 0.3);
    color: var(--success);
  }
  
  .form-notification.error {
    background: rgba(239, 68, 68, 0.1);
    border: 2px solid rgba(239, 68, 68, 0.3);
    color: var(--danger);
  }
  
  .notification-close {
    background: none;
    border: none;
    color: inherit;
    cursor: pointer;
    font-size: 1.2rem;
    padding: 5px;
    margin-left: 10px;
  }
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(notificationStyles);

// ========================================
// ERROR HANDLING
// ========================================
window.addEventListener('error', function(e) {
  console.error('JavaScript Error:', e.error);
  
  // Show user-friendly error message for critical errors
  if (e.error.message.includes('fetch') || e.error.message.includes('network')) {
    const coursesContainer = document.getElementById('courses-container');
    if (coursesContainer) {
      coursesContainer.innerHTML = `
        <div class="error-message" style="grid-column: 1/-1; text-align: center; padding: 40px;">
          <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: var(--warning); margin-bottom: 20px;"></i>
          <h3>Connessione interrotta</h3>
          <p>Impossibile caricare i corsi. Controlla la tua connessione o contattaci direttamente.</p>
          <a href="#contatti" class="btn btn-outline" style="margin-top: 20px;">
            <i class="fas fa-phone"></i> Contattaci
          </a>
        </div>
      `;
    }
  }
});

// ========================================
// PRINT PAGE
// ========================================
function printPage() {
  window.print();
}

// Add print button to courses section
document.addEventListener('DOMContentLoaded', () => {
  const coursesSection = document.querySelector('#corsi .container');
  if (coursesSection) {
    const printBtn = document.createElement('button');
    printBtn.className = 'btn btn-outline print-btn';
    printBtn.innerHTML = '<i class="fas fa-print"></i> Stampa info corsi';
    printBtn.addEventListener('click', printPage);
    
    const header = coursesSection.querySelector('.section-header');
    if (header) {
      header.appendChild(printBtn);
    }
  }
});

// ========================================
// SOCIAL SHARE
// ========================================
function shareCourse(courseName) {
  if (navigator.share) {
    navigator.share({
      title: `Corso ${courseName} - BIT Robotica`,
      text: `Scopri il corso ${courseName} di robotica educativa per ragazzi a Brescia!`,
      url: window.location.href
    });
  } else {
    // Fallback: copy to clipboard
    const text = `Scopri il corso ${courseName} di BIT Robotica: ${window.location.href}`;
    navigator.clipboard.writeText(text).then(() => {
      alert('Link copiato negli appunti! Condividilo con chi vuoi.');
    });
  }
}
