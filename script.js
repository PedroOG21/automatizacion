// --------------------------
// Animaciones y scroll
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

// Formulario
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

// Smooth scroll para enlaces
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
  });
});

// --------------------------
// Carrusel
// --------------------------
const carouselWrapper = document.querySelector('.carousel-wrapper');
const carousel = document.getElementById('carousel');

if (carouselWrapper && carousel) {
  let isDown = false;
  let startX, scrollLeft;
  const images = Array.from(carousel.children);
  let currentIndex = 0;

  // Drag con ratón en escritorio
  carouselWrapper.addEventListener('mousedown', e => {
    isDown = true;
    startX = e.pageX - carouselWrapper.offsetLeft;
    scrollLeft = carouselWrapper.scrollLeft;
  });
  carouselWrapper.addEventListener('mouseleave', () => { isDown = false; });
  carouselWrapper.addEventListener('mouseup', () => { isDown = false; });
  carouselWrapper.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - carouselWrapper.offsetLeft;
    const walk = (x - startX) * 1.2; // factor arrastre
    carouselWrapper.scrollLeft = scrollLeft - walk;
  });

  // Actualiza imagen activa
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

  // Auto-slide infinito cada 10s
  function autoSlide() {
    currentIndex++;
    if (currentIndex >= images.length) currentIndex = 0;
    images[currentIndex].scrollIntoView({ behavior: 'smooth', inline: 'center' });
  }
  setInterval(autoSlide, 10000);

  // Scroll listener
  carouselWrapper.addEventListener('scroll', () => {
    requestAnimationFrame(updateActiveImage);
  });

  // Click en imagen para centrar
  images.forEach((img, i) => {
    img.addEventListener('click', () => {
      img.scrollIntoView({ behavior: 'smooth', inline: 'center' });
    });
  });

  // Inicializar
  setTimeout(updateActiveImage, 200);
  window.addEventListener('resize', () => setTimeout(updateActiveImage, 300));
}
