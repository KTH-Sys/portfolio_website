/* ========================================
   MAIN JS - Portfolio
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  // --- Typing Effect ---
  const typedEl = document.getElementById('typed-text');
  const phrases = [
    'Computer Science @ UC Davis',
    'Full-Stack Developer',
    'Poet & Problem Solver',
  ];
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
    const current = phrases[phraseIndex];
    if (isDeleting) {
      typedEl.textContent = current.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typedEl.textContent = current.substring(0, charIndex + 1);
      charIndex++;
    }

    let delay = isDeleting ? 40 : 80;

    if (!isDeleting && charIndex === current.length) {
      delay = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = 500;
    }

    setTimeout(type, delay);
  }

  type();

  // --- Mobile Navigation ---
  const toggle = document.querySelector('.mobile-nav-toggle');
  const header = document.getElementById('header');
  const navMenu = document.querySelector('.nav-menu');

  function closeMobileNav() {
    navMenu.classList.remove('open');
    toggle.querySelector('i').className = 'bi bi-list';
  }

  toggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    toggle.querySelector('i').className = isOpen ? 'bi bi-x' : 'bi bi-list';
  });

  // --- Header scroll effect ---
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  });

  // Close nav on link click (mobile)
  document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', closeMobileNav);
  });

  // --- Active Nav Link on Scroll ---
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-menu ul li');

  function updateActiveNav() {
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 100;
      if (window.scrollY >= top) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(li => {
      li.classList.remove('active');
      const href = li.querySelector('a').getAttribute('href');
      if (href === '#' + current) {
        li.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav);
  updateActiveNav();

  // --- Project Filters ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      projectCards.forEach(card => {
        if (filter === 'all' || card.dataset.category.includes(filter)) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // --- Scroll Reveal ---
  const revealElements = document.querySelectorAll(
    '.section-title, .about-grid, .skills-category, .resume-item, .project-card, .contact-item, .contact-form-wrapper'
  );

  revealElements.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  revealElements.forEach(el => observer.observe(el));

  // --- Contact Form (prevent default) ---
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = 'Message Sent!';
      btn.style.background = '#4caf50';
      btn.style.borderColor = '#4caf50';
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.style.borderColor = '';
        form.reset();
      }, 2000);
    });
  }

});
