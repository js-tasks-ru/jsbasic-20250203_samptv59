export default class Cart {
  cartItems = []; // [{ product: {...}, count: N }]

  constructor(cartIcon) {
    this.cartIcon = cartIcon;
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

  onProductUpdate(cartItem) {
    this.cartIcon.update(this);
  }
}
