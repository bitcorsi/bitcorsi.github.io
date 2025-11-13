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
            navOverlay.classList.remove('active');
            menuToggle.classList.remove('open');
            body.style.overflow = '';
        } else {
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
    const faqItems = document.querySelectorAll('.faq-list details');
    
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
 * Gestione form iscrizione con conferma inline (FormSubmit)
 */
function initContactForm() {
    const contactForm = document.getElementById('iscrizione-form');
    const messageEl = document.getElementById('form-message');
    
    if (!contactForm) return;

    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const submitBtn = this.querySelector('.btn-submit');
        if (!submitBtn || submitBtn.disabled) return;

        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Invio…';

        // Reset messaggio precedente
        if (messageEl) {
            messageEl.className = 'form-message';
            messageEl.textContent = '';
        }

        try {
            const response = await fetch(this.action.trim(), {
                method: 'POST',
                body: new FormData(this)
            });

            let success = false;
            const contentType = response.headers.get('content-type') || '';

            if (response.ok) {
                if (contentType.includes('application/json')) {
                    const data = await response.json();
                    success = !!data.success;
                } else {
                    const text = await response.text();
                    success = text.includes('success') || text.includes('Thank you');
                }
            }

            if (success) {
                this.reset();
                if (messageEl) {
                    messageEl.textContent = '✅ Iscrizione inviata con successo!';
                    messageEl.className = 'form-message success';
                    setTimeout(() => {
                        messageEl.className = 'form-message';
                        setTimeout(() => messageEl.textContent = '', 300);
                    }, 5000);
                }
            } else {
                throw new Error('FormSubmit: risposta non valida');
            }

        } catch (error) {
            console.error('❌ Invio fallito:', error);
            if (messageEl) {
                messageEl.textContent = '❌ Errore: controlla i dati e riprova.';
                messageEl.className = 'form-message error';
            }
        } finally {
            setTimeout(() => {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                }
            }, 600);
        }
    });
}

/**
 * Animazioni al scroll (opzionale: se preferisci solo al caricamento, rimuovi questa funzione)
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

    const animatedElements = document.querySelectorAll('.tool-card, .course-card, .highlight-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// ========================================
// INIZIALIZZAZIONE
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    init();
});

// ========================================
// GESTIONE ERRORI
// ========================================
window.addEventListener('error', function(e) {
    console.error('Errore JavaScript:', e.error);
});
