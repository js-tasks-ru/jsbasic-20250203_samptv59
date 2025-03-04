import createElement from '../../assets/lib/create-element.js';

export default class Carousel {
  // Приватные свойства
  #slides;
  #currentSlideIndex;
  #elem;

  constructor(slides) {
    this.#slides = slides;
    this.#currentSlideIndex = 0;
    this.#render();
  }

  // Приватный метод для создания DOM-структуры
  #render() {
    this.#elem = document.createElement('div');
    this.#elem.classList.add('carousel');

    const slidesHTML = this.#slides.map(slide => `
      <div class="carousel__slide" data-id="${slide.id}">
        <img src="/assets/images/carousel/${slide.image}" class="carousel__img" alt="slide">
        <div class="carousel__caption">
          <span class="carousel__price">€${slide.price.toFixed(2)}</span>
          <div class="carousel__title">${slide.name}</div>
          <button type="button" class="carousel__button">
            <img src="/assets/images/icons/plus-icon.svg" alt="icon">
          </button>
        </div>
      </div>
    `).join('');

    this.#elem.innerHTML = `
      <div class="carousel__inner">
        ${slidesHTML}
      </div>
      <button class="carousel__arrow carousel__arrow_left">
        <img src="/assets/images/icons/angle-left-icon.svg" alt="icon">
      </button>
      <button class="carousel__arrow carousel__arrow_right">
        <img src="/assets/images/icons/angle-right-icon.svg" alt="icon">
      </button>
    `;

    this.#initCarousel();
  }

  // Приватный метод для инициализации карусели
  #initCarousel() {
    const arrowLeft = this.#elem.querySelector('.carousel__arrow_left');
    const arrowRight = this.#elem.querySelector('.carousel__arrow_right');

    arrowLeft.addEventListener('click', () => this.#changeSlide(-1));
    arrowRight.addEventListener('click', () => this.#changeSlide(1));

    this.#elem.querySelectorAll('.carousel__button').forEach(button => {
      button.addEventListener('click', () => {
        const slideId = button.closest('.carousel__slide').dataset.id;
        const event = new CustomEvent('product-add', {
          detail: slideId,
          bubbles: true,
        });
        this.#elem.dispatchEvent(event);
      });
    });

    this.#updateArrows();
  }

  // Приватный метод для переключения слайдов
  #changeSlide(step) {
    this.#currentSlideIndex += step;
    const inner = this.#elem.querySelector('.carousel__inner');
    inner.style.transform = `translateX(-${this.#currentSlideIndex * 500}px)`;
    this.#updateArrows();
  }

  // Приватный метод для обновления состояния кнопок
  #updateArrows() {
    const arrowLeft = this.#elem.querySelector('.carousel__arrow_left');
    const arrowRight = this.#elem.querySelector('.carousel__arrow_right');

    arrowLeft.style.display = this.#currentSlideIndex === 0 ? 'none' : '';
    arrowRight.style.display = this.#currentSlideIndex === this.#slides.length - 1 ? 'none' : '';
  }

  // Публичный геттер для получения элемента карусели
  get elem() {
    return this.#elem;
  }
}
