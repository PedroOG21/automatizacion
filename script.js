// Animaciones al hacer scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in').forEach(element => {
  observer.observe(element);
});

// Botón Volver Arriba
const scrollTopBtn = document.getElementById('scrollTopBtn');
window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    scrollTopBtn.style.display = 'block';
  } else {
    scrollTopBtn.style.display = 'none';
  }
});

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Formulario de contacto
const enviarBtn = document.getElementById('enviarBtn');
const mensajeConfirmacion = document.getElementById('mensajeConfirmacion');
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

// Smooth scroll para enlaces
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});

// Carrusel de QR
const carousel = document.getElementById('carousel');
let isDragging = false;
let startPos = 0;
let currentTranslate = 0;
let prevTranslate = 0;
let currentIndex = 0;

function setPosition() {
  carousel.style.transform = `translateX(${currentTranslate}px)`;
  updateActiveImage();
}

function updateActiveImage() {
  const totalImages = carousel.children.length;
  const containerWidth = carousel.parentElement.offsetWidth;
  const imageWidth = carousel.children[0].offsetWidth;
  const centerOffset = (containerWidth - imageWidth) / 2;
  const currentPosition = -currentTranslate + centerOffset;

  currentIndex = Math.round(currentPosition / imageWidth);
  currentIndex = Math.max(0, Math.min(currentIndex, totalImages - 1));

  Array.from(carousel.children).forEach((img, index) => {
    img.classList.remove('active', 'inactive');
    if (index === currentIndex) {
      img.classList.add('active');
    } else {
      img.classList.add('inactive');
    }
  });
}

carousel.addEventListener('mousedown', startDragging);
carousel.addEventListener('touchstart', startDragging);
carousel.addEventListener('mouseup', stopDragging);
carousel.addEventListener('touchend', stopDragging);
carousel.addEventListener('mousemove', drag);
carousel.addEventListener('touchmove', drag);
carousel.addEventListener('mouseleave', stopDragging);

function startDragging(e) {
  isDragging = true;
  carousel.style.cursor = 'grabbing';
  startPos = getPositionX(e);
  prevTranslate = currentTranslate;
}

function drag(e) {
  if (isDragging) {
    const currentPosition = getPositionX(e);
    currentTranslate = prevTranslate + currentPosition - startPos;
    setPosition();
  }
}

function stopDragging() {
  isDragging = false;
  carousel.style.cursor = 'grab';
  const totalImages = carousel.children.length;
  const imageWidth = carousel.children[0].offsetWidth;
  currentTranslate = -currentIndex * imageWidth;
  setPosition();
}

function getPositionX(e) {
  return e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
}

// Auto-slide every 10 seconds
setInterval(() => {
  const totalImages = carousel.children.length;
  currentIndex = (currentIndex + 1) % totalImages;
  const imageWidth = carousel.children[0].offsetWidth;
  currentTranslate = -currentIndex * imageWidth;
  setPosition();
}, 10000);

// Inicializar el carrusel
setPosition();