// Interacciones principales del sitio de la Lic. Alejandra Streitenberger
// Funciones: menú hamburguesa, scroll suave, acordeón FAQ, validación de formulario, mensaje de éxito, año dinámico.

document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const nav = document.querySelector('.main-nav');
  const toggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelectorAll('nav a[href^="#"]');
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  const accordionItems = document.querySelectorAll('.accordion-item');
  const form = document.getElementById('contact-form');
  const formMessage = document.querySelector('.form-message');
  const yearEl = document.getElementById('year');

  // Menú hamburguesa funcional
  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    body.classList.toggle('nav-open', isOpen);
  });

  // Cerrar menú al seleccionar un enlace
  navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const targetId = link.getAttribute('href');
      smoothScroll(targetId);
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      body.classList.remove('nav-open');
    });
  });

  // Scroll suave para todos los enlaces internos
  anchorLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('href');
      if (targetId.startsWith('#') && targetId.length > 1) {
        event.preventDefault();
        smoothScroll(targetId);
      }
    });
  });

  // Scroll suave personalizado
  const smoothScroll = (selector) => {
    const target = document.querySelector(selector);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Acordeón FAQ
  accordionItems.forEach((item) => {
    item.addEventListener('click', () => {
      const isExpanded = item.getAttribute('aria-expanded') === 'true';
      accordionItems.forEach((el) => el.setAttribute('aria-expanded', 'false'));
      item.setAttribute('aria-expanded', String(!isExpanded));
    });
  });

  // Validación mínima del formulario y envío real
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const fields = form.querySelectorAll('[required]');
    const submitButton = form.querySelector('button[type="submit"]');
    let isValid = true;

    fields.forEach((field) => {
      const value = field.value.trim();
      if (!value) {
        isValid = false;
        field.classList.add('invalid');
      } else {
        field.classList.remove('invalid');
      }
    });

    if (!isValid) {
      formMessage.textContent = 'Completá los datos obligatorios para continuar.';
      formMessage.style.color = '#e11d48';
      return;
    }

    if (!form.action) {
      formMessage.textContent = 'No se pudo enviar tu consulta en este momento. Por favor, intentá nuevamente en unos minutos.';
      formMessage.style.color = '#e11d48';
      return;
    }

    submitButton.disabled = true;
    const defaultLabel = submitButton.textContent;
    submitButton.textContent = 'Enviando...';
    formMessage.textContent = '';

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        body: new FormData(form),
      });

      if (!response.ok) {
        throw new Error('Error en el envío');
      }

      formMessage.style.color = '#27ae60';
      formMessage.textContent = '¡Gracias! Tu consulta fue enviada con éxito. Me contactaré a la brevedad.';
      form.reset();
    } catch (error) {
      formMessage.style.color = '#e11d48';
      formMessage.textContent = 'No pudimos enviar tu consulta. Revisá tu conexión e intentá nuevamente o escribime por WhatsApp.';
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = defaultLabel;
    }
  });

  // Año automático en el footer
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
});
