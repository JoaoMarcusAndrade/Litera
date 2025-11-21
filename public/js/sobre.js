document.addEventListener('DOMContentLoaded', function() {
  const track = document.querySelector('.testimonials-track');
  const items = track.children;
  const totalSlides = 5; // 5 unique slides
  const dots = document.querySelectorAll('.testimonials-indicadores .dot');
  let currentIndex = 0;

  function updateCarousel() {
    const itemWidth = items[0].offsetWidth + 20; // width + gap
    track.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
    dots.forEach((dot, i) => dot.classList.toggle('active', i === (currentIndex % totalSlides)));
  }

  // Auto slide every 3 seconds
  setInterval(() => {
    currentIndex++;
    if (currentIndex >= 6) { // after duplicate
      track.style.transition = 'none';
      currentIndex = 0;
      track.style.transform = `translateX(0)`;
      setTimeout(() => {
        track.style.transition = 'transform 0.3s ease';
      }, 50);
    } else {
      updateCarousel();
    }
  }, 3000);

  // Click on dots to jump to specific slide
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      currentIndex = i;
      updateCarousel();
    });
  });
});