import createElement from '../../assets/lib/create-element.js';

export default class Modal {
  constructor() {
    this.#render();
  }

  #render() {
    this.elem = this.#createElement(`
      <div class="modal">
        <div class="modal__overlay"></div>
        <div class="modal__inner">
          <div class="modal__header">
            <button type="button" class="modal__close">
              <img src="/assets/images/icons/cross-icon.svg" alt="close-icon" />
            </button>
            <h3 class="modal__title">Вот сюда нужно добавлять заголовок</h3>
          </div>
          <div class="modal__body">
            A сюда нужно добавлять содержимое тела модального окна
          </div>
        </div>
      </div>
    `);
    this.elem.querySelector('.modal__close').addEventListener('click', () => this.close());
    
    this.handleKeyDown = (event) => {
      if (event.code === 'Escape') {
        this.close();
      }
    };
  }

  #createElement(template) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = template;
    return wrapper.firstElementChild;
  }

  open() {
    document.body.appendChild(this.elem);
    document.body.classList.add('is-modal-open');
    document.addEventListener('keydown', this.handleKeyDown);
  }

  close() {
    this.elem.remove();
    document.body.classList.remove('is-modal-open');
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  setTitle(title) {
    const titleElement = this.elem.querySelector('.modal__title');
    titleElement.textContent = title;
  }

  setBody(node) {
    const bodyElement = this.elem.querySelector('.modal__body');
    bodyElement.innerHTML = ''; 
    bodyElement.appendChild(node); 
  }
}
