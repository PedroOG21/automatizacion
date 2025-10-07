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
const carouselWrapper = document.getElementById('qr-carousel');
const carousel = document.getElementById('carousel');
let isDragging = false;
let startPos = 0;
let currentTranslate = 0;
let prevTranslate = 0;
let currentIndex = 0;
let animationID = null;
let vel = 0;
let lastPos = 0;
let lastTime = 0;
let totalOriginal = 0;
let imageWidth = 0;
let centerOffset = 0;
let totalImages = 0;
let cloneCount = 1; // Para infinito

function setPosition(smooth = true) {
  carousel.style.transition = smooth ? 'transform 0.3s ease-out' : 'none';
  carousel.style.transform = `translateX(${currentTranslate}px)`;
  updateActiveImage();
}

function updateActiveImage() {
  const images = Array.from(carousel.children);
  const containerWidth = carouselWrapper.offsetWidth;
  const currentPosition = -currentTranslate + centerOffset;

  currentIndex = Math.round(currentPosition / imageWidth);
  currentIndex = Math.max(0, Math.min(currentIndex, totalImages - 1));

  images.forEach((img, index) => {
    img.classList.remove('active', 'inactive');
    if (index === currentIndex) {
      img.classList.add('active');   // centrada → nítida
    } else {
      img.classList.add('inactive'); // laterales → pixeladas
    }
  });
}

function startDragging(e) {
  isDragging = true;
  carousel.style.cursor = 'grabbing';
  startPos = getPositionX(e);
  prevTranslate = currentTranslate;
  carousel.style.transition = 'none';
  if (animationID) cancelAnimationFrame(animationID);
  lastPos = startPos;
  lastTime = performance.now();
  vel = 0;
}

function drag(e) {
  if (isDragging) {
    const currentPos = getPositionX(e);
    const now = performance.now();
    const deltaTime = now - lastTime;
    if (deltaTime > 0) {
      vel = (currentPos - lastPos) / deltaTime * 20;
    }
    lastPos = currentPos;
    lastTime = now;
    currentTranslate = prevTranslate + currentPos - startPos;
    setPosition(false);
  }
}

function stopDragging() {
  if (!isDragging) return;
  isDragging = false;
  carousel.style.cursor = 'grab';
  if (Math.abs(vel) > 1) {
    animateMomentum(vel);
  } else {
    snapToNearest();
  }
}

function animateMomentum(initialVel) {
  let vel = initialVel;
  let lastTime = performance.now();
  function loop(now) {
    const deltaTime = (now - lastTime) / 16;
    lastTime = now;
    currentTranslate += vel * deltaTime;
    setPosition(false);
    vel *= 0.95;
    if (Math.abs(vel) > 0.5) {
      animationID = requestAnimationFrame(loop);
    } else {
      snapToNearest();
    }
    const minTranslate = - (totalImages - 1) * imageWidth;
    if (currentTranslate > 0) {
      currentTranslate -= totalOriginal * imageWidth;
    } else if (currentTranslate < minTranslate) {
      currentTranslate += totalOriginal * imageWidth;
    }
  }
  animationID = requestAnimationFrame(loop);
}

function snapToNearest() {
  currentIndex = Math.round(-currentTranslate / imageWidth);
  currentIndex = Math.max(0, Math.min(currentIndex, totalImages - 1));
  currentTranslate = -currentIndex * imageWidth;
  setPosition(true);
  handleWrapAround();
}

function handleWrapAround() {
  if (currentIndex < cloneCount) {
    currentIndex += totalOriginal;
    currentTranslate = -currentIndex * imageWidth;
    setPosition(false);
  } else if (currentIndex >= totalOriginal + cloneCount) {
    currentIndex -= totalOriginal;
    currentTranslate = -currentIndex * imageWidth;
    setPosition(false);
  }
  updateActiveImage();
}

function getPositionX(e) {
  return e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
}

function autoSlide() {
  currentIndex += 1;
  currentTranslate = -currentIndex * imageWidth;
  setPosition(true);
  carousel.addEventListener('transitionend', checkReset, { once: true });
  animationID = setTimeout(autoSlide, 10000);
}

function checkReset() {
  if (currentIndex >= totalOriginal + cloneCount) {
    currentIndex -= totalOriginal;
    currentTranslate = -currentIndex * imageWidth;
    setPosition(false);
  }
}

// Inicializar el carrusel
function initCarousel() {
  const images = Array.from(carousel.children);
  totalOriginal = images.length;
  imageWidth = images[0].offsetWidth + 30;
  const containerWidth = carouselWrapper.offsetWidth;
  centerOffset = (containerWidth - imageWidth) / 2;

  for (let i = 0; i < cloneCount; i++) {
    const lastClone = images[totalOriginal - 1 - i].cloneNode(true);
    carousel.prepend(lastClone);
    const firstClone = images[i].cloneNode(true);
    carousel.appendChild(firstClone);
  }

  totalImages = totalOriginal + 2 * cloneCount;
  currentIndex = cloneCount;
  currentTranslate = -currentIndex * imageWidth;
  setPosition(false);

  animationID = setTimeout(autoSlide, 10000);
}

// Event listeners
carousel.addEventListener('mousedown', startDragging);
carousel.addEventListener('touchstart', startDragging);
carousel.addEventListener('mouseup', stopDragging);
carousel.addEventListener('touchend', stopDragging);
carousel.addEventListener('mousemove', drag);
carousel.addEventListener('touchmove', drag, { passive: false });
carousel.addEventListener('mouseleave', stopDragging);

// Inicializar
initCarousel();
