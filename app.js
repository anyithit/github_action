let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const currentSlideSpan = document.getElementById('currentSlide');
const totalSlidesSpan = document.getElementById('totalSlides');
const progressFill = document.getElementById('progressFill');
const slideIndicatorsContainer = document.getElementById('slideIndicators');

totalSlidesSpan.textContent = totalSlides;

function createIndicators() {
  for (let i = 0; i < totalSlides; i++) {
    const indicator = document.createElement('div');
    indicator.classList.add('indicator');
    if (i === 0) indicator.classList.add('active');
    indicator.addEventListener('click', () => goToSlide(i));
    slideIndicatorsContainer.appendChild(indicator);
  }
}

function updateSlide() {
  slides.forEach((slide, index) => {
    slide.classList.remove('active', 'prev');
    
    if (index === currentSlide) {
      slide.classList.add('active');
    } else if (index < currentSlide) {
      slide.classList.add('prev');
    }
  });

  currentSlideSpan.textContent = currentSlide + 1;
  
  const progress = ((currentSlide) / (totalSlides - 1)) * 100;
  progressFill.style.width = progress + '%';

  prevBtn.disabled = currentSlide === 0;
  nextBtn.disabled = currentSlide === totalSlides - 1;

  const indicators = document.querySelectorAll('.indicator');
  indicators.forEach((indicator, index) => {
    indicator.classList.toggle('active', index === currentSlide);
  });
}

function nextSlide() {
  if (currentSlide < totalSlides - 1) {
    currentSlide++;
    updateSlide();
  }
}

function prevSlide() {
  if (currentSlide > 0) {
    currentSlide--;
    updateSlide();
  }
}

function goToSlide(index) {
  if (index >= 0 && index < totalSlides) {
    currentSlide = index;
    updateSlide();
  }
}

nextBtn.addEventListener('click', nextSlide);
prevBtn.addEventListener('click', prevSlide);

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') {
    e.preventDefault();
    nextSlide();
  } else if (e.key === 'ArrowLeft') {
    e.preventDefault();
    prevSlide();
  } else if (e.key === 'Home') {
    e.preventDefault();
    goToSlide(0);
  } else if (e.key === 'End') {
    e.preventDefault();
    goToSlide(totalSlides - 1);
  } else if (e.key >= '0' && e.key <= '9') {
    const slideNumber = parseInt(e.key);
    if (slideNumber === 0) {
      goToSlide(9);
    } else if (slideNumber <= totalSlides) {
      goToSlide(slideNumber - 1);
    }
  }
});

let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', (e) => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
});

function handleSwipe() {
  const swipeThreshold = 50;
  const diff = touchStartX - touchEndX;
  
  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      nextSlide();
    } else {
      prevSlide();
    }
  }
}

let wheelTimeout;
document.addEventListener('wheel', (e) => {
  clearTimeout(wheelTimeout);
  wheelTimeout = setTimeout(() => {
    if (e.deltaY > 0) {
      nextSlide();
    } else if (e.deltaY < 0) {
      prevSlide();
    }
  }, 50);
}, { passive: true });

createIndicators();
updateSlide();

document.addEventListener('DOMContentLoaded', () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
      }
    });
  }, {
    threshold: 0.1
  });

  document.querySelectorAll('.slide-content > *').forEach(el => {
    observer.observe(el);
  });
});

window.addEventListener('load', () => {
  document.body.style.opacity = '1';
});

const presentationContainer = document.querySelector('.presentation-container');
let isFullscreen = false;

document.addEventListener('keydown', (e) => {
  if (e.key === 'f' || e.key === 'F') {
    toggleFullscreen();
  } else if (e.key === 'Escape' && isFullscreen) {
    exitFullscreen();
  }
});

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    presentationContainer.requestFullscreen().then(() => {
      isFullscreen = true;
    }).catch(err => {
      console.log('Fullscreen request failed:', err);
    });
  } else {
    exitFullscreen();
  }
}

function exitFullscreen() {
  if (document.fullscreenElement) {
    document.exitFullscreen().then(() => {
      isFullscreen = false;
    });
  }
}

console.log('%c🚀 GitHub Actions Presentation', 'font-size: 20px; color: #2188ff; font-weight: bold;');
console.log('%cKeyboard Controls:', 'font-size: 14px; color: #3fb950; font-weight: bold;');
console.log('→ / Space / Enter : Next slide');
console.log('← : Previous slide');
console.log('Home : First slide');
console.log('End : Last slide');
console.log('F : Toggle fullscreen');
console.log('1-9 : Jump to slide number');
console.log('%cMouse/Touch Controls:', 'font-size: 14px; color: #3fb950; font-weight: bold;');
console.log('Swipe left/right : Navigate slides');
console.log('Scroll up/down : Navigate slides');
console.log('Click indicators : Jump to slide');