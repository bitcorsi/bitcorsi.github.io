// ========================================
// FIREBASE — INIZIALIZZAZIONE
// ========================================
var firebaseConfig = {
  apiKey: "AIzaSyBmLKQwahwgfP5gfjgOWuEaHGq_wEuYQzQ",
  authDomain: "bitcorsi-da4b1.firebaseapp.com",
  projectId: "bitcorsi-da4b1",
  storageBucket: "bitcorsi-da4b1.firebasestorage.app",
  messagingSenderId: "98862947976",
  appId: "1:98862947976:web:abde1dea6b3c8655d5893d",
  measurementId: "G-EEDZVB4FRE""
};

if (!firebase.apps || !firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

var db = firebase.firestore();

// ========================================
// CORSI DISPONIBILI
// ========================================
var ENROLLMENT_COURSES = {
    'lego-spike':     { name: 'Lego Spike Prime',   age: '8-13 anni', max: 10 },
    'arduino':        { name: 'Arduino',            age: '12-16 anni', max: 10 },
    'open-roberta':   { name: 'Open Roberta',       age: '8-13 anni', max: 10 },
    'microbit':       { name: 'micro:bit BBC',      age: '8-13 anni', max: 10 },
    'mattine di coding':      { name: 'Mattine di coding',          age: '8-13 anni', max: 30 }
};

// ========================================
// INIT GENERALE
// ========================================
function init() {
    initMobileMenu();
    initFAQ();
    initContactForm();
    initCourses();
    unifyWhatsAppFAB();
    initSummerCampPopup();
    initEnrollmentModal();
}

// ========================================
// MENU MOBILE
// ========================================
function initMobileMenu() {
    var menuToggle = document.querySelector('.menu-toggle');
    var navOverlay = document.querySelector('.nav-overlay');
    var body = document.body;

    if (!menuToggle || !navOverlay) return;

    function closeMenu() {
        navOverlay.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        body.style.overflow = '';
    }

    menuToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        var isOpen = navOverlay.classList.contains('active');
        if (isOpen) {
            closeMenu();
        } else {
            navOverlay.classList.add('active');
            menuToggle.setAttribute('aria-expanded', 'true');
            body.style.overflow = 'hidden';
        }
    });

    navOverlay.querySelectorAll('a').forEach(function(link) {
        link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeMenu();
    });

    navOverlay.addEventListener('click', function(e) {
        if (e.target === navOverlay) closeMenu();
    });
}

// ========================================
// FAQ ACCORDION
// ========================================
function initFAQ() {
    var faqItems = document.querySelectorAll('.faq-list details');

    faqItems.forEach(function(item) {
        item.addEventListener('toggle', function() {
            if (this.open) {
                faqItems.forEach(function(otherItem) {
                    if (otherItem !== item && otherItem.open) {
                        otherItem.open = false;
                    }
                });
            }
        });
    });
}

// ========================================
// FORM ISCRIZIONE (formsubmit.co)
// ========================================
function initContactForm() {
    var contactForm = document.getElementById('iscrizione-form');
    var messageEl = document.getElementById('form-message');

    if (!contactForm) return;

    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        var submitBtn = this.querySelector('.btn-submit');
        if (!submitBtn || submitBtn.disabled) return;

        var originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Invio...';

        if (messageEl) {
            messageEl.className = 'form-message';
            messageEl.textContent = '';
        }

        try {
            var response = await fetch(this.action.trim(), {
                method: 'POST',
                body: new FormData(this)
            });

            var success = false;
            var contentType = response.headers.get('content-type') || '';

            if (response.ok) {
                if (contentType.includes('application/json')) {
                    var data = await response.json();
                    success = !!data.success;
                } else {
                    var text = await response.text();
                    success = text.includes('success') || text.includes('Thank you');
                }
            }

            if (success) {
                this.reset();
                if (messageEl) {
                    messageEl.textContent = 'Iscrizione inviata con successo!';
                    messageEl.className = 'form-message success';
                    setTimeout(function() {
                        messageEl.className = 'form-message';
                        setTimeout(function() { messageEl.textContent = ''; }, 300);
                    }, 5000);
                }
            } else {
                throw new Error('FormSubmit: risposta non valida');
            }

        } catch (error) {
            console.error('Invio fallito:', error);
            if (messageEl) {
                messageEl.textContent = 'Errore: controlla i dati e riprova.';
                messageEl.className = 'form-message error';
            }
        } finally {
            setTimeout(function() {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                }
            }, 600);
        }
    });
}

