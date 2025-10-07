// --------------------------
// Animaciones, formulario y scroll suave (sin tocar)
// --------------------------
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// Botón Volver Arriba
const scrollTopBtn = document.getElementById('scrollTopBtn');
window.addEventListener('scroll', () => {
  scrollTopBtn.style.display = window.scrollY > 300 ? 'block' : 'none';
});
scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// Formulario de contacto (visual)
const enviarBtn = document.getElementById('enviarBtn');
const mensajeConfirmacion = document.getElementById('mensajeConfirmacion');
if (enviarBtn) {
  enviarBtn.addEventListener('click', () => {
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const mensaje = document.getElementById('mensaje').value;

    if (nombre && email && mensaje) {
      mensajeConfirmacion.classList.remove('hidden');
      setTimeout(() => {
        mensajeConfirmacion.classList.add('hidden');
        document.getElementById('nombre').value = '';
        document.getElementById('email').value = '';
        document.getElementById('mensaje').value = '';
      }, 3000);
    } else {
      alert('Por favor, completa todos los campos.');
    }
  });
}

// Smooth scroll para enlaces internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
  });
});

// --------------------------
// Carrusel: uso de scroll-snap + JS que marca la imagen más centrada como `.active`
// --------------------------
const carouselWrapper = document.querySelector('.carousel-wrapper');
const carousel = document.getElementById('carousel');

if (carouselWrapper && carousel) {
  const images = Array.from(carousel.children);
  let currentIndex = 0;
  let rafId = null;

  // Marca la imagen más céntrica como active / inactive
  function updateActiveImage() {
    const wrapperRect = carouselWrapper.getBoundingClientRect();
    const centerX = wrapperRect.left + wrapperRect.width / 2;
    let closestIndex = 0;
    let minDistance = Infinity;

    images.forEach((img, i) => {
      const r = img.getBoundingClientRect();
      const imgCenter = r.left + r.width / 2;
      const dist = Math.abs(imgCenter - centerX);
      if (dist < minDistance) {
        minDistance = dist;
        closestIndex = i;
      }
    });

    images.forEach((img, i) => {
      img.classList.toggle('active', i === closestIndex);
      img.classList.toggle('inactive', i !== closestIndex);
    });

    currentIndex = closestIndex;
  }

  // Debounce con requestAnimationFrame para el scroll
  function onScroll() {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      updateActiveImage();
      rafId = null;
    });
  }

  // Inicial: centra la primera imagen y marca estados
  function initCarousel() {
    // Si hay muchas imágenes, centra la primera visible
    if (images.length > 0) images[0].scrollIntoView({ inline: 'center' });
    // Pequeño timeout para que el browser calcule medidas
    setTimeout(updateActiveImage, 80);
  }

  // Click sobre imagen para centrarla
  images.forEach((img, i) => {
    img.addEventListener('click', () => {
      img.scrollIntoView({ behavior: 'smooth', inline: 'center' });
      // updateActiveImage() se llamará por el evento scroll
    });
  });

  // Auto-slide suave cada 10s (se puede comentar si no quieres auto)
  let autoSlideTimer = setInterval(() => {
    if (images.length === 0) return;
    const next = (currentIndex + 1) % images.length;
    images[next].scrollIntoView({ behavior: 'smooth', inline: 'center' });
  }, 10000);

  // Parar auto-slide cuando el usuario interactúa manualmente (útil en móvil)
  carouselWrapper.addEventListener('touchstart', () => clearInterval(autoSlideTimer), { passive: true });
  carouselWrapper.addEventListener('pointerdown', () => clearInterval(autoSlideTimer), { passive: true });

  // Escuchar scroll
  carouselWrapper.addEventListener('scroll', onScroll, { passive: true });

  // Inicializa
  initCarousel();

  // Si la ventana cambia de tamaño recalculamos (y re-marcamos)
  window.addEventListener('resize', () => {
    // permitimos que el layout se estabilice
    setTimeout(() => updateActiveImage(), 120);
  });
}
