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
     