// ========================================
// CORSI DINAMICI DA corsi.json
// ========================================
function initCourses() {
    var container = document.getElementById('courses-container');
    var sectionHeader = document.querySelector('#corsi .section-header');
    var promoContainer = document.querySelector('#promo-natale-container');

    if (!container) return;

    fetch('corsi.json?' + Date.now())
        .then(function(response) {
            if (!response.ok) throw new Error('corsi.json non trovato');
            return response.json();
        })
        .then(function(data) {

            if (sectionHeader && data.titoloCorsi) {
                sectionHeader.innerHTML =
                    '<h2>' + data.titoloCorsi + '</h2>' +
                    '<p class="section-subtitle">' + (data.sottotitoloCorsi || '') + '</p>';
            }

            if (promoContainer && data.promoNatale && data.promoNatale.attiva) {
                var p = data.promoNatale;
                promoContainer.innerHTML =
                    '<div class="promo-natale-card">' +
                        '<div class="promo-natale-icon">' +
                            '<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor">' +
                                '<path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83M14 20a3 3 0 1 0-4 0M10 4a3 3 0 0 0 4 0"/>' +
                            '</svg>' +
                        '</div>' +
                        '<div class="promo-natale-content">' +
                            '<span class="promo-badge">EDIZIONE SPECIALE</span>' +
                            '<h3>' + p.titolo + '</h3>' +
                            '<p class="promo-subtitle">' + p.sottotitolo + '</p>' +
                            '<p>' + p.descrizione + '</p>' +
                            '<div class="promo-meta">' +
                                '<span><strong>Date:</strong> ' + p.date + '</span>' +
                                '<span><strong>Eta:</strong> ' + p.eta + '</span>' +
                                '<span><strong>Prezzo:</strong> ' + p.prezzo + '</span>' +
                            '</div>' +
                            '<p class="promo-note">' + p.posti + '</p>' +
                            '<a href="#home" class="btn-promo">' + p.cta + '</a>' +
                        '</div>' +
                    '</div>';
                promoContainer.style.display = 'block';
            } else if (promoContainer) {
                promoContainer.style.display = 'none';
            }

            container.innerHTML = '';
            var corsiNormali = (data.corsi || []).filter(function(c) {
                return c.tipo !== 'promo';
            });

            if (corsiNormali.length > 0) {
                corsiNormali.forEach(function(corso) {
                    var isActive = corso.stato === 'aperto';
                    var badgeClass = isActive ? 'badge-available' : 'badge-closed';
                    var btn;

                    if (!isActive) {
                        btn = '<button class="btn-course btn-disabled" disabled>Corso in svolgimento</button>';
                    } else if (corso.link) {
                        btn = '<a href="' + corso.link + '" class="btn-course" target="_blank" rel="noopener">' +
                                (corso.linkTesto || 'Scopri di piu') +
                              '</a>';
                    } else {
                        btn = '<a href="#contatti-info" class="btn-course">Iscriviti ora</a>';
                    }

                    var extraClass = corso.id === 'summercamp' ? ' course-card-summer' : '';
                    var card =
                        '<div class="course-card' + extraClass + '">' +
                            '<div class="course-badge ' + badgeClass + '">' + corso.badge + '</div>' +
                            '<h3>' + corso.nome + '</h3>' +
                            '<div class="course-meta">' +
                                '<span class="meta-item">' + corso.eta + '</span>' +
                                '<span class="meta-item">' + corso.incontri + '</span>' +
                                '<span class="meta-item meta-price">' + corso.prezzo + '</span>' +
                            '</div>' +
                            '<div class="course-details">' +
                                '<div class="detail-row"><strong>Quando:</strong> ' + corso.quando + '</div>' +
                            '</div>' +
                            '<p class="course-description">' + corso.descrizione + '</p>' +
                            btn +
                        '</div>';

                    container.innerHTML += card;
                });
            } else {
                container.innerHTML = '<div class="alert-box" style="grid-column:1/-1;"><p>Nessun corso attivo al momento.</p></div>';
            }
        })
        .catch(function(err) {
            console.error('Errore caricamento corsi:', err);
            if (sectionHeader) {
                sectionHeader.innerHTML =
                    '<h2>Corsi e Laboratori</h2>' +
                    '<p class="section-subtitle">Informazioni temporaneamente non disponibili</p>';
            }
            if (promoContainer) promoContainer.style.display = 'none';
            container.innerHTML =
                '<div class="alert-box" style="grid-column:1/-1;">' +
                    '<strong>Impossibile caricare i corsi</strong>' +
                    '<p>Contattaci per info aggiornate.</p>' +
                '</div>';
        });
}

