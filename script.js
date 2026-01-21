// ===========================================
// BIT CORSI - JavaScript Completo & Ottimizzato
// ===========================================


// 📦 VARIABILI GLOBALI
const DOM = {
    body: document.body,
    html: document.documentElement,
    // Menu mobile
    menuToggle: document.querySelector('.menu-toggle'),
    mobileMenu: document.querySelector('.mobile-menu'),
    // Timeline età
    timelinePoints: document.querySelectorAll('.timeline-point'),
    // Form a step
    registrationSteps: document.querySelectorAll('.registration-step'),
    // FAQ
    faqDetails: document.querySelectorAll('details'),
    // Corsi
    coursesContainer: document.getElementById('courses-container'),
    // Promo
    promoContainer: document.getElementById('promo-natale-container')
};

// 🎛️ CONFIGURAZIONE
const CONFIG = {
    formSubmitUrl: 'https://formsubmit.co/bitcorsi@gmail.com',
    whatsappNumber: '393703069215',
    phoneNumber: '+393703069215',
    email: 'bitcorsi@gmail.com',
    instagramUrl: 'https://www.instagram.com/bit_corsi/'
};


// ===========================================
// 1. INITIALIZATION - Inizializza tutto
// ===========================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 BIT CORSI - Inizializzazione');
    
    initMobileMenu();
    initTimeline();
    initFAQ();
    initRegistrationForm();
    loadCourses();
    initScrollEffects();
    initWhatsAppFAB();
    initPrintButton();
    
    // Mostra notifica di caricamento
    showNotification('Sito caricato con successo!', 'success');
});


// ===========================================
// 2. MOBILE MENU - Gestione completa
// ===========================================
function initMobileMenu() {
    if (!DOM.menuToggle) return;
    
    let isOpen = false;
    
    DOM.menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMobileMenu();
    });
    
    // Chiudi menu cliccando fuori
    document.addEventListener('click', (e) => {
        if (isOpen && !DOM.mobileMenu.contains(e.target) && e.target !== DOM.menuToggle) {
            closeMobileMenu();
        }
    });
    
    // Chiudi menu con ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isOpen) {
            closeMobileMenu();
        }
    });
    
    // Gestione link nel menu mobile
    const mobileLinks = DOM.mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });
    
    function toggleMobileMenu() {
        isOpen = !isOpen;
        
        if (isOpen) {
            DOM.mobileMenu.classList.add('active');
            DOM.menuToggle.classList.add('active');
            DOM.body.style.overflow = 'hidden';
            DOM.menuToggle.setAttribute('aria-expanded', 'true');
            DOM.mobileMenu.setAttribute('aria-hidden', 'false');
        } else {
            closeMobileMenu();
        }
    }
    
    function closeMobileMenu() {
        isOpen = false;
        DOM.mobileMenu.classList.remove('active');
        DOM.menuToggle.classList.remove('active');
        DOM.body.style.overflow = '';
        DOM.menuToggle.setAttribute('aria-expanded', 'false');
        DOM.mobileMenu.setAttribute('aria-hidden', 'true');
    }
}


// ===========================================
// 3. TIMELINE INTERATTIVA - Per età
// ===========================================
function initTimeline() {
    if (!DOM.timelinePoints.length) return;
    
    DOM.timelinePoints.forEach(point => {
        point.addEventListener('click', () => {
            const age = point.dataset.age;
            selectTimelinePoint(age);
            filterCoursesByAge(age);
        });
        
        point.addEventListener('mouseenter', () => {
            if (!point.classList.contains('active')) {
                point.classList.add('hover');
            }
        });
        
        point.addEventListener('mouseleave', () => {
            point.classList.remove('hover');
        });
    });
    
    // Seleziona automaticamente 12-13 anni (target principale)
    setTimeout(() => {
        selectTimelinePoint('12-13');
    }, 1000);
}

function selectTimelinePoint(age) {
    DOM.timelinePoints.forEach(point => {
        point.classList.remove('active', 'hover');
        if (point.dataset.age === age) {
            point.classList.add('active');
            
            // Animazione del punto
            const dot = point.querySelector('.point');
            dot.style.animation = 'none';
            setTimeout(() => {
                dot.style.animation = 'pulse 1s ease';
            }, 10);
        }
    });
}


// ===========================================
// 4. FAQ INTERATTIVE - Accordion avanzato
// ===========================================
function initFAQ() {
    if (!DOM.faqDetails.length) return;
    
    DOM.faqDetails.forEach(details => {
        details.addEventListener('toggle', () => {
            if (details.open) {
                // Chiudi altri dettagli nella stessa categoria
                const category = details.closest('.faq-category');
                if (category) {
                    const otherDetails = category.querySelectorAll('details');
                    otherDetails.forEach(other => {
                        if (other !== details && other.open) {
                            other.open = false;
                        }
                    });
                }
                
                // Animazione di apertura
                const content = details.querySelector('p');
                if (content) {
                    content.style.animation = 'fadeInUp 0.3s ease-out';
                }
            }
        });
    });
    
    // Aggiungi ricerca FAQ (feature avanzata)
    createFAQSearch();
}

function createFAQSearch() {
    const faqSection = document.querySelector('.faq-section');
    if (!faqSection) return;
    
    const searchContainer = document.createElement('div');
    searchContainer.className = 'faq-search';
    searchContainer.innerHTML = `
        <div class="search-box">
            <i class="fas fa-search"></i>
            <input type="text" placeholder="Cerca nelle FAQ..." id="faq-search">
            <button class="clear-search" aria-label="Pulisci ricerca">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="search-results"></div>
    `;
    
    faqSection.insertBefore(searchContainer, faqSection.querySelector('.faq-grid'));
    
    const searchInput = document.getElementById('faq-search');
    const clearButton = searchContainer.querySelector('.clear-search');
    const resultsContainer = searchContainer.querySelector('.search-results');
    
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        
        if (query.length < 2) {
            resultsContainer.innerHTML = '';
            resultsContainer.style.display = 'none';
            DOM.faqDetails.forEach(details => {
                details.style.display = 'block';
            });
            return;
        }
        
        searchFAQ(query);
    });
    
    clearButton.addEventListener('click', () => {
        searchInput.value = '';
        searchInput.focus();
        resultsContainer.innerHTML = '';
        resultsContainer.style.display = 'none';
        DOM.faqDetails.forEach(details => {
            details.style.display = 'block';
        });
    });
}

