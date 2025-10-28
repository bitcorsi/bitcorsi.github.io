// script.js - Ottimizzato con menu mobile overlay
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
        this.handleMobileMenuOverlay(); // 👈 nuova funzione
    }

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

    // 👇 Nuova funzione: menu mobile overlay
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
    }
}

// Inizializzazione
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new BitCorsiApp());
} else {
    new BitCorsiApp();
}