// ========================================
// POPUP SUMMER CAMP
// — Mostrato dopo 8 secondi (non immediatamente)
//   per ridurre il bounce rate
// ========================================
function initSummerCampPopup() {
    var SESSION_KEY = 'sc_popup_shown';

    if (sessionStorage.getItem(SESSION_KEY)) return;

    var overlay = document.getElementById('sc-popup-overlay');
    if (!overlay) return;

    function closePopup() {
        overlay.classList.remove('sc-open');
        setTimeout(function() {
            overlay.style.display = 'none';
        }, 280);
    }

    var closeBtn = document.getElementById('sc-popup-close');
    var skipBtn  = document.getElementById('sc-popup-skip');

    if (closeBtn) closeBtn.addEventListener('click', closePopup);
    if (skipBtn)  skipBtn.addEventListener('click', closePopup);

    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) closePopup();
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closePopup();
    });

    // Ritardo aumentato a 8 secondi per non interrompere
    // l'utente che sta ancora scoprendo il sito
    setTimeout(function() {
        sessionStorage.setItem(SESSION_KEY, '1');
        overlay.style.display = 'flex';
        requestAnimationFrame(function() {
            overlay.classList.add('sc-open');
        });
    }, 8000);
}

// ========================================
// FAB WHATSAPP
// ========================================
function unifyWhatsAppFAB() {
    var fab = document.querySelector('.fab-whatsapp');
    var staticIcon = document.getElementById('whatsapp-static');

    if (!fab || !staticIcon) return;

    var originalStyle = {
        position: fab.style.position,
        left: fab.style.left,
        top: fab.style.top,
        transform: fab.style.transform,
        zIndex: fab.style.zIndex,
        pointerEvents: fab.style.pointerEvents
    };

    function updatePosition() {
        var rect = staticIcon.getBoundingClientRect();
        var isVisible = rect.top < window.innerHeight && rect.bottom > 0;

        if (isVisible) {
            var centerX = rect.left + window.scrollX + rect.width / 2;
            var centerY = rect.top + window.scrollY + rect.height / 2;
            fab.style.position = 'fixed';
            fab.style.left = (centerX - 28) + 'px';
            fab.style.top = (centerY - 28) + 'px';
            fab.style.transform = 'scale(0.64)';
            fab.style.zIndex = '10000';
            fab.style.pointerEvents = 'none';
            fab.style.opacity = '1';
        } else {
            Object.assign(fab.style, originalStyle);
            fab.style.opacity = '';
        }
    }

    updatePosition();
    window.addEventListener('scroll', function() { requestAnimationFrame(updatePosition); });
    window.addEventListener('resize', updatePosition);
}

