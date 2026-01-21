// ===========================================
// BIT CORSI - MAIN JAVASCRIPT
// Core functionality e inizializzazione
// ===========================================

/**
 * Sistema di inizializzazione modulare
 */
class BitApp {
    constructor() {
        this.modules = new Map();
        this.initialized = false;
        this.debug = window.location.hostname === 'localhost';
    }

    /**
     * Registra un modulo
     */
    registerModule(name, module) {
        this.modules.set(name, module);
        if (this.debug) {
            console.log(`📦 Modulo registrato: ${name}`);
        }
    }

    /**
     * Inizializza tutti i moduli
     */
    async initialize() {
        if (this.initialized) return;

        try {
            // Inizializza moduli in sequenza
            for (const [name, module] of this.modules) {
                if (typeof module.init === 'function') {
                    await module.init();
                    if (this.debug) {
                        console.log(`✅ Modulo inizializzato: ${name}`);
                    }
                }
            }

            this.initialized = true;
            this.dispatchEvent('app:ready');
            
            if (this.debug) {
                console.log('🎉 BIT App completamente inizializzata');
            }
        } catch (error) {
            console.error('❌ Errore inizializzazione:', error);
            this.dispatchEvent('app:error', { error });
        }
    }

    /**
     * Event system
     */
    dispatchEvent(name, detail = {}) {
        const event = new CustomEvent(name, { detail });
        document.dispatchEvent(event);
    }

    /**
     * Logger per debug
     */
    log(...args) {
        if (this.debug) {
            console.log('[BIT]', ...args);
        }
    }

    error(...args) {
        console.error('[BIT]', ...args);
    }
}

// Istanza globale
window.BIT = new BitApp();

