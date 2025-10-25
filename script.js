// ========================================
// OTTIMIZZAZIONE E PERFORMANCE
// ========================================

// Debounce function per ottimizzare eventi scroll/resize
function debounce(func, wait = 10) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// ========================================
// INIZIALIZZAZIONE AL CARICAMENTO DOM
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  initSmoothScroll();
  initIntersectionObserver(); // Rinominate e unificate qui le funzioni
  initModals();
  initCourseFilters();
  initAccessibility();
  // Rimosso initScrollEffects, unificato in initIntersectionObserver
  initFABBehavior();
  handleMobileMenu();
  handleContactForm(); // Nuova funzione per la gestione del Form

  // Log caricamento completato
  console.log('%c🤖 Bit Corsi - Website Ottimizzato v3.0',
    'color: #FF6B35; font-size: 16px; font-weight: bold; padding: 10px;');
  console.log('%c✓ Performance | ✓ UX Eccellente | ✓ Accessibilità | ✓ Mobile First',
    'color: #10B981; font-size: 12px; padding: 5px;');
});


// ========================================
// SMOOTH SCROLL PERFEZIONATO
// ========================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');

      // Ignora link vuoti o non validi
      if (targetId === "#" || targetId.length <= 1) return;
      
      // Ignora i link che aprono modali (gestiti altrove)
      if (this.closest('.tool-card')) return; 

      e.preventDefault();

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        
        // Offset di 20px in più per garantire che la sezione non sia 'sotto' l'header fisso
        const offset = targetElement.offsetTop - headerHeight - 20;

        window.scrollTo({
          top: offset,
          behavior: 'smooth'
        });
        
        // Chiudi il menu mobile se è aperto
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu && mobileMenu.classList.contains('open')) {
            mobileMenu.classList.remove('open');
            document.querySelector('.menu-toggle').setAttribute('aria-expanded', 'false');
        }
      }
    });
  });
}

// ========================================
// INTERSECTION OBSERVER PER ANIMAZIONI E NAVIGAZIONE ATTIVA (UNIFICATO)
// ========================================
let headerHeight = 0;
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav a[href^="#"], .mobile-menu a[href^="#"]');

function initIntersectionObserver() {
    // Calcola l'altezza dell'header una volta
    headerHeight = document.querySelector('.header').offsetHeight;
    
    // Observer per le animazioni di ingresso (reveal)
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Se l'elemento è animato, non abbiamo bisogno di osservarlo ulteriormente
                if (entry.target.classList.contains('reveal')) {
                    observer.unobserve(entry.target);
                }
            }
        });
    }, {
        rootMargin: '0px 0px -150px 0px', // Un po' di margine dal basso
        threshold: 0.1
    });

    // Observer per la navigazione attiva
    // Usiamo l'altezza dell'header come 'rootMargin' negativo
    // Quando la sezione entra per il 20% (threshold) e l'intersezione supera l'header,
    // viene considerata "attiva".
    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const id = entry.target.getAttribute('id');
            const link = document.querySelector(`.nav a[href="#${id}"], .mobile-menu a[href="#${id}"]`);
            
            if (link) {
                if (entry.isIntersecting) {
                    // Rimuovi 'active' da tutti i link e aggiungilo a quello corrente
                    navLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }
            }
        });
    }, {
        rootMargin: `-${headerHeight}px 0px -60% 0px`, // Ajusted per navigazione (taglia l'header, attiva presto)
        threshold: 0.1
    });

    sections.forEach(section => {
        // Applica animazioni
        revealObserver.observe(section);
        // Applica osservazione per la navigazione
        navObserver.observe(section);
    });
    
    // Gestione speciale per la sezione Home all'inizio (o sezioni corte)
    updateActiveNavLinkOnLoad();
}

function updateActiveNavLinkOnLoad() {
    const currentSectionId = sections[0].getAttribute('id');
    const link = document.querySelector(`.nav a[href="#${currentSectionId}"], .mobile-menu a[href="#${currentSectionId}"]`);
    if (link) {
        link.classList.add('active');
    }
}
// Rimosso window.addEventListener('scroll', debounce(updateActiveNavLink, 10));

// ========================================
// MODALS
// ========================================
function initModals() {
  const modalTriggers = document.querySelectorAll('[data-modal-target]');
  const modals = document.querySelectorAll('.modal');
  const closeButtons = document.querySelectorAll('.close-btn');

  modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const modal = document.getElementById(trigger.dataset.modalTarget);
      if (modal) {
        openModal(modal);
      }
    });
  });

  closeButtons.forEach(button => {
    button.addEventListener('click', () => {
      const modal = button.closest('.modal');
      closeModal(modal);
    });
  });

  modals.forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal')) {
        closeModal(modal);
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const openModalElement = document.querySelector('.modal.open');
      if (openModalElement) {
        closeModal(openModalElement);
      }
    }
  });

  function openModal(modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    modal.setAttribute('aria-hidden', 'false');
  }

  function closeModal(modal) {
    modal.classList.remove('open');
    document.body.style.overflow = 'auto';
    modal.setAttribute('aria-hidden', 'true');
  }
}