// ========================================
// MODAL ISCRIZIONI
// ========================================
function initEnrollmentModal() {
    var enrollmentModal = document.getElementById('enrollmentModal');
    var closeBtn = document.getElementById('closeEnrollmentModal');

    if (!enrollmentModal) return;

    function openModal() {
        enrollmentModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        var grid = document.getElementById('enrollmentCoursesGrid');
        if (grid && grid.children.length === 0) {
            populateEnrollmentCourses();
        }
    }

    function closeModal() {
        enrollmentModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    document.querySelectorAll('[href="#contatti-info"]').forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            openModal();
        });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    var overlay = enrollmentModal.querySelector('.enrollment-modal-overlay');
    if (overlay) overlay.addEventListener('click', closeModal);

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && enrollmentModal.classList.contains('active')) {
            closeModal();
        }
    });
}

// ========================================
// POPOLA CORSI NEL MODAL
// ========================================
function populateEnrollmentCourses() {
    var grid = document.getElementById('enrollmentCoursesGrid');
    if (!grid) return;

    grid.innerHTML = '<p style="grid-column:1/-1; text-align:center; color:#999;">Caricamento corsi...</p>';

    var promises = Object.keys(ENROLLMENT_COURSES).map(function(courseId) {
        return getCourseAvailability(courseId).catch(function() {
            var info = ENROLLMENT_COURSES[courseId];
            return { courseId: courseId, confirmed: 0, available: info.max, isFull: false };
        });
    });

    Promise.all(promises).then(function(results) {
        grid.innerHTML = '';
        results.forEach(function(data) {
            var info = ENROLLMENT_COURSES[data.courseId];
            var availClass = data.isFull ? 'full' : data.available <= 2 ? 'limited' : 'available';
            var availText  = data.isFull ? '❌ Corso Pieno' : '✓ ' + data.available + ' posti liberi';

            grid.innerHTML +=
                '<div class="enrollment-course-option">' +
                    '<input type="radio" id="enrollment-course-' + data.courseId + '" name="courseId" value="' + data.courseId + '"' + (data.isFull ? ' disabled' : '') + '>' +
                    '<label for="enrollment-course-' + data.courseId + '" class="enrollment-course-label">' +
                        '<strong>' + info.name + '</strong>' +
                        '<small>' + info.age + '</small>' +
                        '<div class="enrollment-course-availability ' + availClass + '">' + availText + '</div>' +
                    '</label>' +
                '</div>';
        });
    });
}

// ========================================
// DISPONIBILITÀ DA FIREBASE
// ========================================
function getCourseAvailability(courseId) {
    return new Promise(function(resolve, reject) {
        var info = ENROLLMENT_COURSES[courseId];

        db.collection('enrollments')
            .where('courseId', '==', courseId)
            .where('status', '==', 'confermato')
            .get()
            .then(function(snapshot) {
                var confirmed = snapshot.size;
                var available = Math.max(0, info.max - confirmed);
                resolve({
                    courseId: courseId,
                    confirmed: confirmed,
                    available: available,
                    isFull: available === 0
                });
            })
            .catch(reject);
    });
}

// ========================================
// SUBMIT FORM ISCRIZIONI
// ========================================
function handleEnrollmentSubmit() {
    var successMsg  = document.getElementById('enrollmentSuccessMessage');
    var errorMsg    = document.getElementById('enrollmentErrorMessage');
    var waitlistMsg = document.getElementById('enrollmentWaitlistMessage');
    var submitBtn   = document.getElementById('enrollmentSubmitBtn');

    if (!submitBtn) return;

    if (successMsg)  successMsg.classList.remove('show');
    if (errorMsg)    errorMsg.classList.remove('show');
    if (waitlistMsg) waitlistMsg.classList.remove('show');

    submitBtn.disabled = true;
    submitBtn.innerHTML = '⏳ Elaborazione...';

    try {
        var courseRadio = document.querySelector('input[name="courseId"]:checked');
        if (!courseRadio) throw new Error('Seleziona un corso');

        var studentName  = document.getElementById('studentName');
        var studentAge   = document.getElementById('studentAge');
        var parentEmail  = document.getElementById('parentEmail');
        var privacy      = document.getElementById('privacy');

        if (!studentName.value || !studentAge.value || !parentEmail.value) {
            throw new Error('Completa tutti i campi obbligatori');
        }

        if (!privacy.checked) {
            throw new Error("Accetta l'informativa privacy per procedere");
        }

        var formData = {
            studentName:  studentName.value,
            studentAge:   studentAge.value,
            parentName:   document.getElementById('parentName').value,
            parentEmail:  parentEmail.value,
            parentPhone:  document.getElementById('parentPhone').value,
            schoolName:   document.getElementById('schoolName').value,
            courseId:     courseRadio.value,
            referral:     document.getElementById('referral').value,
            notes:        document.getElementById('notes').value
        };

        saveEnrollmentToFirebase(formData, successMsg, waitlistMsg, errorMsg, submitBtn);

    } catch (error) {
        console.error('Errore:', error);
        if (errorMsg) {
            document.getElementById('enrollmentErrorText').innerText = error.message || "Errore durante l'iscrizione. Riprova.";
            errorMsg.classList.add('show');
        }
        submitBtn.disabled = false;
        submitBtn.innerHTML = '✨ Iscriviti Subito!';
    }
}

