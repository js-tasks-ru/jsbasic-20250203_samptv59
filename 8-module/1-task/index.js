import createElement from '../../assets/lib/create-element.js';

export default class CartIcon {
  constructor() {
    this.render();
    this.addEventListeners();
    this.initialTopCoord = null; // Начальная координата верхнего края иконки
  }

  render() {
    this.elem = createElement('<div class="cart-icon"></div>');
  }

  update(cart) {
    if (!cart.isEmpty()) {
      this.elem.classList.add('cart-icon_visible');

      this.elem.innerHTML = `
        <div class="cart-icon__inner">
          <span class="cart-icon__count">${cart.getTotalCount()}</span>
          <span class="cart-icon__price">€${cart.getTotalPrice().toFixed(2)}</span>
        </div>`;

      this.updatePosition();

      this.elem.classList.add('shake');
      this.elem.addEventListener('transitionend', () => {
        this.elem.classList.remove('shake');
      }, { once: true });

    } else {
      this.elem.classList.remove('cart-icon_visible');
    }
  }

  addEventListeners() {
    document.addEventListener('scroll', () => this.updatePosition());
    window.addEventListener('resize', () => this.updatePosition());
  }

  updatePosition() {
    if (!this.elem.offsetHeight) return; // Если иконка не видима, выходим

    // Если ширина окна ≤ 767px, сбрасываем стили и выходим
    if (document.documentElement.clientWidth <= 767) {
      Object.assign(this.elem.style, {
        position: '',
        top: '',
        left: '',
        zIndex: '',
      });
      return;
    }

    // Если начальная координата не задана, вычисляем её
    if (!this.initialTopCoord) {
      this.initialTopCoord = this.elem.getBoundingClientRect().top + window.pageYOffset;
    }

    // Если прокрутка страницы больше начальной координаты, фиксируем иконку
    if (window.pageYOffset > this.initialTopCoord) {
      // Вычисляем отступ по горизонтали
      const container = document.querySelector('.container');
      if (!container) return; // Если контейнер не найден, выходим

      const containerRight = container.getBoundingClientRect().right;
      const iconWidth = this.elem.offsetWidth;
      const leftIndent = Math.min(
        containerRight + 20, // 20px справа от контейнера
        document.documentElement.clientWidth - iconWidth - 10 // 10px от правого края окна
      );

      // Применяем стили для фиксированного позиционирования
      Object.assign(this.elem.style, {
        position: 'fixed',
        top: '50px',
        zIndex: 1000,
        left: `${leftIndent}px`,
      });

    } else {
      // Если прокрутка меньше начальной координаты, сбрасываем стили
      Object.assign(this.elem.style, {
        position: '',
        top: '',
        left: '',
        zIndex: '',
      });
    }
  }
}