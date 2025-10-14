// Smooth scroll per i link di navigazione
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;

    const target = document.querySelector(targetId);
    if (target) {
      window.scrollTo({
        top: target.offsetTop - 70,
        behavior: 'smooth'
      });
    }
  });
});
// Apri popup al clic su una card
document.querySelectorAll('.tool-card').forEach((card, index) => {
  const popups = ['popup-spike', 'popup-roberta', 'popup-arduino', 'popup-microbit'];
  if (popups[index]) {
    card.addEventListener('click', () => {
      document.getElementById(popups[index]).style.display = 'block';
    });
  }
});

// Chiudi QUALSIASI popup quando si clicca sulla X
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('close-btn')) {
    const modal = e.target.closest('.modal');
    if (modal) {
      modal.style.display = 'none';
    }
  }
});

// Chiudi popup se si clicca fuori dal contenuto
window.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal')) {
    e.target.style.display = 'none';
  }
});
// Tema scuro
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Controlla se l'utente ha già scelto un tema
const currentTheme = localStorage.getItem('theme');
if (currentTheme === 'dark') {
  body.classList.add('dark-theme');
  themeToggle.textContent = '☀️'; // Sole = tema chiaro attivo
  themeToggle.setAttribute('aria-label', 'Attiva tema chiaro');
}

// Cambia tema al clic
themeToggle?.addEventListener('click', () => {
  body.classList.toggle('dark-theme');
  const isDark = body.classList.contains('dark-theme');
  
  if (isDark) {
    themeToggle.textContent = '☀️';
    themeToggle.setAttribute('aria-label', 'Attiva tema chiaro');
    localStorage.setItem('theme', 'dark');
  } else {
    themeToggle.textContent = '🌙';
    themeToggle.setAttribute('aria-label', 'Attiva tema scuro');
    localStorage.setItem('theme', 'light');
  }
});