// ========================================
// SALVA SU FIREBASE
// ========================================
function saveEnrollmentToFirebase(formData, successMsg, waitlistMsg, errorMsg, submitBtn) {
    var info = ENROLLMENT_COURSES[formData.courseId];

    db.collection('enrollments')
        .where('courseId', '==', formData.courseId)
        .where('status', '==', 'confermato')
        .get()
        .then(function(snapshot) {
            var confirmed = snapshot.size;
            var status = confirmed >= info.max ? 'in_attesa' : 'confermato';
            var waitlistPosition = status === 'in_attesa' ? (confirmed - info.max + 1) : null;

            return db.collection('enrollments').add({
                studentName:      formData.studentName,
                studentAge:       parseInt(formData.studentAge),
                parentName:       formData.parentName,
                parentEmail:      formData.parentEmail,
                parentPhone:      formData.parentPhone,
                schoolName:       formData.schoolName,
                courseId:         formData.courseId,
                courseName:       info.name,
                status:           status,
                waitlistPosition: waitlistPosition,
                paid:             false,
                referral:         formData.referral,
                notes:            formData.notes,
                enrollmentDate:   new Date()
            }).then(function() {

                if (status === 'in_attesa') {
                    document.getElementById('enrollmentWaitlistText').innerText =
                        "Sei in lista d'attesa (posizione " + waitlistPosition + "). Ti contatteremo se si libera un posto!";
                    if (waitlistMsg) waitlistMsg.classList.add('show');
                } else {
                    document.getElementById('enrollmentSuccessText').innerText =
                        'Iscrizione confermata! Riceverai email di conferma a ' + formData.parentEmail;
                    if (successMsg) successMsg.classList.add('show');
                }

                setTimeout(function() {
                    // Reset form fields
                    ['studentName','studentAge','parentName','parentEmail','parentPhone','schoolName','referral','notes'].forEach(function(id) {
                        var el = document.getElementById(id);
                        if (el) el.value = el.tagName === 'SELECT' ? el.options[0].value : '';
                    });
                    var grid = document.getElementById('enrollmentCoursesGrid');
                    if (grid) grid.innerHTML = '';

                    setTimeout(function() {
                        var modal = document.getElementById('enrollmentModal');
                        if (modal) {
                            modal.classList.remove('active');
                            document.body.style.overflow = 'auto';
                        }
                    }, 1000);
                }, 2500);

                submitBtn.disabled = false;
                submitBtn.innerHTML = '✨ Iscriviti Subito!';
            });
        })
        .catch(function(error) {
            console.error('Errore Firebase:', error);
            document.getElementById('enrollmentErrorText').innerText = 'Errore di connessione. Riprova.';
            if (errorMsg) errorMsg.classList.add('show');
            submitBtn.disabled = false;
            submitBtn.innerHTML = '✨ Iscriviti Subito!';
        });
}

// ========================================
// INIZIALIZZAZIONE
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    init();
});

window.addEventListener('error', function(e) {
    console.error('Errore JavaScript:', e.error);
});