function searchFAQ(query) {
    const results = [];
    const resultsContainer = document.querySelector('.search-results');
    
    DOM.faqDetails.forEach(details => {
        const question = details.querySelector('summary').textContent.toLowerCase();
        const answer = details.querySelector('p').textContent.toLowerCase();
        const category = details.closest('.faq-category').querySelector('h3').textContent.toLowerCase();
        
        if (question.includes(query) || answer.includes(query) || category.includes(query)) {
            results.push({
                element: details,
                question: details.querySelector('summary').textContent,
                answer: details.querySelector('p').textContent.substring(0, 100) + '...',
                category: details.closest('.faq-category').querySelector('h3').textContent
            });
            details.style.display = 'block';
        } else {
            details.style.display = 'none';
        }
    });
    
    if (results.length > 0) {
        resultsContainer.innerHTML = `
            <p class="results-count">${results.length} risultati trovati</p>
            ${results.map(result => `
                <div class="result-item">
                    <h4>${result.question}</h4>
                    <p class="result-category">${result.category}</p>
                    <p class="result-answer">${result.answer}</p>
                </div>
            `).join('')}
        `;
        resultsContainer.style.display = 'block';
    } else {
        resultsContainer.innerHTML = `
            <p class="no-results">Nessun risultato trovato per "${query}"</p>
        `;
        resultsContainer.style.display = 'block';
    }
}


// ===========================================
// 5. FORM DI ISCRIZIONE - Multi-step avanzato
// ===========================================
function initRegistrationForm() {
    const form = document.getElementById('simple-registration');
    if (!form) return;
    
    const steps = form.querySelectorAll('.form-step');
    const nextButtons = form.querySelectorAll('.btn-next');
    const backButtons = form.querySelectorAll('.btn-back');
    const submitButton = form.querySelector('.btn-submit');
    const progressSteps = document.querySelectorAll('.registration-steps .step');
    
    let currentStep = 0;
    const formData = {
        parent: {},
        child: {},
        course: null
    };
    
    // Inizializza i passi
    showStep(0);
    
    // Gestione pulsanti Avanti
    nextButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (validateStep(currentStep)) {
                saveStepData(currentStep);
                if (currentStep < steps.length - 1) {
                    currentStep++;
                    showStep(currentStep);
                    updateProgressBar();
                }
            }
        });
    });
    
    // Gestione pulsanti Indietro
    backButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (currentStep > 0) {
                currentStep--;
                showStep(currentStep);
                updateProgressBar();
            }
        });
    });
    
    // Gestione selezione corso
    const courseOptions = form.querySelectorAll('.course-option');
    courseOptions.forEach(option => {
        option.addEventListener('click', () => {
            courseOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            formData.course = option.dataset.course;
            
            // Aggiorna riepilogo
            updateSummary();
        });
    });
    
    // Gestione submit
    if (submitButton) {
        submitButton.addEventListener('click', async (e) => {
            e.preventDefault();
            
            if (validateStep(currentStep)) {
                saveStepData(currentStep);
                
                if (!formData.course) {
                    showNotification('Seleziona un corso prima di procedere', 'error');
                    return;
                }
                
                try {
                    await submitForm();
                } catch (error) {
                    console.error('Errore invio form:', error);
                    showNotification('Errore nell\'invio. Riprova più tardi.', 'error');
                }
            }
        });
    }
    
    // Funzioni helper
    function showStep(stepIndex) {
        steps.forEach((step, index) => {
            step.classList.toggle('active', index === stepIndex);
        });
    }
    
    function validateStep(stepIndex) {
        const currentStepElement = steps[stepIndex];
        const inputs = currentStepElement.querySelectorAll('input[required], select[required]');
        
        let isValid = true;
        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                highlightError(input);
            } else {
                removeError(input);
                
                // Validazioni specifiche
                if (input.type === 'email') {
                    if (!isValidEmail(input.value)) {
                        isValid = false;
                        highlightError(input, 'Email non valida');
                    }
                }
                
                if (input.type === 'tel') {
                    if (!isValidPhone(input.value)) {
                        isValid = false;
                        highlightError(input, 'Numero di telefono non valido');
                    }
                }
            }
        });
        
        if (!isValid) {
            showNotification('Compila tutti i campi obbligatori', 'error');
        }
        
        return isValid;
    }
    
    function saveStepData(stepIndex) {
        const currentStepElement = steps[stepIndex];
        const inputs = currentStepElement.querySelectorAll('input, select');
        
        inputs.forEach(input => {
            const name = input.id || input.name;
            const value = input.value.trim();
            
            if (name && value) {
                if (name.includes('parent')) {
                    formData.parent[name.replace('parent-', '')] = value;
                } else if (name.includes('child')) {
                    formData.child[name.replace('child-', '')] = value;
                }
            }
        });
    }
    
    function updateProgressBar() {
        progressSteps.forEach((step, index) => {
            step.classList.remove('active');
            if (index <= currentStep) {
                step.classList.add('active');
            }
        });
    }
    
    function updateSummary() {
        const summaryBox = form.querySelector('.summary-box');
        if (!summaryBox) return;
        
        const courseName = getCourseName(formData.course);
        
        summaryBox.innerHTML = `
            <div class="summary-content">
                <h4>Riepilogo Iscrizione</h4>
                <div class="summary-item">
                    <strong>Genitore:</strong> ${formData.parent.name || 'Non specificato'}
                </div>
                <div class="summary-item">
                    <strong>Telefono:</strong> ${formData.parent.phone || 'Non specificato'}
                </div>
                <div class="summary-item">
                    <strong>Bambino/Ragazzo:</strong> ${formData.child.name || 'Non specificato'}
                </div>
                <div class="summary-item">
                    <strong>Età:</strong> ${formData.child.age || 'Non specificato'} anni
                </div>
                <div class="summary-item">
                    <strong>Corso selezionato:</strong> ${courseName}
                </div>
            </div>
        `;
    }
    
    async function submitForm() {
        // Mostra loading
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Invio in corso...';
        submitButton.disabled = true;
        
        // Prepara dati per FormSubmit
        const formDataToSend = new FormData();
        
        // Aggiungi dati del form
        Object.entries(formData.parent).forEach(([key, value]) => {
            formDataToSend.append(`Genitore ${key}`, value);
        });
        
        Object.entries(formData.child).forEach(([key, value]) => {
            formDataToSend.append(`Bambino ${key}`, value);
        });
        
        formDataToSend.append('Corso', getCourseName(formData.course));
        formDataToSend.append('_subject', 'Nuova Iscrizione BIT Corsi');
        formDataToSend.append('_template', 'table');
        formDataToSend.append('_captcha', 'false');
        formDataToSend.append('_next', window.location.origin + '/grazie.html');
        
        try {
            const response = await fetch(CONFIG.formSubmitUrl, {
                method: 'POST',
                body: formDataToSend,
                mode: 'no-cors'
            });
            
            // Succes
            showFormSuccess();
            
        } catch (error) {
            throw error;
        } finally {
            submitButton.innerHTML = '<i class="fas fa-paper-plane"></i> Invia richiesta iscrizione';
            submitButton.disabled = false;
        }
    }
    
    function showFormSuccess() {
        const successHTML = `
            <div class="form-success">
                <div class="success-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h3>Iscrizione Inviata con Successo!</h3>
                <p>Ti abbiamo inviato una email di conferma. Ti contatteremo al più presto per definire i dettagli.</p>
                <div class="success-actions">
                    <button class="btn-primary" onclick="window.location.reload()">Nuova Iscrizione</button>
                    <a href="https://wa.me/${CONFIG.whatsappNumber}" class="btn-whatsapp" target="_blank">
                        <i class="fab fa-whatsapp"></i> Scrivici su WhatsApp
                    </a>
                </div>
            </div>
        `;
        
        form.innerHTML = successHTML;
        
        // Animazione di successo
        setTimeout(() => {
            const confetti = createConfetti();
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                confetti.remove();
            }, 3000);
        }, 500);
    }
}


