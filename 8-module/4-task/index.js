import createElement from '../../assets/lib/create-element.js';
import escapeHtml from '../../assets/lib/escape-html.js';
import Modal from '../../7-module/2-task/index.js';

export default class Cart {
  cartItems = []; // [product: {...}, count: N]

  constructor(cartIcon) {
    this.cartIcon = cartIcon;
    this.addEventListeners();
  }

  addProduct(product) {
    if (!product) return;
    let cartItem = this.cartItems.find(item => item.product.id === product.id);
    if (cartItem) {
      cartItem.count += 1;
    } else {
      cartItem = { product, count: 1 };
      this.cartItems.push(cartItem);
    }
    this.onProductUpdate(cartItem);
  }

  updateProductCount(productId, amount) {
    let cartItemIndex = this.cartItems.findIndex(item => item.product.id === productId);
    if (cartItemIndex !== -1) {
      let cartItem = this.cartItems[cartItemIndex];
      cartItem.count += amount;
      if (cartItem.count <= 0) {
        this.cartItems.splice(cartItemIndex, 1);
        cartItem = null; // Чтобы корректно обновить корзину после удаления товара
      }
      this.onProductUpdate(cartItem);
    }
  }

  isEmpty() {
    return this.cartItems.length === 0;
  }

  getTotalCount() {
    return this.cartItems.reduce((total, item) => total + item.count, 0);
  }

  getTotalPrice() {
    return this.cartItems.reduce((total, item) => total + item.product.price * item.count, 0);
  }

  renderProduct(product, count) {
    return createElement(`
      <div class="cart-product" data-product-id="${product.id}">
        <div class="cart-product__img">
          <img src="/assets/images/products/${product.image}" alt="product">
        </div>
        <div class="cart-product__info">
          <div class="cart-product__title">${escapeHtml(product.name)}</div>
          <div class="cart-product__price-wrap">
            <div class="cart-counter">
              <button type="button" class="cart-counter__button cart-counter__button_minus">
                <img src="/assets/images/icons/square-minus-icon.svg" alt="minus">
              </button>
              <span class="cart-counter__count">${count}</span>
              <button type="button" class="cart-counter__button cart-counter__button_plus">
                <img src="/assets/images/icons/square-plus-icon.svg" alt="plus">
              </button>
            </div>
            <div class="cart-product__price">€${product.price.toFixed(2)}</div>
          </div>
        </div>
      </div>`);
  }

  renderOrderForm() {
    return createElement(`<form class="cart-form">
      <h5 class="cart-form__title">Delivery</h5>
      <div class="cart-form__group cart-form__group_row">
        <input name="name" type="text" class="cart-form__input" placeholder="Name" required value="Santa Claus">
        <input name="email" type="email" class="cart-form__input" placeholder="Email" required value="john@gmail.com">
        <input name="tel" type="tel" class="cart-form__input" placeholder="Phone" required value="+1234567">
      </div>
      <div class="cart-form__group">
        <input name="address" type="text" class="cart-form__input" placeholder="Address" required value="North, Lapland, Snow Home">
      </div>
      <div class="cart-buttons">
        <div class="cart-buttons__buttons btn-group">
          <div class="cart-buttons__info">
            <span class="cart-buttons__info-text">total</span>
            <span class="cart-buttons__info-price">€${this.getTotalPrice().toFixed(2)}</span>
          </div>
          <button type="submit" class="cart-buttons__button btn-group__button button">order</button>
        </div>
      </div>
    </form>`);
  }

