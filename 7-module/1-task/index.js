import createElement from '../../assets/lib/create-element.js';
export default class RibbonMenu {

  #categories;
  #currentActiveId;
  #elem;
  constructor(categories) {
    this.#categories = categories;
    this.#currentActiveId = categories[0].id; 
    this.#render();
  }

  #render() {
    this.#elem = createElement(`
      <div class="ribbon">
        <button class="ribbon__arrow ribbon__arrow_left ribbon__arrow_visible">
          <img src="/assets/images/icons/angle-left-icon.svg" alt="icon">
        </button>
        <div class="ribbon__inner">
          ${this.#categories.map(category => `
            <a href="#" class="ribbon__item" data-id="${category.id}">${category.name}</a>
          `).join('')}
        </div>
        <button class="ribbon__arrow ribbon__arrow_right ribbon__arrow_visible">
          <img src="/assets/images/icons/angle-right-icon.svg" alt="icon">
        </button>
      </div>
    `);
    this.#initCarousel();
  }

  #initCarousel() {
    const ribbonInner = this.#elem.querySelector('.ribbon__inner');
    const arrowLeft = this.#elem.querySelector('.ribbon__arrow_left');
    const arrowRight = this.#elem.querySelector('.ribbon__arrow_right');

    arrowLeft.addEventListener('click', () => {
      ribbonInner.scrollBy(-350, 0);
    });
    arrowRight.addEventListener('click', () => {
      ribbonInner.scrollBy(350, 0);
    });

    ribbonInner.addEventListener('scroll', () => {
      this.#updateArrows();
    });

    this.#elem.querySelectorAll('.ribbon__item').forEach(item => {
      item.addEventListener('click', (event) => {
        event.preventDefault();
        this.#selectCategory(item);
      });
    });
    this.#updateArrows(); 
  }

  #updateArrows() {
    const ribbonInner = this.#elem.querySelector('.ribbon__inner');
    const arrowLeft = this.#elem.querySelector('.ribbon__arrow_left');
    const arrowRight = this.#elem.querySelector('.ribbon__arrow_right');
    const scrollLeft = ribbonInner.scrollLeft;
    const scrollWidth = ribbonInner.scrollWidth;
    const clientWidth = ribbonInner.clientWidth;
    const scrollRight = scrollWidth - scrollLeft - clientWidth;
    arrowLeft.classList.toggle('ribbon__arrow_visible', scrollLeft > 0);
    arrowRight.classList.toggle('ribbon__arrow_visible', scrollRight > 1);
  }

  #selectCategory(item) {

    const activeItem = this.#elem.querySelector('.ribbon__item_active');
    if (activeItem) {
      activeItem.classList.remove('ribbon__item_active');
    }

    item.classList.add('ribbon__item_active');
    this.#currentActiveId = item.dataset.id;

    const event = new CustomEvent('ribbon-select', {
      detail: this.#currentActiveId,
      bubbles: true,
    });
    this.#elem.dispatchEvent(event);
  }

  get elem() {
    return this.#elem;
  }
}