// ========================================
// FILTRI CORSI
// ========================================
function initCourseFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const courseCards = document.querySelectorAll('.course-card');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;

      // Rimuovi classe 'active' da tutti e aggiungila al click
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      courseCards.forEach(card => {
        const ageGroup = card.dataset.age;

        if (filter === 'all' || ageGroup === filter) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// ========================================
// ACCESSIBILITA'
// ========================================
function initAccessibility() {
  // Aggiunge focus visibile per tastiera (già di default, ma utile come reminder)
  document.body.addEventListener('mousedown', () => {
    document.body.classList.remove('using-keyboard');
  });

  document.body.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      document.body.classList.add('using-keyboard');
    }
  });
}

// ========================================
// FAB BEHAVIOR
// ========================================
function initFABBehavior() {
  const fabMain = document.querySelector('.fab-main');
  const fabWhatsapp = document.querySelector('.fab-whatsapp');
  let lastScrollTop = 0;

  // Mostra/nascondi FAB in base allo scroll (opzionale)
  window.addEventListener('scroll', debounce(() => {
    let st = window.pageYOffset || document.documentElement.scrollTop;

    // Nascondi se scorri verso il basso, mostra se scorri verso l'alto (dopo la sezione hero)
    if (st > lastScrollTop && st > 300) { 
      fabMain.style.opacity = '0';
      fabMain.style.transform = 'translateY(100px)';
      fabWhatsapp.style.opacity = '0';
      fabWhatsapp.style.transform = 'translateY(100px)';
    } else {
      fabMain.style.opacity = '1';
      fabMain.style.transform = 'translateY(0)';
      fabWhatsapp.style.opacity = '1';
      fabWhatsapp.style.transform = 'translateY(0)';
    }

    lastScrollTop = st <= 0 ? 0 : st;
  }, 50));
}

// ========================================
// MENU MOBILE
// ========================================
function handleMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const nav = document.querySelector('.nav');

    // Clona i link del menu desktop nel menu mobile per coerenza
    nav.querySelectorAll('a').forEach(link => {
        // Clona solo i link con href, escludendo il toggle button
        if (link.getAttribute('href')) {
            const clone = link.cloneNode(true);
            mobileMenu.appendChild(clone);
        }
    });

    menuToggle.addEventListener('click', () => {
        const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
        if (isOpen) {
            mobileMenu.classList.remove('open');
            menuToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = 'auto';
        } else {
            mobileMenu.classList.add('open');
            menuToggle.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden'; // Blocca scroll su body
        }
    });
}

// ========================================
// GESTIONE FORM CONTATTI (NUOVO)
// ========================================
function handleContactForm() {
    const form = document.getElementById('contact-form');
    const feedback = document.getElementById('form-feedback');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        feedback.style.display = 'none';

        // Validazione HTML5 di base
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            feedback.textContent = 'Per favore, compila tutti i campi obbligatori.';
            feedback.classList.remove('success');
            feedback.classList.add('error');
            feedback.style.display = 'block';
            return;
        }
        
        // Simula invio dati (qui andrebbe l'API call al server/servizio di invio email)
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Logga i dati (per il debug)
        console.log('Dati form da inviare:', data);

        // Simulazione di un invio asincrono
        try {
            // Aggiungi un loader o disabilita il pulsante qui
            document.querySelector('.btn-full').textContent = 'Invio in corso...';
            document.querySelector('.btn-full').disabled = true;

            // Simula ritardo di rete (2 secondi)
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Simula successo
            feedback.textContent = '✅ Richiesta inviata con successo! Ti contatteremo a breve.';
            feedback.classList.remove('error');
            feedback.classList.add('success');
            form.reset(); // Svuota il form solo in caso di successo
            form.classList.remove('was-validated');

        } catch (error) {
            // Simula errore
            console.error('Errore invio form:', error);
            feedback.textContent = '❌ Si è verificato un errore. Riprova o usa WhatsApp.';
            feedback.classList.remove('success');
            feedback.classList.add('error');
        } finally {
            // Ripristina il pulsante
            document.querySelector('.btn-full').textContent = 'Invia Richiesta';
            document.querySelector('.btn-full').disabled = false;
            feedback.style.display = 'block';
        }
    });
}
