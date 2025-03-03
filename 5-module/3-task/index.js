function initCarousel() {
  const carouselInner = document.querySelector('.carousel__inner');
  const slides = document.querySelectorAll('.carousel__slide');
  const arrowRight = document.querySelector('.carousel__arrow_right');
  const arrowLeft = document.querySelector('.carousel__arrow_left');

  const slideCount = slides.length;
  let slideIndex = 0;
  const slideWidth = slides[0].offsetWidth; // Ширина одного слайда в пикселях

  function updateSlider() {
    const offset = -slideIndex * slideWidth;
    carouselInner.style.transform = `translateX(${offset}px)`;

    // Скрываем или показываем стрелки
    arrowLeft.style.display = slideIndex === 0 ? 'none' : '';
    arrowRight.style.display = slideIndex === slideCount - 1 ? 'none' : '';
  }

  function showPreviousSlide() {
    if (slideIndex > 0) {
      slideIndex--;
      updateSlider();
    }
  }

  function showNextSlide() {
    if (slideIndex < slideCount - 1) {
      slideIndex++;
      updateSlider();
    }
  }

  arrowRight.addEventListener('click', showNextSlide);
  arrowLeft.addEventListener('click', showPreviousSlide);

  updateSlider(); // Установить правильное положение при загрузке
}
