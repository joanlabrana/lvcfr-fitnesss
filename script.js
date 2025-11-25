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

  // Validación mínima del formulario y envío con FormSubmit (compatible con GitHub/Vercel)
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const fields = form.querySelectorAll('[required]');
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

    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'Enviando...';
    formMessage.textContent = '';

    try {
      const payload = {
        nombre: form.nombre.value.trim(),
        email: form.email.value.trim(),
        empresa: form.empresa.value.trim(),
        mensaje: form.mensaje.value.trim(),
        _subject: 'Nueva consulta desde la web',
        _captcha: 'false',
      };

      const response = await fetch('https://formsubmit.co/ajax/nutri_alee@outlook.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('No se pudo enviar el formulario.');
      }

      formMessage.style.color = '#27ae60';
      formMessage.textContent = '¡Gracias! Tu consulta fue enviada con éxito. Revisá tu correo para la copia.';
      form.reset();
    } catch (error) {
      formMessage.style.color = '#e11d48';
      formMessage.textContent = 'Hubo un inconveniente al enviar. Intentá nuevamente en unos segundos.';
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = 'Enviar consulta';
    }
  });

  /*
    Si preferís EmailJS en lugar de FormSubmit:
    1) Incluí el script de EmailJS en index.html antes de script.js:
       <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/emailjs-com@3/dist/email.min.js"></script>
    2) Inicializá con tu publicKey: emailjs.init('TU_PUBLIC_KEY');
    3) Reemplazá el bloque fetch anterior por:
       await emailjs.send('TU_SERVICE_ID', 'TU_TEMPLATE_ID', payload);
    Variables a reemplazar: TU_SERVICE_ID, TU_TEMPLATE_ID y TU_PUBLIC_KEY.
  */

  // Año automático en el footer
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
});