// ===========================================
// 6. CARICAMENTO CORSI - Dinamico con JSON
// ===========================================
// ===========================================
// FUNZIONI AGGIORNATE per JSON Integration
// ===========================================

// Sovrascrivi la funzione loadCourses con questa versione aggiornata:
async function loadCourses() {
    if (!DOM.coursesContainer) return;
    
    try {
        // Carica il JSON esterno
        const response = await fetch('corsi.json');
        if (!response.ok) throw new Error('JSON non trovato');
        
        const data = await response.json();
        
        // Aggiorna titolo e sottotitolo
        updateCoursesHeader(data);
        
        // Carica promo natale (se attiva)
        loadPromo(data.promoNatale);
        
        // Renderizza i corsi
        renderCourses(data.corsi);
        
        // Inizializza filtri
        initCourseFilters();
        
        // Animazione di entrata
        animateCoursesEntry();
        
    } catch (error) {
        console.error('Errore caricamento corsi:', error);
        showCoursesError();
    }
}

function updateCoursesHeader(data) {
    const title = document.getElementById('courses-title');
    const subtitle = document.getElementById('courses-subtitle');
    
    if (title && data.titoloCorsi) {
        title.textContent = data.titoloCorsi;
    }
    
    if (subtitle && data.sottotitoloCorsi) {
        subtitle.textContent = data.sottotitoloCorsi;
    }
}

function loadPromo(promoData) {
    if (!DOM.promoContainer || !promoData || !promoData.attiva) {
        DOM.promoContainer.style.display = 'none';
        return;
    }
    
    DOM.promoContainer.innerHTML = createPromoHTML(promoData);
    DOM.promoContainer.style.display = 'block';
    
    // Animazione speciale per la promo
    animatePromo();
    createSnowflakes();
}

function createPromoHTML(promo) {
    return `
        <div class="promo-natale-banner">
            <div class="promo-natale-content">
                <div class="promo-natale-tag">🎄 OFFERTA NATALIZIA</div>
                <h3>${promo.titolo}</h3>
                <p class="promo-natale-subtitle">${promo.sottotitolo}</p>
                <p class="promo-natale-description">${promo.descrizione}</p>
                
                <div class="promo-natale-details">
                    <div class="promo-detail-item">
                        <i class="fas fa-calendar-alt"></i>
                        <span><strong>Date:</strong> ${promo.date}</span>
                    </div>
                    <div class="promo-detail-item">
                        <i class="fas fa-child"></i>
                        <span><strong>Età:</strong> ${promo.eta}</span>
                    </div>
                    <div class="promo-detail-item">
                        <i class="fas fa-euro-sign"></i>
                        <span><strong>Prezzo:</strong> ${promo.prezzo}</span>
                    </div>
                    <div class="promo-detail-item">
                        <i class="fas fa-user-friends"></i>
                        <span><strong>${promo.posti}</strong></span>
                    </div>
                </div>
                
                <a href="#iscrizione" class="promo-natale-cta" data-course="natale">
                    <i class="fas fa-gift"></i>
                    ${promo.cta}
                </a>
            </div>
            <div class="snowflakes" id="snowflakes"></div>
        </div>
    `;
}

function createSnowflakes() {
    const container = document.getElementById('snowflakes');
    if (!container) return;
    
    for (let i = 0; i < 30; i++) {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        
        // Dimensioni casuali
        const size = Math.random() * 10 + 5;
        snowflake.style.width = `${size}px`;
        snowflake.style.height = `${size}px`;
        
        // Posizione casuale
        snowflake.style.left = `${Math.random() * 100}%`;
        
        // Opacità casuale
        snowflake.style.opacity = `${Math.random() * 0.5 + 0.3}`;
        
        // Animazione
        const duration = Math.random() * 5 + 5;
        const delay = Math.random() * 5;
        snowflake.style.animation = `fall ${duration}s linear ${delay}s infinite`;
        
        container.appendChild(snowflake);
    }
}

function animatePromo() {
    const banner = document.querySelector('.promo-natale-banner');
    if (!banner) return;
    
    // Animazione di entrata
    banner.style.opacity = '0';
    banner.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        banner.style.transition = 'all 0.6s ease-out';
        banner.style.opacity = '1';
        banner.style.transform = 'translateY(0)';
    }, 100);
}

function renderCourses(courses) {
    if (!courses || courses.length === 0) {
        DOM.coursesContainer.innerHTML = createNoCoursesHTML();
        return;
    }
    
    const coursesHTML = courses.map(course => createCourseHTML(course)).join('');
    DOM.coursesContainer.innerHTML = coursesHTML;
    
    // Inizializza bottoni dei corsi
    initCourseButtons();
}