// ===========================================
// MODULO: UI COMPONENTS
// ===========================================
const UIComponents = {
    init() {
        this.initMobileMenu();
        this.initSmoothScroll();
        this.initHeaderEffects();
        this.initBackToTop();
        this.initLazyLoad();
        return Promise.resolve();
    },

    /**
     * Mobile menu con animazioni fluide
     */
    initMobileMenu() {
        const menuToggle = document.querySelector('.menu-toggle');
        const mobileMenu = document.getElementById('mobile-menu');
        const header = document.getElementById('header');
        
        if (!menuToggle || !mobileMenu) return;

        let isOpen = false;

        const toggleMenu = () => {
            isOpen = !isOpen;
            
            // Update aria attributes
            menuToggle.setAttribute('aria-expanded', isOpen);
            mobileMenu.setAttribute('aria-hidden', !isOpen);
            
            // Toggle classes
            mobileMenu.classList.toggle('hidden');
            document.body.classList.toggle('overflow-hidden', isOpen);
            
            // Animate
            if (isOpen) {
                mobileMenu.style.transform = 'translateY(0)';
                mobileMenu.style.opacity = '1';
            } else {
                mobileMenu.style.transform = 'translateY(-20px)';
                mobileMenu.style.opacity = '0';
            }
        };

        // Click handler
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });

        // Close on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isOpen) {
                toggleMenu();
            }
        });

        // Close on click outside
        document.addEventListener('click', (e) => {
            if (isOpen && !mobileMenu.contains(e.target) && !menuToggle.contains(e.target)) {
                toggleMenu();
            }
        });

        // Close on navigation link click
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (isOpen) toggleMenu();
            });
        });

        BIT.log('Mobile menu inizializzato');
    },

    /**
     * Smooth scroll con offset per header fisso
     */
    initSmoothScroll() {
        const headerHeight = document.getElementById('header')?.offsetHeight || 80;
        
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href === '#' || href === '#!') return;
                
                const target = document.querySelector(href);
                if (!target) return;
                
                e.preventDefault();
                
                // Calcola posizione con offset
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = targetPosition - headerHeight;
                
                // Smooth scroll
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL senza scroll
                history.pushState(null, null, href);
            });
        });

        BIT.log('Smooth scroll inizializzato');
    },

    /**
     * Header effects on scroll
     */
    initHeaderEffects() {
        const header = document.getElementById('header');
        if (!header) return;

        let lastScroll = 0;
        const scrollThreshold = 100;

        const handleScroll = () => {
            const currentScroll = window.pageYOffset;
            
            // Aggiungi/rimuovi classe scrolled
            if (currentScroll > 20) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            // Update active nav link
            this.updateActiveNavLink(currentScroll);
            
            lastScroll = currentScroll;
        };

        // Throttle scroll events
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });

        // Initial check
        handleScroll();
        BIT.log('Header effects inizializzati');
    },

    /**
     * Update active navigation link based on scroll position
     */
    updateActiveNavLink(scrollPos) {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    },

    /**
     * Back to top button
     */
    initBackToTop() {
        const button = document.createElement('button');
        button.className = 'fixed bottom-24 right-6 z-40 w-12 h-12 bg-primary-500 text-white rounded-full shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 flex items-center justify-center opacity-0 translate-y-10';
        button.setAttribute('aria-label', 'Torna all\'inizio');
        button.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
            </svg>
        `;
        
        document.body.appendChild(button);
        
        const toggleVisibility = () => {
            if (window.pageYOffset > 300) {
                button.classList.remove('opacity-0', 'translate-y-10');
                button.classList.add('opacity-100', 'translate-y-0');
            } else {
                button.classList.remove('opacity-100', 'translate-y-0');
                button.classList.add('opacity-0', 'translate-y-10');
            }
        };
        
        button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        window.addEventListener('scroll', toggleVisibility);
        toggleVisibility();
        
        BIT.log('Back to top button inizializzato');
    },

    /**
     * Lazy load images with intersection observer
     */
    initLazyLoad() {
        if (!('IntersectionObserver' in window)) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');
                    
                    if (src) {
                        img.src = src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                }
            });
        }, {
            rootMargin: '50px',
            threshold: 0.1
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            observer.observe(img);
        });
        
        BIT.log('Lazy loading inizializzato');
    }
};

// ===========================================
// MODULO: ANIMATIONS
// ===========================================
const Animations = {
    init() {
        this.initScrollAnimations();
        this.init3DEffects();
        this.initCounterAnimation();
        return Promise.resolve();
    },

    /**
     * Scroll-triggered animations
     */
    initScrollAnimations() {
        if (!('IntersectionObserver' in window)) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    // Se ha un delay specificato
                    const delay = entry.target.dataset.animationDelay;
                    if (delay) {
                        entry.target.style.animationDelay = delay;
                    }
                    
                    // Observer disconnesso dopo l'animazione
                    setTimeout(() => {
                        observer.unobserve(entry.target);
                    }, 1000);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        // Elements to animate
        document.querySelectorAll('.tool-card-3d, .course-card, .contact-card').forEach(el => {
            observer.observe(el);
        });
        
        BIT.log('Scroll animations inizializzate');
    },

    /**
     * 3D hover effects
     */
    init3DEffects() {
        const cards = document.querySelectorAll('.tool-card-3d');
        
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                if (window.innerWidth < 768) return;
                
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateY = ((x - centerX) / centerX) * 10;
                const rotateX = ((centerY - y) / centerY) * 5;
                
                card.style.transform = `perspective(1000px) rotateY(${rotateY}deg) rotateX(${rotateX}deg) translateZ(20px)`;
            });
            
            card.addEventListener('mouseleave', () => {
                if (window.innerWidth < 768) return;
                
                card.style.transform = 'perspective(1000px) rotateY(0) rotateX(0) translateZ(0)';
                card.style.transition = 'transform 0.5s ease';
                
                setTimeout(() => {
                    card.style.transition = '';
                }, 500);
            });
        });
        
        BIT.log('3D effects inizializzati');
    },

    /**
     * Animated counters
     */
    initCounterAnimation() {
        const counters = document.querySelectorAll('.counter');
        if (!counters.length) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.getAttribute('data-target'));
                    const duration = 2000;
                    const step = target / (duration / 16);
                    let current = 0;
                    
                    const updateCounter = () => {
                        current += step;
                        if (current < target) {
                            counter.textContent = Math.floor(current);
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.textContent = target;
                        }
                    };
                    
                    updateCounter();
                    observer.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => observer.observe(counter));
        
        BIT.log('Counter animations inizializzate');
    }
};

// ===========================================
// MODULO: FORM WIZARD
// ===========================================
const FormWizard = {
    init() {
        this.currentStep = 1;
        this.totalSteps = 3;
        this.formData = {};
        
        this.initWizard();
        this.initFormValidation();
        return Promise.resolve();
    },

    /**
     * Initialize multi-step form wizard
     */
    initWizard() {
        const wizard = document.querySelector('.form-wizard');
        if (!wizard) return;
        
        // Next step buttons
        wizard.querySelectorAll('[data-next-step]').forEach(button => {
            button.addEventListener('click', (e) => {
                const nextStep = parseInt(e.target.dataset.nextStep);
                if (this.validateStep(this.currentStep)) {
                    this.saveStepData(this.currentStep);
                    this.goToStep(nextStep);
                }
            });
        });
        
        // Previous step buttons
        wizard.querySelectorAll('[data-prev-step]').forEach(button => {
            button.addEventListener('click', (e) => {
                const prevStep = parseInt(e.target.dataset.prevStep);
                this.goToStep(prevStep);
            });
        });
        
        // Form submission
        const form = document.getElementById('iscrizione-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmit();
            });
        }
        
        BIT.log('Form wizard inizializzato');
    },

    /**
     * Navigate to specific step
     */
    goToStep(step) {
        if (step < 1 || step > this.totalSteps) return;
        
        // Hide all steps
        document.querySelectorAll('.form-step').forEach(el => {
            el.classList.remove('active');
        });
        
        // Show target step
        const targetStep = document.querySelector(`.form-step[data-step="${step}"]`);
        if (targetStep) {
            targetStep.classList.add('active');
            
            // Update progress
            this.updateProgress(step);
            this.currentStep = step;
            
            // If last step, show review
            if (step === this.totalSteps) {
                this.showReview();
            }
        }
    },

    /**
     * Update progress bar
     */
    updateProgress(currentStep) {
        const progress = (currentStep - 1) / (this.totalSteps - 1) * 100;
        const progressFill = document.querySelector('.progress-fill');
        if (progressFill) {
            progressFill.style.width = `${progress}%`;
        }
        
        // Update step indicators
        document.querySelectorAll('.progress-step').forEach((stepEl, index) => {
            const stepNumber = index + 1;
            stepEl.classList.remove('active', 'completed');
            
            if (stepNumber === currentStep) {
                stepEl.classList.add('active');
            } else if (stepNumber < currentStep) {
                stepEl.classList.add('completed');
            }
        });
    },

    /**
     * Validate current step
     */
    validateStep(step) {
        const currentForm = document.querySelector(`.form-step[data-step="${step}"]`);
        if (!currentForm) return true;
        
        let isValid = true;
        const inputs = currentForm.querySelectorAll('input[required], select[required]');
        
        inputs.forEach(input => {
            const group = input.closest('.form-group');
            const errorEl = group?.querySelector('.error-message') || this.createErrorElement(group);
            
            if (!input.value.trim()) {
                this.showError(input, 'Questo campo è obbligatorio', errorEl);
                isValid = false;
            } else if (input.type === 'email' && !this.validateEmail(input.value)) {
                this.showError(input, 'Inserisci un\'email valida', errorEl);
                isValid = false;
            } else if (input.type === 'tel' && !this.validatePhone(input.value)) {
                this.showError(input, 'Inserisci un numero di telefono valido', errorEl);
                isValid = false;
            } else {
                this.clearError(input, errorEl);
            }
        });
        
        return isValid;
    },

    /**
     * Create error message element
     */
    createErrorElement(group) {
        const errorEl = document.createElement('div');
        errorEl.className = 'error-message text-error-500 text-sm mt-1';
        group.appendChild(errorEl);
        return errorEl;
    },

    /**
     * Show error message
     */
    showError(input, message, errorEl) {
        input.classList.add('border-error-500');
        errorEl.textContent = message;
        errorEl.classList.remove('hidden');
    },

    /**
     * Clear error
     */
    clearError(input, errorEl) {
        input.classList.remove('border-error-500');
        errorEl.textContent = '';
        errorEl.classList.add('hidden');
    },

    /**
     * Email validation
     */
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    /**
     * Phone validation
     */
    validatePhone(phone) {
        const re = /^[+]?[\d\s\-\(\)]+$/;
        return re.test(phone.replace(/\s/g, ''));
    },

    /**
     * Save step data
     */
    saveStepData(step) {
        const form = document.querySelector(`.form-step[data-step="${step}"]`);
        if (!form) return;
        
        const formData = new FormData(form);
        for (const [key, value] of formData.entries()) {
            if (value.trim()) {
                this.formData[key] = value.trim();
            }
        }
        
        BIT.log(`Step ${step} data saved:`, this.formData);
    },

    /**
     * Show review before submission
     */
    showReview() {
        const reviewContainer = document.getElementById('review-data');
        if (!reviewContainer) return;
        
        const fields = {
            'genitore': 'Genitore',
            'telefono': 'Telefono',
            'studente': 'Partecipante',
            'eta': 'Età',
            'corso': 'Corso scelto',
            'fonte': 'Come ci hai conosciuto',
            'email': 'Email',
            'scuola': 'Scuola frequentata',
            'note': 'Note'
        };
        
        let html = '';
        for (const [key, label] of Object.entries(fields)) {
            if (this.formData[key]) {
                html += `
                    <div class="flex justify-between py-2 border-b border-white/10">
                        <span class="text-neutral-300">${label}:</span>
                        <span class="font-semibold">${this.formData[key]}</span>
                    </div>
                `;
            }
        }
        
        reviewContainer.innerHTML = html || '<p class="text-center py-4">Nessun dato da mostrare</p>';
    },

    /**
     * Handle form submission
     */
    async handleFormSubmit() {
        const submitBtn = document.querySelector('.form-step[data-step="3"] button[type="submit"]');
        const originalText = submitBtn?.textContent;
        
        try {
            // Show loading state
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = `
                    <svg class="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Invio in corso...
                `;
            }
            
            // Prepare data for FormSubmit
            const formData = new FormData();
            Object.entries(this.formData).forEach(([key, value]) => {
                formData.append(key, value);
            });
            
            // Additional hidden fields
            formData.append('_subject', 'BIT - Nuova iscrizione dal sito');
            formData.append('_captcha', 'false');
            formData.append('_template', 'table');
            formData.append('_autoresponse', 'yes');
            
            // Send to FormSubmit
            const response = await fetch('https://formsubmit.co/bitcorsi@gmail.com', {
                method: 'POST',
                body: formData
            });
            
            if (response.ok) {
                this.showSuccess();
                BIT.log('Form submitted successfully');
            } else {
                throw new Error('Form submission failed');
            }
            
        } catch (error) {
            console.error('Form submission error:', error);
            this.showError('Si è verificato un errore. Riprova più tardi o contattaci direttamente.');
            
            // Restore button
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        }
    },

    /**
     * Show success message
     */
    showSuccess() {
        // Hide form wizard
        document.querySelector('.wizard-body')?.classList.add('hidden');
        
        // Show success message
        const successEl = document.getElementById('form-success');
        if (successEl) {
            successEl.classList.remove('hidden');
            
            // Reset form button
            successEl.querySelector('[data-reset-form]').addEventListener('click', () => {
                this.resetForm();
            });
            
            // Confetti animation
            this.fireConfetti();
        }
    },

    /**
     * Show error message
     */
    showError(message) {
        // Create error toast
        const toast = document.createElement('div');
        toast.className = 'fixed top-6 right-6 bg-error-500 text-white px-6 py-3 rounded-lg shadow-xl z-50 animate-slide-in';
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        // Remove after 5 seconds
        setTimeout(() => {
            toast.classList.add('animate-slide-out');
            setTimeout(() => toast.remove(), 300);
        }, 5000);
    },

    /**
     * Reset form
     */
    resetForm() {
        // Reset form data
        this.formData = {};
        this.currentStep = 1;
        
        // Reset all form inputs
        document.querySelectorAll('.form-step input, .form-step select, .form-step textarea').forEach(input => {
            input.value = '';
        });
        
        // Hide success message
        document.getElementById('form-success')?.classList.add('hidden');
        
        // Show wizard body
        document.querySelector('.wizard-body')?.classList.remove('hidden');
        
        // Go to first step
        this.goToStep(1);
    },

    /**
     * Confetti animation
     */
    fireConfetti() {
        if (typeof confetti !== 'function') return;
        
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    },

    /**
     * Initialize form validation
     */
    initFormValidation() {
        // Real-time validation
        document.querySelectorAll('.form-control').forEach(input => {
            input.addEventListener('blur', () => {
                if (input.hasAttribute('required') && input.value.trim()) {
                    if (input.type === 'email' && !this.validateEmail(input.value)) {
                        input.classList.add('border-error-500');
                    } else if (input.type === 'tel' && !this.validatePhone(input.value)) {
                        input.classList.add('border-error-500');
                    } else {
                        input.classList.remove('border-error-500');
                    }
                }
            });
        });
        
        BIT.log('Form validation inizializzato');
    }
};

// ===========================================
// MODULO: COURSES LOADER
// ===========================================
const CoursesLoader = {
    init() {
        this.loadCourses();
        this.initFilter();
        this.initPromo();
        return Promise.resolve();
    },

    /**
     * Load courses from JSON
     */
    async loadCourses() {
        const container = document.getElementById('courses-container');
        if (!container) return;
        
        try {
            // Show loading state
            container.innerHTML = this.createLoadingTemplate();
            
            // Fetch courses data
            const response = await fetch('data/courses.json?' + Date.now());
            if (!response.ok) throw new Error('Failed to load courses');
            
            const data = await response.json();
            
            // Render courses
            this.renderCourses(data.corsi);
            
            // Update promo if available
            if (data.promoNatale?.attiva) {
                this.renderPromo(data.promoNatale);
            }
            
            BIT.log('Courses loaded successfully');
            
        } catch (error) {
            console.error('Error loading courses:', error);
            this.showErrorState();
        }
    },

    /**
     * Create loading template
     */
    createLoadingTemplate() {
        return `
            <div class="card text-center py-12">
                <div class="animate-spin w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-6"></div>
                <p class="text-lg font-semibold">Caricamento corsi...</p>
                <p class="text-neutral-600 mt-2">Stiamo recuperando le informazioni più aggiornate</p>
            </div>
        `;
    },

    /**
     * Show error state
     */
    showErrorState() {
        const container = document.getElementById('courses-container');
        if (!container) return;
        
        container.innerHTML = `
            <div class="card border-error-500 border-2">
                <div class="text-center py-8">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-error-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 class="text-xl font-semibold mb-2">Errore di caricamento</h3>
                    <p class="text-neutral-600 mb-4">Impossibile caricare l'elenco dei corsi.</p>
                    <button onclick="CoursesLoader.loadCourses()" class="btn btn-primary">
                        Riprova
                    </button>
                </div>
            </div>
        `;
    },

    /**
     * Render courses to DOM
     */
    renderCourses(courses) {
        const container = document.getElementById('courses-container');
        if (!container) return;
        
        if (!courses || courses.length === 0) {
            container.innerHTML = `
                <div class="card text-center py-12">
                    <p class="text-lg font-semibold">Nessun corso disponibile al momento</p>
                    <p class="text-neutral-600 mt-2">Controlla più tardi o contattaci per informazioni</p>
                </div>
            `;
            return;
        }
        
        const coursesHtml = courses.map(course => this.createCourseCard(course)).join('');
        container.innerHTML = coursesHtml;
        
        // Initialize availability indicators
        this.initAvailabilityIndicators();
    },

    /**
     * Create course card HTML
     */
    createCourseCard(course) {
        const isAvailable = course.stato === 'aperto';
        const isFeatured = course.featured;
        const availabilityClass = this.getAvailabilityClass(course.disponibilita);
        
        return `
            <div class="course-card ${isFeatured ? 'course-card-featured' : ''}" 
                 data-level="${course.livello}"
                 data-available="${isAvailable}">
                <div class="card">
                    ${course.badge ? `
                        <div class="badge ${isAvailable ? 'badge-success' : 'badge-warning'} absolute top-4 right-4">
                            ${course.badge}
                        </div>
                    ` : ''}
                    
                    <h3 class="heading-4 mb-3">${course.nome}</h3>
                    
                    <div class="course-meta flex flex-wrap gap-2 mb-4">
                        <span class="badge badge-neutral">${course.eta}</span>
                        <span class="badge badge-neutral">${course.incontri}</span>
                        <span class="badge badge-primary">${course.prezzo}</span>
                    </div>
                    
                    <div class="card-body mb-6">
                        <p class="text-body mb-4">${course.descrizione}</p>
                        
                        <div class="space-y-2">
                            <div class="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span class="text-sm">${course.quando}</span>
                            </div>
                            
                            ${course.durata ? `
                                <div class="flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span class="text-sm">${course.durata}</span>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                    
                    <div class="card-footer flex items-center justify-between">
                        <div class="availability ${availabilityClass}">
                            <span class="availability-dot"></span>
                            ${this.getAvailabilityText(course.disponibilita)}
                        </div>
                        
                        ${isAvailable ? `
                            <a href="#contatti" class="btn btn-primary btn-sm" data-course="${course.nome}">
                                Iscriviti ora
                            </a>
                        ` : `
                            <button class="btn btn-secondary btn-sm" disabled>
                                Corso al completo
                            </button>
                        `}
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Get availability CSS class
     */
    getAvailabilityClass(availability) {
        switch (availability) {
            case 'high': return 'availability-high';
            case 'low': return 'availability-low';
            case 'none': return 'availability-none';
            default: return 'availability-high';
        }
    },

    /**
     * Get availability text
     */
    getAvailabilityText(availability) {
        switch (availability) {
            case 'high': return 'Posti disponibili';
            case 'low': return 'Ultimi posti';
            case 'none': return 'Esaurito';
            default: return 'Disponibile';
        }
    },

    /**
     * Initialize availability indicators
     */
    initAvailabilityIndicators() {
        document.querySelectorAll('.availability').forEach(availability => {
            const dot = availability.querySelector('.availability-dot');
            if (availability.classList.contains('availability-high')) {
                dot.style.animation = 'pulse 2s infinite';
            }
        });
    },

    /**
     * Initialize course filter
     */
    initFilter() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const coursesContainer = document.getElementById('courses-container');
        
        if (!filterButtons.length || !coursesContainer) return;
        
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Get filter criteria
                const filter = button.dataset.filter;
                
                // Filter courses
                this.filterCourses(filter);
            });
        });
        
        BIT.log('Course filter inizializzato');
    },

    /**
     * Filter courses based on criteria
     */
    filterCourses(filter) {
        const courseCards = document.querySelectorAll('.course-card');
        
        courseCards.forEach(card => {
            let shouldShow = true;
            
            switch (filter) {
                case 'beginner':
                    shouldShow = card.dataset.level === 'beginner';
                    break;
                case 'intermediate':
                    shouldShow = card.dataset.level === 'intermediate';
                    break;
                case 'advanced':
                    shouldShow = card.dataset.level === 'advanced';
                    break;
                case 'available':
                    shouldShow = card.dataset.available === 'true';
                    break;
                // 'all' shows everything
            }
            
            if (shouldShow) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 10);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    },

    /**
     * Initialize promo banner
     */
    initPromo() {
        // Check if promo should be shown based on date
        const today = new Date();
        const promoStart = new Date(today.getFullYear(), 10, 1); // Nov 1
        const promoEnd = new Date(today.getFullYear(), 11, 31); // Dec 31
        
        if (today >= promoStart && today <= promoEnd) {
            // Promo season - banner will be loaded from JSON
            BIT.log('Promo season active');
        }
    },

    /**
     * Render promo banner
     */
    renderPromo(promoData) {
        const container = document.getElementById('promo-container');
        if (!container || !promoData) return;
        
        container.innerHTML = `
            <div class="promo-banner card bg-gradient-to-r from-primary-500 to-primary-700 text-white">
                <div class="flex flex-col md:flex-row items-center gap-6">
                    <div class="promo-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                        </svg>
                    </div>
                    
                    <div class="flex-1">
                        <div class="badge badge-warning mb-2">${promoData.badge || 'EDIZIONE SPECIALE'}</div>
                        <h3 class="heading-4 mb-2">${promoData.titolo}</h3>
                        <p class="mb-4">${promoData.descrizione}</p>
                        
                        <div class="flex flex-wrap gap-4 mb-4">
                            <div class="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span>${promoData.date}</span>
                            </div>
                            
                            <div class="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>${promoData.eta}</span>
                            </div>
                            
                            <div class="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>${promoData.prezzo}</span>
                            </div>
                        </div>
                        
                        <p class="text-sm opacity-90 mb-4">${promoData.posti}</p>
                        
                        <a href="#contatti" class="btn btn-white">
                            ${promoData.cta || 'Iscriviti ora'}
                        </a>
                    </div>
                </div>
            </div>
        `;
    }
};

// ===========================================
// MODULO: ANALYTICS & OPTIMIZATION
// ===========================================
const Analytics = {
    init() {
        this.initPerformanceMonitoring();
        this.initErrorTracking();
        this.initFormAnalytics();
        return Promise.resolve();
    },

    /**
     * Monitor performance metrics
     */
    initPerformanceMonitoring() {
        // Monitor Core Web Vitals
        if ('PerformanceObserver' in window) {
            try {
                // LCP (Largest Contentful Paint)
                const lcpObserver = new PerformanceObserver((entryList) => {
                    const entries = entryList.getEntries();
                    const lastEntry = entries[entries.length - 1];
                    
                    BIT.log('LCP:', lastEntry.startTime);
                    this.trackMetric('lcp', lastEntry.startTime);
                });
                
                lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
                
                // FID (First Input Delay)
                const fidObserver = new PerformanceObserver((entryList) => {
                    const entries = entryList.getEntries();
                    entries.forEach(entry => {
                        BIT.log('FID:', entry.processingStart - entry.startTime);
                        this.trackMetric('fid', entry.processingStart - entry.startTime);
                    });
                });
                
                fidObserver.observe({ entryTypes: ['first-input'] });
                
                // CLS (Cumulative Layout Shift)
                let clsValue = 0;
                let clsEntries = [];
                
                const clsObserver = new PerformanceObserver((entryList) => {
                    for (const entry of entryList.getEntries()) {
                        if (!entry.hadRecentInput) {
                            clsValue += entry.value;
                            clsEntries.push(entry);
                        }
                    }
                });
                
                clsObserver.observe({ entryTypes: ['layout-shift'] });
                
                // Report CLS on page hide
                document.addEventListener('visibilitychange', () => {
                    if (document.visibilityState === 'hidden') {
                        BIT.log('CLS:', clsValue);
                        this.trackMetric('cls', clsValue);
                        
                        // Send to analytics
                        clsObserver.disconnect();
                    }
                });
                
            } catch (e) {
                BIT.error('Performance monitoring failed:', e);
            }
        }
    },

    /**
     * Track custom metric
     */
    trackMetric(name, value) {
        // Store in localStorage for later analysis
        const metrics = JSON.parse(localStorage.getItem('bit_metrics') || '{}');
        metrics[name] = metrics[name] || [];
        metrics[name].push({
            value,
            timestamp: Date.now(),
            url: window.location.pathname
        });
        
        localStorage.setItem('bit_metrics', JSON.stringify(metrics));
    },

    /**
     * Error tracking
     */
    initErrorTracking() {
        // Global error handler
        window.addEventListener('error', (event) => {
            this.trackError({
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                error: event.error?.stack
            });
        });
        
        // Unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            this.trackError({
                type: 'unhandledrejection',
                reason: event.reason?.toString(),
                stack: event.reason?.stack
            });
        });
    },

    /**
     * Track error
     */
    trackError(error) {
        const errors = JSON.parse(localStorage.getItem('bit_errors') || '[]');
        errors.push({
            ...error,
            timestamp: Date.now(),
            userAgent: navigator.userAgent,
            url: window.location.href
        });
        
        localStorage.setItem('bit_errors', JSON.stringify(errors.slice(-50))); // Keep last 50 errors
        
        BIT.error('Error tracked:', error);
    },

    /**
     * Form analytics
     */
    initFormAnalytics() {
        document.addEventListener('app:ready', () => {
            // Track form interactions
            document.querySelectorAll('form').forEach(form => {
                form.addEventListener('submit', () => {
                    this.trackEvent('form_submit', {
                        form_id: form.id,
                        form_action: form.action
                    });
                });
            });
            
            // Track CTA clicks
            document.querySelectorAll('.btn-primary, .btn-outline').forEach(button => {
                button.addEventListener('click', () => {
                    this.trackEvent('cta_click', {
                        text: button.textContent.trim(),
                        href: button.getAttribute('href') || button.getAttribute('data-href')
                    });
                });
            });
            
            // Track tool card interactions
            document.querySelectorAll('.tool-card-3d').forEach(card => {
                card.addEventListener('click', () => {
                    const title = card.querySelector('h3')?.textContent;
                    this.trackEvent('tool_click', { tool: title });
                });
            });
        });
    },

    /**
     * Track custom event
     */
    trackEvent(name, data = {}) {
        const events = JSON.parse(localStorage.getItem('bit_events') || '[]');
        events.push({
            name,
            data,
            timestamp: Date.now(),
            url: window.location.pathname
        });
        
        localStorage.setItem('bit_events', JSON.stringify(events.slice(-100))); // Keep last 100 events
        
        BIT.log(`Event tracked: ${name}`, data);
    }
};

// ===========================================
// INIZIALIZZAZIONE APP
// ===========================================
document.addEventListener('DOMContentLoaded', () => {
    // Registra tutti i moduli
    BIT.registerModule('ui', UIComponents);
    BIT.registerModule('animations', Animations);
    BIT.registerModule('form', FormWizard);
    BIT.registerModule('courses', CoursesLoader);
    BIT.registerModule('analytics', Analytics);
    
    // Inizializza l'app
    BIT.initialize();
    
    // Service Worker registration (solo in produzione)
    if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js').catch(error => {
                BIT.error('Service Worker registration failed:', error);
            });
        });
    }
    
    // Gestione offline
    window.addEventListener('offline', () => {
        BIT.dispatchEvent('app:offline');
        BIT.log('App is offline');
    });
    
    window.addEventListener('online', () => {
        BIT.dispatchEvent('app:online');
        BIT.log('App is online');
    });
});

// ===========================================
// UTILITY FUNCTIONS (globali)
// ===========================================
window.debounce = function(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

window.throttle = function(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

// ===========================================
// ERROR BOUNDARY
// ===========================================
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    
    // Mostra un messaggio user-friendly per errori critici
    if (event.error.message.includes('Critical') || event.error.message.includes('Syntax')) {
        const errorOverlay = document.createElement('div');
        errorOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.8);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            padding: 20px;
            text-align: center;
        `;
        
        errorOverlay.innerHTML = `
            <div>
                <h2 style="font-size: 24px; margin-bottom: 20px;">⚠️ Si è verificato un errore</h2>
                <p style="margin-bottom: 20px;">La pagina potrebbe non funzionare correttamente.</p>
                <button onclick="location.reload()" style="
                    background: #FF6B35;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 8px;
                    cursor: pointer;
                ">
                    Ricarica la pagina
                </button>
            </div>
        `;
        
        document.body.appendChild(errorOverlay);
    }
});

// ===========================================
// READY STATE
// ===========================================
document.addEventListener('app:ready', () => {
    // Aggiungi classe loaded al body per transizioni
    document.body.classList.add('loaded');
    
    // Log per debug
    BIT.log('Tutto pronto!');
});

// ===========================================
// EXPORT PER TESTING
// ===========================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        BitApp,
        UIComponents,
        Animations,
        FormWizard,
        CoursesLoader,
        Analytics
    };
}
