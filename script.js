// ========================================
// APP PRINCIPALE - BIT CORSI
// ========================================
class BitCorsiApp {
    constructor() {
        this.init();
    }

    init() {
        console.log('🚀 Bit Corsi - Robotica Educativa');

        this.handleHeaderScroll();
        this.handleFAQ();
        this.optimizePerformance();
        this.handleQuickContacts();
        this.handleMobileMenuOverlay();
        this.initContactForm();
        this.initSmoothScroll();
    }

    // ========================================
    // HEADER SCROLL
    // ========================================
    handleHeaderScroll() {
        let lastScrollY = window.scrollY;
        const header = document.querySelector('.header');

        const updateHeader = () => {
            const currentScrollY = window.scrollY;
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.backdropFilter = 'blur(12px)';
            lastScrollY = currentScrollY;
        };

        let ticking = false;
        const throttledUpdate = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    updateHeader();
                    ticking = false;
                });
                ticking = true;
            }
        };
        window.addEventListener('scroll', throttledUpdate, { passive: true });
    }

    // ========================================
    // FAQ ACCORDION
    // ========================================
    handleFAQ() {
        const faqItems = document.querySelectorAll('details');
        faqItems.forEach(item => {
            item.addEventListener('toggle', () => {
                if (item.open) {
                    faqItems.forEach(otherItem => {
                        if (otherItem !== item && otherItem.open) otherItem.open = false;
                    });
                }
            });
        });
    }

    // ========================================
    // PERFORMANCE OPTIMIZATION
    // ========================================
    optimizePerformance() {
        if ('IntersectionObserver' in window) {
            const lazyImages = document.querySelectorAll('img[loading="lazy"]');
            const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        observer.unobserve(entry.target);
                    }
                });
            });
            lazyImages.forEach(img => observer.observe(img));
        }
    }

    // ========================================
    // QUICK CONTACTS
    // ========================================
    handleQuickContacts() {
        const links = document.querySelectorAll('a[href*="wa.me"], a[href*="tel:"], a[href*="mailto:"]');
        links.forEach(link => {
            link.addEventListener('click', () => {
                const type = link.href.includes('wa.me') ? 'whatsapp' :
                             link.href.includes('tel:') ? 'phone' : 'email';
                console.log(`📞 Contatto via ${type}`);
            });
        });
    }

    // ========================================
    // MOBILE MENU OVERLAY
    // ========================================
    handleMobileMenuOverlay() {
        const toggle = document.querySelector('.menu-toggle');
        const overlay = document.querySelector('.nav-overlay');
        const links = document.querySelectorAll('.nav-overlay a');

        if (!toggle || !overlay) return;

        toggle.addEventListener('click', () => {
            const isOpen = overlay.classList.toggle('active');
            toggle.classList.toggle('open', isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        links.forEach(link => {
            link.addEventListener('click', () => {
                overlay.classList.remove('active');
                toggle.classList.remove('open');
                document.body.style.overflow = '';
            });
        });

        // Chiudi menu con ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && overlay.classList.contains('active')) {
                overlay.classList.remove('active');
                toggle.classList.remove('open');
                document.body.style.overflow = '';
            }
        });
    }

    // ========================================
    // FORM CONTATTI CON FORMSUBMIT
    // ========================================
    initContactForm() {
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

    // ========================================
    // FORM ISCRIZIONE RAPIDO (sezione corsi)
    // ========================================
    initQuickForm() {
        const quickForm = document.getElementById('quickForm');
        const quickSuccessMsg = document.getElementById('quickFormSuccess');
        
        if (!quickForm) return;

        quickForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;

            submitBtn.textContent = 'Invio in corso...';
            submitBtn.disabled = true;

            try {
                // Simula invio (sostituisci con fetch() se hai un endpoint)
                await new Promise(resolve => setTimeout(resolve, 1500));

                // Reset del form
                this.reset();

                // Mostra messaggio di successo
                if (quickSuccessMsg) {
                    quickSuccessMsg.classList.add('visible');
                    setTimeout(() => {
                        quickSuccessMsg.classList.remove('visible');
                    }, 5000);
                }

            } catch (error) {
                console.error('Errore durante l’invio:', error);
                if (quickSuccessMsg) {
                    quickSuccessMsg.textContent = '❌ Errore durante l’invio. Riprova più tardi.';
                    quickSuccessMsg.classList.add('visible');
                }
            }

            // Ripristina bottone
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
    }

    // ========================================
    // SMOOTH SCROLL
    // ========================================
    initSmoothScroll() {
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
    // ANIMAZIONI SCROLL
    // ========================================
    initScrollAnimations() {
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

    // ========================================
    // TOOLTIP FLOATING BUTTONS
    // ========================================
    initTooltip() {
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
}

// ========================================
// INIZIALIZZAZIONE APP
// ========================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new BitCorsiApp());
} else {
    new BitCorsiApp();
}

// ========================================
// GESTIONE ERRORI GLOBALE
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

// ========================================
// ACCESSIBILITÀ
// ========================================
// Focus visible per tastiera
document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-navigation');
});

// ========================================
// UTILITY FUNCTIONS
// ========================================
function debounce(func, wait) {
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

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// ========================================
// POLYFILLS (per browser vecchi)
// ========================================
// NodeList.forEach polyfill
if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = Array.prototype.forEach;
}

// Element.closest polyfill
if (!Element.prototype.closest) {
    Element.prototype.closest = function(s) {
        var el = this;
        if (!document.documentElement.contains(el)) return null;
        do {
            if (el.matches(s)) return el;
            el = el.parentElement || el.parentNode;
        } while (el !== null && el.nodeType === 1);
        return null;
    };
}

// Element.matches polyfill
if (!Element.prototype.matches) {
    Element.prototype.matches = 
        Element.prototype.matchesSelector || 
        Element.prototype.mozMatchesSelector ||
        Element.prototype.msMatchesSelector || 
        Element.prototype.oMatchesSelector || 
        Element.prototype.webkitMatchesSelector ||
        function(s) {
            var matches = (this.document || this.ownerDocument).querySelectorAll(s),
                i = matches.length;
            while (--i >= 0 && matches.item(i) !== this) {}
            return i > -1;            
        };
}