function createCourseHTML(course) {
    const badgeClass = course.stato === 'aperto' ? 'badge-open' : 'badge-closed';
    const badgeText = course.stato === 'aperto' ? '🟢 Aperte' : '🔴 Esaurito';
    
    // Determina età per filtri
    const ageRange = course.eta;
    let filterClass = '';
    if (ageRange.includes('8-11') || ageRange.includes('8-13')) {
        filterClass = 'beginner intermediate';
    } else if (ageRange.includes('12-16')) {
        filterClass = 'intermediate advanced';
    }
    
    return `
        <div class="course-card ${filterClass}" data-age="${course.eta}" data-status="${course.stato}">
            <div class="course-badge ${badgeClass}">${badgeText}</div>
            
            <div class="course-header">
                <h3>${course.nome}</h3>
                <div class="course-age">${course.eta}</div>
            </div>
            
            <div class="course-body">
                <p class="course-description">${course.descrizione}</p>
                
                <div class="course-meta">
                    <div class="meta-item">
                        <i class="fas fa-calendar-check"></i>
                        <span>${course.incontri}</span>
                    </div>
                    <div class="meta-item">
                        <i class="fas fa-clock"></i>
                        <span>${course.quando.split(',')[0]}</span>
                    </div>
                    <div class="meta-item">
                        <i class="fas fa-euro-sign"></i>
                        <span>${course.prezzo}</span>
                    </div>
                </div>
                
                <div class="course-features">
                    ${getCourseFeatures(course.id).map(feature => `
                        <div class="feature">
                            <i class="fas fa-check"></i>
                            <span>${feature}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="course-footer">
                <button class="btn-course-info" onclick="showCourseDetails('${course.id}')">
                    <i class="fas fa-info-circle"></i>
                    Dettagli
                </button>
                <button class="btn-course-enroll" onclick="enrollToCourse('${course.id}')" 
                        ${course.stato !== 'aperto' ? 'disabled' : ''}>
                    <i class="fas fa-pen-alt"></i>
                    ${course.stato === 'aperto' ? 'Iscriviti' : 'Esaurito'}
                </button>
            </div>
        </div>
    `;
}

function getCourseFeatures(courseId) {
    const features = {
        'spike': [
            'Kit LEGO Spike Prime incluso',
            'Programmazione a blocchi intuitiva',
            '6 progetti pratici completi',
            'Certificato finale'
        ],
        'arduino': [
            'Kit Arduino base incluso',
            'Introduzione all\'elettronica',
            '4 progetti avanzati',
            'Supporto coding testuale'
        ],
        'microbit': [
            'micro:bit BBC incluso',
            'Programmazione creativa',
            '6 progetti interattivi',
            'Sensori e LED integrati'
        ],
        'roberta': [
            'Accesso Open Roberta Lab',
            '4 sessioni online + 2 in sede',
            'Simulazione multipla robot',
            'Apprendimento flessibile'
        ],
        'natale': [
            '3 mattinate immersive',
            'Progetti natalizi tecnologici',
            'Materiali premium inclusi',
            'Regalo speciale finale'
        ]
    };
    
    return features[courseId] || [
        'Materiali inclusi',
        'Gruppi piccoli',
        'Istruttori certificati',
        'Progetti pratici'
    ];
}

function createNoCoursesHTML() {
    return `
        <div class="no-courses">
            <div class="no-courses-icon">
                <i class="fas fa-calendar-times"></i>
            </div>
            <h3>Nessun corso disponibile al momento</h3>
            <p>Stiamo preparando nuove date per i prossimi mesi.</p>
            <div class="no-courses-actions">
                <a href="#contatti" class="btn-primary">
                    <i class="fas fa-bell"></i>
                    Notificami quando disponibili
                </a>
                <a href="https://wa.me/${CONFIG.whatsappNumber}" class="btn-whatsapp" target="_blank">
                    <i class="fab fa-whatsapp"></i>
                    Chiedi informazioni
                </a>
            </div>
        </div>
    `;
}

function showCoursesError() {
    DOM.coursesContainer.innerHTML = `
        <div class="error-loading">
            <div class="error-icon">
                <i class="fas fa-exclamation-triangle"></i>
            </div>
            <h3>Impossibile caricare i corsi</h3>
            <p>Si è verificato un errore durante il caricamento delle informazioni.</p>
            <div class="error-actions">
                <button class="btn-retry" onclick="loadCourses()">
                    <i class="fas fa-redo"></i>
                    Riprova
                </button>
                <a href="tel:${CONFIG.phoneNumber}" class="btn-phone">
                    <i class="fas fa-phone"></i>
                    Chiamaci per info
                </a>
            </div>
        </div>
    `;
}

function initCourseFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const courseCards = document.querySelectorAll('.course-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Aggiorna bottoni attivi
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const filter = button.dataset.filter;
            applyCourseFilter(filter, courseCards);
        });
    });
}

function applyCourseFilter(filter, courseCards) {
    courseCards.forEach(card => {
        const age = card.dataset.age;
        const status = card.dataset.status;
        
        let shouldShow = true;
        
        switch (filter) {
            case 'all':
                shouldShow = true;
                break;
                
            case 'beginner':
                shouldShow = age.includes('8-11') || age.includes('8-13');
                break;
                
            case 'intermediate':
                shouldShow = age.includes('12-13');
                break;
                
            case 'advanced':
                shouldShow = age.includes('14-16');
                break;
                
            case 'available':
                shouldShow = status === 'aperto';
                break;
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
}

function animateCoursesEntry() {
    const cards = document.querySelectorAll('.course-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease-out';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Funzioni globali aggiornate
window.showCourseDetails = function(courseId) {
    // Implementa modal dettagli corso
    const courseDetails = {
        'spike': {
            title: 'Spike Prime Lab',
            description: 'Corso completo di robotica con LEGO Education Spike Prime',
            details: '6 incontri pratici per imparare a costruire e programmare robot',
            requirements: 'Nessuna esperienza richiesta',
            included: ['Kit LEGO Spike Prime', 'Accesso software', 'Materiali', 'Certificato'],
            schedule: 'Sabato 10:00-11:30'
        },
        'arduino': {
            title: 'Arduino Base',
            description: 'Introduzione all\'elettronica e programmazione con Arduino',
            details: '4 sessioni per creare progetti elettronici interattivi',
            requirements: 'Conoscenze base di informatica consigliate',
            included: ['Kit Arduino', 'Componenti elettronici', 'Supporto', 'Certificato'],
            schedule: 'Sabato mattina ore 10:00-11:30'
        },
        'microbit': {
            title: 'Micro:bit Lab',
            description: 'Programmazione creativa con il computer tascabile BBC',
            details: '6 incontri per creare giochi e strumenti digitali',
            requirements: 'Nessuna esperienza richiesta',
            included: ['micro:bit BBC', 'Accesso editor online', 'Sensori', 'Certificato'],
            schedule: 'Sabato mattina ore 10:00-11:30'
        },
        'roberta': {
            title: 'Open Roberta Lab',
            description: 'Robotica virtuale con piattaforma cloud',
            details: '4 sessioni online + 2 incontri in sede',
            requirements: 'Computer con connessione internet',
            included: ['Accesso piattaforma', 'Supporto remoto', 'Simulatore', 'Certificato'],
            schedule: 'Flessibile (online + in sede)'
        },
        'natale': {
            title: 'Xmas Tech Lab',
            description: 'Laboratorio tecnologico natalizio speciale',
            details: '3 mattinate immersive di robotica creativa',
            requirements: 'Entusiasmo e creatività',
            included: ['Tutti i materiali', 'Regalo natalizio', 'Merenda', 'Diploma speciale'],
            schedule: '29-30-31 dicembre 10:00-12:00'
        }
    };
    
    const course = courseDetails[courseId];
    if (!course) return;
    
    showCourseModal(course);
};

function showCourseModal(course) {
    // Crea e mostra modal con dettagli corso
    const modalHTML = `
        <div class="course-modal-overlay">
            <div class="course-modal">
                <button class="modal-close">
                    <i class="fas fa-times"></i>
                </button>
                
                <div class="modal-header">
                    <h3>${course.title}</h3>
                    <p class="modal-subtitle">${course.description}</p>
                </div>
                
                <div class="modal-body">
                    <div class="modal-section">
                        <h4><i class="fas fa-info-circle"></i> Descrizione</h4>
                        <p>${course.details}</p>
                    </div>
                    
                    <div class="modal-grid">
                        <div class="modal-card">
                            <h4><i class="fas fa-clipboard-check"></i> Requisiti</h4>
                            <p>${course.requirements}</p>
                        </div>
                        
                        <div class="modal-card">
                            <h4><i class="fas fa-calendar-alt"></i> Orario</h4>
                            <p>${course.schedule}</p>
                        </div>
                    </div>
                    
                    <div class="modal-section">
                        <h4><i class="fas fa-box-open"></i> Cosa include</h4>
                        <ul class="included-list">
                            ${course.included.map(item => `
                                <li><i class="fas fa-check"></i> ${item}</li>
                            `).join('')}
                        </ul>
                    </div>
                </div>
                
                <div class="modal-footer">
                    <button class="btn-secondary modal-close-btn">
                        <i class="fas fa-times"></i>
                        Chiudi
                    </button>
                    <a href="#iscrizione" class="btn-primary" data-course="${course.title.toLowerCase()}">
                        <i class="fas fa-pen-alt"></i>
                        Iscriviti ora
                    </a>
                </div>
            </div>
        </div>
    `;
    
    // Aggiungi modal al documento
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHTML;
    document.body.appendChild(modalContainer);
    
    // Gestione chiusura modal
    const closeButtons = modalContainer.querySelectorAll('.modal-close, .modal-close-btn');
    const overlay = modalContainer.querySelector('.course-modal-overlay');
    
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            modalContainer.remove();
        });
    });
    
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            modalContainer.remove();
        }
    });
    
    // Animazione di entrata
    setTimeout(() => {
        overlay.style.opacity = '1';
        modalContainer.querySelector('.course-modal').style.transform = 'translateY(0)';
    }, 10);
}

window.enrollToCourse = function(courseId) {
    // Scroll al form di iscrizione
    const formSection = document.getElementById('iscrizione');
    if (formSection) {
        formSection.scrollIntoView({ behavior: 'smooth' });
        
        // Imposta il corso selezionato nel form
        setTimeout(() => {
            const courseOptions = document.querySelectorAll('.course-option');
            courseOptions.forEach(option => {
                if (option.dataset.course === courseId) {
                    option.click();
                }
            });
            
            // Mostra notifica
            showNotification(`Pronto per iscriverti al corso! Compila il modulo qui sotto.`, 'success');
        }, 500);
    }
};

// CSS aggiuntivo per modal
const modalStyles = `
    .course-modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(5px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
        padding: 20px;
    }
    
    .course-modal {
        background: white;
        border-radius: var(--radius-xl);
        width: 100%;
        max-width: 600px;
        max-height: 90vh;
        overflow-y: auto;
        transform: translateY(20px);
        transition: transform 0.3s ease;
        position: relative;
    }
    
    .modal-close {
        position: absolute;
        top: 20px;
        right: 20px;
        background: var(--gray-100);
        border: none;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 1.2rem;
        color: var(--gray-700);
        transition: all 0.2s;
        z-index: 1;
    }
    
    .modal-close:hover {
        background: var(--gray-200);
        transform: rotate(90deg);
    }
    
    .modal-header {
        padding: 40px 40px 20px;
        border-bottom: 1px solid var(--gray-200);
    }
    
    .modal-header h3 {
        font-size: 1.75rem;
        color: var(--gray-900);
        margin-bottom: 10px;
    }
    
    .modal-subtitle {
        color: var(--gray-600);
        font-size: 1.1rem;
    }
    
    .modal-body {
        padding: 30px 40px;
    }
    
    .modal-section {
        margin-bottom: 30px;
    }
    
    .modal-section h4 {
        font-size: 1.1rem;
        color: var(--gray-900);
        margin-bottom: 15px;
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .modal-section h4 i {
        color: var(--primary);
    }
    
    .modal-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;
        margin: 25px 0;
    }
    
    .modal-card {
        background: var(--gray-50);
        padding: 20px;
        border-radius: var(--radius-lg);
    }
    
    .modal-card h4 {
        font-size: 1rem;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        gap: 8px;
    }
    
    .included-list {
        list-style: none;
        padding: 0;
    }
    
    .included-list li {
        padding: 8px 0;
        display: flex;
        align-items: center;
        gap: 10px;
        color: var(--gray-700);
    }
    
    .included-list li i {
        color: var(--success);
    }
    
    .modal-footer {
        padding: 25px 40px;
        border-top: 1px solid var(--gray-200);
        display: flex;
        gap: 15px;
        justify-content: flex-end;
    }
    
    .modal-close-btn {
        background: var(--gray-200);
        color: var(--gray-700);
        border: none;
        padding: 12px 24px;
        border-radius: var(--radius-md);
        font-weight: 600;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        transition: all 0.2s;
    }
    
    .modal-close-btn:hover {
        background: var(--gray-300);
    }
    
    @media (max-width: 768px) {
        .course-modal {
            max-height: 80vh;
        }
        
        .modal-grid {
            grid-template-columns: 1fr;
        }
        
        .modal-footer {
            flex-direction: column;
        }
        
        .modal-header,
        .modal-body,
        .modal-footer {
            padding: 25px;
        }
    }
    
    @media (max-width: 480px) {
        .course-modal {
            border-radius: 20px 20px 0 0;
            margin-top: auto;
        }
        
        .modal-header h3 {
            font-size: 1.5rem;
        }
    }
`;

// Aggiungi stili modal
const modalStyleSheet = document.createElement('style');
modalStyleSheet.textContent = modalStyles;
document.head.appendChild(modalStyleSheet);

// ===========================================
// 7. SCROLL EFFECTS - Animazioni al scroll
// ===========================================
function initScrollEffects() {
    // Header scroll effect
    let lastScroll = 0;
    const header = document.querySelector('.main-header');
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.classList.add('scrolled');
            
            if (currentScroll > lastScroll && currentScroll > 200) {
                header.classList.add('hidden');
            } else {
                header.classList.remove('hidden');
            }
        } else {
            header.classList.remove('scrolled', 'hidden');
        }
        
        lastScroll = currentScroll;
        
        // Animazioni al reveal
        animateOnScroll();
    });
    
    // Inizializza osservatore per animazioni
    initIntersectionObserver();
}

function initIntersectionObserver() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                
                // Se è una card, aggiungi delay progressivo
                if (entry.target.classList.contains('course-card') || 
                    entry.target.classList.contains('tool-card')) {
                    const index = Array.from(entry.target.parentNode.children).indexOf(entry.target);
                    entry.target.style.animationDelay = `${index * 0.1}s`;
                }
            }
        });
    }, observerOptions);
    
    // Osserva elementi da animare
    const elementsToAnimate = document.querySelectorAll(
        '.course-card, .tool-card, .highlight-card, .faq-category'
    );
    
    elementsToAnimate.forEach(element => {
        observer.observe(element);
    });
}

function animateOnScroll() {
    // Implementa animazioni personalizzate se necessario
}


// ===========================================
// 8. WHATSAPP FAB - Intelligente
// ===========================================
function initWhatsAppFAB() {
    const fab = document.querySelector('.floating-whatsapp');
    if (!fab) return;
    
    let isVisible = true;
    let lastScrollTop = 0;
    
    // Mostra/nascondi in base allo scroll
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        
        // Nascondi quando si scrolla verso il basso
        if (scrollTop > lastScrollTop && scrollTop > 300) {
            if (isVisible) {
                fab.style.transform = 'translateY(100px)';
                isVisible = false;
            }
        } else {
            if (!isVisible) {
                fab.style.transform = 'translateY(0)';
                isVisible = true;
            }
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Effetto hover migliorato
    fab.addEventListener('mouseenter', () => {
        fab.style.transform = 'scale(1.1)';
    });
    
    fab.addEventListener('mouseleave', () => {
        fab.style.transform = 'scale(1)';
    });
    
    // Clic per WhatsApp
    fab.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Apre WhatsApp con messaggio precompilato
        const message = `Ciao BIT Corsi! Sono interessato ai corsi di robotica educativa. Potete darmi maggiori informazioni?`;
        const whatsappUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
        
        window.open(whatsappUrl, '_blank');
    });
}


// ===========================================
// 9. UTILITY FUNCTIONS - Funzioni di supporto
// ===========================================
function showNotification(message, type = 'info') {
    // Rimuovi notifiche precedenti
    removeExistingNotifications();
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" aria-label="Chiudi notifica">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    // Animazione di entrata
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Auto-rimozione dopo 5 secondi
    const autoRemove = setTimeout(() => {
        removeNotification(notification);
    }, 5000);
    
    // Pulsante di chiusura
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', () => {
        clearTimeout(autoRemove);
        removeNotification(notification);
    });
    
    // Chiudi al click
    notification.addEventListener('click', (e) => {
        if (!e.target.closest('.notification-close')) {
            clearTimeout(autoRemove);
            removeNotification(notification);
        }
    });
}

function removeExistingNotifications() {
    const existing = document.querySelectorAll('.notification');
    existing.forEach(notification => {
        removeNotification(notification);
    });
}

function removeNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

function createConfetti() {
    const confetti = document.createElement('div');
    confetti.className = 'confetti-container';
    
    const colors = ['#FF6B35', '#10B981', '#3B82F6', '#F59E0B'];
    
    for (let i = 0; i < 100; i++) {
        const particle = document.createElement('div');
        particle.className = 'confetti-particle';
        
        // Stili casuali
        particle.style.left = `${Math.random() * 100}vw`;
        particle.style.width = `${Math.random() * 10 + 5}px`;
        particle.style.height = particle.style.width;
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        particle.style.animationDelay = `${Math.random() * 2}s`;
        particle.style.animationDuration = `${Math.random() * 2 + 2}s`;
        
        confetti.appendChild(particle);
    }
    
    return confetti;
}

function simulateDelay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function isValidPhone(phone) {
    const re = /^[\+]?[1-9][\d]{0,15}$/;
    return re.test(phone.replace(/[\s\-\(\)]/g, ''));
}

function getCourseName(courseId) {
    const courses = {
        'lego': 'LEGO Spike Prime',
        'microbit': 'micro:bit BBC',
        'arduino': 'Arduino'
    };
    return courses[courseId] || 'Corso di robotica';
}

function getAvailabilityText(availability) {
    const texts = {
        'alta': 'Posti disponibili',
        'media': 'Pochi posti rimasti',
        'bassa': 'Lista d\'attesa'
    };
    return texts[availability] || 'Disponibilità da verificare';
}

function highlightError(input, message = 'Campo obbligatorio') {
    input.classList.add('error');
    
    // Rimuovi errori precedenti
    const existingError = input.parentNode.querySelector('.error-message');
    if (existingError) existingError.remove();
    
    // Aggiungi messaggio di errore
    const error = document.createElement('div');
    error.className = 'error-message';
    error.textContent = message;
    input.parentNode.appendChild(error);
}

function removeError(input) {
    input.classList.remove('error');
    const error = input.parentNode.querySelector('.error-message');
    if (error) error.remove();
}


// ===========================================
// 10. PRINT FUNCTIONALITY - Stampa info
// ===========================================
function initPrintButton() {
    // Aggiungi pulsante stampa nel footer
    const footer = document.querySelector('.main-footer');
    if (!footer) return;
    
    const printButton = document.createElement('button');
    printButton.className = 'btn-print';
    printButton.innerHTML = '<i class="fas fa-print"></i> Stampa informazioni';
    printButton.addEventListener('click', printCourseInfo);
    
    const footerBottom = footer.querySelector('.footer-bottom');
    if (footerBottom) {
        footerBottom.appendChild(printButton);
    }
}

function printCourseInfo() {
    // Crea una finestra di stampa con informazioni essenziali
    const printWindow = window.open('', '_blank');
    
    const courses = Array.from(document.querySelectorAll('.course-card')).map(card => ({
        name: card.querySelector('h3')?.textContent || 'Corso',
        age: card.querySelector('.course-age')?.textContent || '',
        schedule: card.querySelector('.meta-item:nth-child(2) span')?.textContent || '',
        price: card.querySelector('.meta-item:nth-child(3) span')?.textContent || ''
    }));
    
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>BIT Corsi - Informazioni Corsi</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 2cm; }
                h1 { color: #FF6B35; }
                .course { margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid #ccc; }
                .contact { margin-top: 40px; }
                @media print {
                    .no-print { display: none; }
                }
            </style>
        </head>
        <body>
            <h1>BIT Corsi - Informazioni Corsi 2025/2026</h1>
            <p>Stampato il ${new Date().toLocaleDateString('it-IT')}</p>
            
            <h2>Corsi Disponibili</h2>
            ${courses.map(course => `
                <div class="course">
                    <h3>${course.name}</h3>
                    <p><strong>Età:</strong> ${course.age}</p>
                    <p><strong>Orario:</strong> ${course.schedule}</p>
                    <p><strong>Prezzo:</strong> ${course.price}</p>
                </div>
            `).join('')}
            
            <div class="contact">
                <h2>Contatti</h2>
                <p><strong>Telefono:</strong> ${CONFIG.phoneNumber}</p>
                <p><strong>Email:</strong> ${CONFIG.email}</p>
                <p><strong>Sede:</strong> Centro Aperto Sandro Marelli, Piazzetta SS. Francesco e Chiara 1, Mompiano (BS)</p>
            </div>
            
            <button class="no-print" onclick="window.print()">Stampa</button>
            <button class="no-print" onclick="window.close()">Chiudi</button>
        </body>
        </html>
    `);
    
    printWindow.document.close();
}


