const progressFill = document.getElementById('reading-progress-fill');
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const chapters = [...document.querySelectorAll('.chapter')];
const chapterLinks = [...document.querySelectorAll('.chapter-nav a')];

function updateProgress() {
  const total = document.documentElement.scrollHeight - window.innerHeight;
  progressFill.style.width = `${total > 0 ? Math.min(100, (window.scrollY / total) * 100) : 0}%`;
}

function closeMenu() {
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.textContent = 'Menu';
  mobileMenu.hidden = true;
  document.body.style.overflow = '';
}

menuToggle.addEventListener('click', () => {
  const opening = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(opening));
  menuToggle.textContent = opening ? 'Close' : 'Menu';
  mobileMenu.hidden = !opening;
  document.body.style.overflow = opening ? 'hidden' : '';
});
mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
window.addEventListener('resize', () => { if (window.innerWidth > 700) closeMenu(); });

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -5% 0px' });
document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));

const chapterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    chapterLinks.forEach(link => {
      const active = link.getAttribute('href') === `#${entry.target.id}`;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  });
}, { rootMargin: '-35% 0px -50% 0px' });
chapters.forEach(chapter => chapterObserver.observe(chapter));

window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();