  renderModal() {
    const modal = new Modal();
    modal.setTitle('Your order'); // Устанавливаем заголовок модального окна
    modal.open();
  
    const modalBody = modal.elem.querySelector('.modal__body');
    if (!modalBody) return;
  
    // Добавляем товары из корзины
    const productsContainer = createElement('<div class="cart-products"></div>');
    this.cartItems.forEach(item => {
      const productElement = this.renderProduct(item.product, item.count);
      productsContainer.append(productElement);
    });
    modalBody.append(productsContainer);
  
    // Добавляем форму для оформления заказа
    const orderFormContainer = this.renderOrderForm();
    modalBody.append(orderFormContainer);
  
    // Делегирование событий для кнопок изменения количества товара
    modalBody.addEventListener('click', (event) => {
      const target = event.target;
      if (target.closest('.cart-counter__button_minus')) {
        const productId = target.closest('.cart-product').dataset.productId;
        this.updateProductCount(productId, -1);
      } else if (target.closest('.cart-counter__button_plus')) {
        const productId = target.closest('.cart-product').dataset.productId;
        this.updateProductCount(productId, 1);
      }
    });
  
    // Обработчик для события submit на форме
    const form = modalBody.querySelector('.cart-form');
    if (form) {
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        this.onSubmit(event);
      });
    }
  }

  onProductUpdate(cartItem) {
    this.cartIcon.update(this);
  
    const modalBody = document.querySelector('.modal__body');
    if (!modalBody || !document.body.classList.contains('is-modal-open')) return;
  
    if (cartItem) {
      const productId = cartItem.product.id;
      const productCount = modalBody.querySelector(`[data-product-id="${productId}"] .cart-counter__count`);
      const productPrice = modalBody.querySelector(`[data-product-id="${productId}"] .cart-product__price`);
      const infoPrice = modalBody.querySelector('.cart-buttons__info-price');
  
      if (cartItem.count <= 0) {
        const productElement = modalBody.querySelector(`[data-product-id="${productId}"]`);
        if (productElement) {
          productElement.remove();
        }
      } else {
        if (productCount) {
          productCount.innerHTML = cartItem.count;
        }
        const totalProductPrice = (cartItem.product.price * cartItem.count).toFixed(2);
        if (productPrice) {
          productPrice.innerHTML = `€${totalProductPrice}`;
        }
      }
  
      const totalCartPrice = this.getTotalPrice().toFixed(2);
      if (infoPrice) {
        infoPrice.innerHTML = `€${totalCartPrice}`;
      }
    }
  
    if (this.isEmpty()) {
      const modal = document.querySelector('.modal');
      if (modal) {
        modal.remove(); // Закрываем модальное окно
      }
    }
  }

  async onSubmit(event) {
    event.preventDefault();
    const submitButton = event.target.querySelector('button[type="submit"]');
    if (submitButton) {
        submitButton.classList.add('is-loading');
    }

    const formElem = event.target;

    try {
        const response = await fetch('https://httpbin.org/post', {
            method: 'POST',
            body: new FormData(formElem)
        });

        if (!response.ok) {
            throw new Error(`Ошибка при отправке заказа: ${response.status}`);
        }

        await response.json();

        // Очищаем корзину
        this.cartItems = [];
        this.cartIcon.update(this.cartItems.length);

        // Находим модальное окно
        const modal = document.querySelector('.modal');
        if (!modal) return;

        // Меняем заголовок модального окна
        const modalTitle = modal.querySelector('.modal__title');
        if (modalTitle) {
            modalTitle.textContent = 'Success!';
        }

        // Обновляем содержимое модального окна
        const modalBody = modal.querySelector('.modal__body');
        if (modalBody) {
            modalBody.innerHTML = `
                <div class="modal__body-inner">
                    <p>
                        Order successful! Your order is being cooked :) <br>
                        We’ll notify you about delivery time shortly.<br>
                        <img src="/assets/images/delivery.gif">
                    </p>
                </div>
            `;
        }
    } catch (error) {
        console.error(error);
        alert('Произошла ошибка при отправке заказа. Пожалуйста, попробуйте еще раз.');
    } finally {
        if (submitButton) {
            submitButton.classList.remove('is-loading');
        }
    }
}


  addEventListeners() {
    this.cartIcon.elem.onclick = () => this.renderModal();
  }
}