// ===========================================
// 11. SERVICE WORKER (Opzionale) - PWA
// ===========================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('Service Worker registrato con successo:', registration);
            })
            .catch(error => {
                console.log('Service Worker registrazione fallita:', error);
            });
    });
}


// ===========================================
// 12. ERROR HANDLING - Gestione errori globale
// ===========================================
window.addEventListener('error', (event) => {
    console.error('Errore JavaScript:', event.error);
    
    // Invia errore a Google Analytics (se configurato)
    if (typeof gtag === 'function') {
        gtag('event', 'exception', {
            description: event.error.message,
            fatal: false
        });
    }
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Promise rifiutata non gestita:', event.reason);
});


// ===========================================
// 13. ANALYTICS (Opzionale) - Tracking base
// ===========================================
function trackEvent(category, action, label) {
    // Implementa Google Analytics o altro
    if (typeof gtag === 'function') {
        gtag('event', action, {
            event_category: category,
            event_label: label
        });
    }
    
    // Log locale per debug
    console.log(`Tracking: ${category} - ${action} - ${label}`);
}

// Traccia click su CTA principali
document.addEventListener('click', (e) => {
    const button = e.target.closest('button, a[href^="#"], a.btn');
    if (button) {
        const text = button.textContent.trim() || button.getAttribute('aria-label') || 'Unknown';
        trackEvent('CTA Click', text, window.location.pathname);
    }
});


