// ========================================
// FUNZIONI GENERALI
// ========================================

/**
 * Inizializza tutte le funzionalità del sito
 */
function init() {
    initMobileMenu();
    initFAQ();
    initContactForm();
    initScrollAnimations();
    initTooltip();
}

/**
 * Gestione menu mobile
 */
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navOverlay = document.querySelector('.nav-overlay');
    const body = document.body;

    if (!menuToggle || !navOverlay) return;

    menuToggle.addEventListener('click', function() {
        const isOpen = navOverlay.classList.contains('active');
        
        if (isOpen) {
            // Chiudi menu
            navOverlay.classList.remove('active');
            menuToggle.classList.remove('open');
            body.style.overflow = '';
        } else {
            // Apri menu
            navOverlay.classList.add('active');
            menuToggle.classList.add('open');
            body.style.overflow = 'hidden';
        }
    });

    // Chiudi menu quando si clicca su un link
    const navLinks = navOverlay.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navOverlay.classList.remove('active');
            menuToggle.classList.remove('open');
            body.style.overflow = '';
        });
    });

    // Chiudi menu quando si preme ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navOverlay.classList.contains('active')) {
            navOverlay.classList.remove('active');
            menuToggle.classList.remove('open');
            body.style.overflow = '';
        }
    });
}

/**
 * Gestione FAQ (accordion)
 */
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-grid details');
    
    faqItems.forEach(item => {
        item.addEventListener('toggle', function() {
            if (this.open) {
                // Chiudi altri elementi aperti
                faqItems.forEach(otherItem => {
                    if (otherItem !== this && otherItem.open) {
                        otherItem.open = false;
                    }
                });
            }
        });
    });
}

/**
 * Gestione form contatti con invio reale via FormSubmit
 */
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    const successMsg = document.getElementById('formSuccess');
    
    if (!contactForm) return;

    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault(); // evita il redirect di FormSubmit

        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        submitBtn.textContent = 'Invio in corso...';
        submitBtn.disabled = true;

        try {
            // Invia i dati al tuo endpoint FormSubmit
            await fetch(this.action, {
                method: 'POST',
                body: new FormData(this)
            });

            // Reset del form
            this.reset();

            // Mostra messaggio di successo
            if (successMsg) {
                successMsg.classList.add('visible');
                successMsg.textContent = '✅ Grazie! Il tuo messaggio è stato inviato.';
                setTimeout(() => {
                    successMsg.classList.remove('visible');
                }, 5000);
            }

        } catch (error) {
            console.error('Errore durante l’invio del form:', error);
            if (successMsg) {
                successMsg.textContent = '❌ Errore durante l’invio. Riprova più tardi.';
                successMsg.classList.add('visible');
            }
        }

        // Ripristina bottone
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    });
}

/**
 * Animazioni al scroll
 */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Elementi da animare
    const animatedElements = document.querySelectorAll('.tool-card, .course-card, .highlight-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

/**
 * Tooltip per i floating buttons
 */
function initTooltip() {
    const fabButtons = document.querySelectorAll('.fab');
    
    fabButtons.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            const tooltip = this.querySelector('.fab-tooltip');
            if (tooltip) {
                tooltip.style.display = 'block';
            }
        });
        
        btn.addEventListener('mouseleave', function() {
            const tooltip = this.querySelector('.fab-tooltip');
            if (tooltip) {
                tooltip.style.display = 'none';
            }
        });
    });
}

/**
 * Smooth scroll per anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ========================================
// INIZIALIZZAZIONE
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    init();
    initSmoothScroll();
    hideFabInContacts(); // <-- AGGIUNGI QUESTA RIGA
});
// Nascondi FAB quando si è nella sezione contatti
window.addEventListener('scroll', function() {
  const fabContainer = document.querySelector('.fab-container');
  const contactsSection = document.getElementById('contatti');
  
  if (fabContainer && contactsSection) {
    const contactsRect = contactsSection.getBoundingClientRect();
    
    // Se la sezione contatti è visibile a schermo
    if (contactsRect.top < window.innerHeight && contactsRect.bottom > 0) {
      fabContainer.style.display = 'none';
    } else {
      fabContainer.style.display = 'flex';
    }
  }
});
// ========================================
// GESTIONE ERRORI
// ========================================
window.addEventListener('error', function(e) {
    console.error('Errore JavaScript:', e.error);
});

// ========================================
// PERFORMANCE E OFFLINE
// ========================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registrato con successo: ', registration.scope);
            })
            .catch(function(error) {
                console.log('Registrazione ServiceWorker fallita: ', error);
            });
    });
}
