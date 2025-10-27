const navToggle = document.querySelector('.nav-toggle');
const navList = document.querySelector('.nav-list');
const yearHolder = document.getElementById('year');

if (navToggle && navList) {
  navToggle.addEventListener('click', () => {
    const isOpen = navList.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', isOpen);
  });

  navList.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navList.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

if (yearHolder) {
  yearHolder.textContent = new Date().getFullYear();
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const targetId = entry.target.getAttribute('id');
      const navItem = document.querySelector(`.nav-list a[href="#${targetId}"]`);
      if (!navItem) return;

      if (entry.isIntersecting) {
        document
          .querySelectorAll('.nav-list a.active')
          .forEach((item) => item.classList.remove('active'));
        navItem.classList.add('active');
      }
    });
  },
  {
    rootMargin: '-40% 0px -50% 0px',
    threshold: 0.2,
  }
);

['inicio', 'servicios', 'precios', 'contacto', 'condiciones'].forEach((id) => {
  const section = document.getElementById(id);
  if (section) {
    observer.observe(section);
  }
});