// ===========================================
// EXPORT FUNCTIONS per uso globale
// ===========================================
window.BIT = {
    showNotification,
    loadCourses,
    enrollToCourse,
    trackEvent,
    printCourseInfo
};


// ===========================================
// READY STATE - Quando tutto è pronto
// ===========================================
if (document.readyState === 'complete') {
    console.log('BIT Corsi - Sito completamente caricato');
    showNotification('Benvenuto in BIT Corsi! 👋', 'info');
}

// ===========================================
// CSS AGGIUNTIVO per JavaScript (inline)
// ===========================================
const dynamicStyles = `
    /* Notification Styles */
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        border-radius: 12px;
        padding: 16px 20px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        max-width: 400px;
        transform: translateX(120%);
        transition: transform 0.3s ease;
        z-index: 10000;
        border-left: 4px solid var(--primary);
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .notification-success { border-color: var(--success); }
    .notification-error { border-color: var(--error); }
    .notification-warning { border-color: var(--warning); }
    .notification-info { border-color: var(--info); }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
        flex: 1;
    }
    
    .notification-content i {
        font-size: 1.2rem;
    }
    
    .notification-success i { color: var(--success); }
    .notification-error i { color: var(--error); }
    .notification-warning i { color: var(--warning); }
    .notification-info i { color: var(--info); }
    
    .notification-close {
        background: none;
        border: none;
        color: var(--gray-400);
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        transition: all 0.2s;
    }
    
    .notification-close:hover {
        color: var(--gray-700);
        background: var(--gray-100);
    }
    
    /* Confetti */
    .confetti-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 9999;
    }
    
    .confetti-particle {
        position: absolute;
        border-radius: 50%;
        animation: confetti-fall linear forwards;
    }
    
    @keyframes confetti-fall {
        0% {
            transform: translateY(-100px) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
        }
    }
    
    /* FAQ Search */
    .faq-search {
        margin-bottom: 30px;
        max-width: 600px;
        margin-left: auto;
        margin-right: auto;
    }
    
    .search-box {
        position: relative;
        display: flex;
        align-items: center;
        background: white;
        border-radius: 12px;
        padding: 12px 16px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    }
    
    .search-box i {
        color: var(--gray-400);
        margin-right: 10px;
    }
    
    #faq-search {
        flex: 1;
        border: none;
        outline: none;
        font-size: 1rem;
        background: transparent;
    }
    
    .clear-search {
        background: none;
        border: none;
        color: var(--gray-400);
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        transition: all 0.2s;
    }
    
    .clear-search:hover {
        color: var(--gray-700);
        background: var(--gray-100);
    }
    
    .search-results {
        margin-top: 20px;
        background: white;
        border-radius: 12px;
        padding: 20px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        display: none;
    }
    
    .results-count {
        font-weight: 600;
        color: var(--gray-700);
        margin-bottom: 15px;
        padding-bottom: 10px;
        border-bottom: 1px solid var(--gray-200);
    }
    
    .result-item {
        padding: 15px;
        border-radius: 8px;
        margin-bottom: 10px;
        background: var(--gray-50);
        cursor: pointer;
        transition: all 0.2s;
    }
    
    .result-item:hover {
        background: var(--gray-100);
        transform: translateX(5px);
    }
    
    .result-item h4 {
        margin: 0 0 5px 0;
        color: var(--gray-900);
        font-size: 1rem;
    }
    
    .result-category {
        font-size: 0.85rem;
        color: var(--primary);
        font-weight: 500;
        margin-bottom: 5px;
    }
    
    .result-answer {
        font-size: 0.9rem;
        color: var(--gray-600);
        margin: 0;
    }
    
    .no-results {
        text-align: center;
        color: var(--gray-500);
        padding: 20px;
    }
    
    /* Form Errors */
    .error {
        border-color: var(--error) !important;
    }
    
    .error-message {
        color: var(--error);
        font-size: 0.85rem;
        margin-top: 4px;
    }
    
    /* Course Cards Hover */
    .course-card {
        transition: all 0.3s ease;
    }
    
    .course-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 15px 30px rgba(0,0,0,0.1);
    }
    
    .course-card.featured {
        border: 2px solid var(--primary);
    }
    
    .course-badge {
        position: absolute;
        top: 15px;
        right: 15px;
        background: var(--primary);
        color: white;
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 0.75rem;
        font-weight: 600;
    }
    
    .availability {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 6px 12px;
        border-radius: 20px;
        font-size: 0.85rem;
        font-weight: 500;
        margin-top: 15px;
    }
    
    .availability.alta {
        background: rgba(16, 185, 129, 0.1);
        color: var(--success);
    }
    
    .availability.media {
        background: rgba(245, 158, 11, 0.1);
        color: var(--warning);
    }
    
    .availability.bassa {
        background: rgba(239, 68, 68, 0.1);
        color: var(--error);
    }
    
    /* Promo Banner */
    .promo-banner {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 30px;
        background: linear-gradient(135deg, #FF6B35 0%, #FF8B5C 100%);
        color: white;
        padding: 30px;
        border-radius: 20px;
        margin-bottom: 40px;
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.5s ease;
    }
    
    .promo-tag {
        display: inline-block;
        background: rgba(255,255,255,0.2);
        padding: 6px 15px;
        border-radius: 20px;
        font-size: 0.85rem;
        font-weight: 600;
        margin-bottom: 15px;
    }
    
    .promo-banner h3 {
        margin: 0 0 10px 0;
        font-size: 1.5rem;
    }
    
    .promo-subtitle {
        font-size: 1.1rem;
        opacity: 0.9;
        margin-bottom: 10px;
    }
    
    .promo-description {
        opacity: 0.8;
        margin-bottom: 20px;
    }
    
    .promo-details {
        display: flex;
        gap: 20px;
        margin-bottom: 25px;
    }
    
    .promo-detail {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 0.95rem;
    }
    
    .btn-promo-action {
        background: white;
        color: var(--primary);
        border: none;
        padding: 12px 25px;
        border-radius: 25px;
        font-weight: 600;
        font-size: 1rem;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 10px;
        transition: all 0.3s;
    }
    
    .btn-promo-action:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 20px rgba(0,0,0,0.1);
    }
    
    .promo-image {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 4rem;
    }
    
    /* Form Success */
    .form-success {
        text-align: center;
        padding: 40px 20px;
    }
    
    .success-icon {
        font-size: 4rem;
        color: var(--success);
        margin-bottom: 20px;
    }
    
    .form-success h3 {
        margin: 0 0 15px 0;
        color: var(--gray-900);
    }
    
    .form-success p {
        color: var(--gray-600);
        margin-bottom: 30px;
        max-width: 500px;
        margin-left: auto;
        margin-right: auto;
    }
    
    .success-actions {
        display: flex;
        gap: 15px;
        justify-content: center;
        flex-wrap: wrap;
    }
    
    /* Loading States */
    .loading-courses, .error-loading, .no-courses {
        text-align: center;
        padding: 60px 20px;
        grid-column: 1 / -1;
    }
    
    .loading-courses i {
        font-size: 3rem;
        color: var(--primary);
        margin-bottom: 20px;
        animation: spin 1s linear infinite;
    }
    
    .error-loading i {
        font-size: 3rem;
        color: var(--error);
        margin-bottom: 20px;
    }
    
    .no-courses i {
        font-size: 3rem;
        color: var(--gray-400);
        margin-bottom: 20px;
    }
    
    .btn-retry {
        background: var(--primary);
        color: white;
        border: none;
        padding: 10px 25px;
        border-radius: 25px;
        font-weight: 600;
        cursor: pointer;
        margin-top: 20px;
        transition: all 0.3s;
    }
    
    .btn-retry:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(255,107,53,0.3);
    }
    
    /* Print Button */
    .btn-print {
        background: var(--gray-200);
        color: var(--gray-700);
        border: none;
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 0.9rem;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        margin-top: 20px;
        transition: all 0.3s;
    }
    
    .btn-print:hover {
        background: var(--gray-300);
        transform: translateY(-1px);
    }
    
    /* Animations */
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .animated {
        animation: fadeInUp 0.6s ease-out;
    }
    
    /* Responsive Adjustments */
    @media (max-width: 768px) {
        .promo-banner {
            grid-template-columns: 1fr;
            text-align: center;
        }
        
        .promo-details {
            justify-content: center;
            flex-wrap: wrap;
        }
        
        .success-actions {
            flex-direction: column;
        }
        
        .notification {
            left: 20px;
            right: 20px;
            max-width: none;
        }
    }
`;

// Aggiungi stili dinamici al documento
const styleSheet = document.createElement('style');
styleSheet.textContent = dynamicStyles;
document.head.appendChild(styleSheet);


// ===========================================
// FINAL INIT - Ultime inizializzazioni
// ===========================================
console.log('🎉 BIT CORSI JavaScript - Caricato e pronto!');
