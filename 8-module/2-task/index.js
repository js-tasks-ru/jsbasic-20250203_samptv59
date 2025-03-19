import createElement from '../../assets/lib/create-element.js';
import ProductCard from '../../6-module/2-task/index.js';

export default class ProductGrid {
  constructor(products) {
    this.products = products;
    this.filters = {};
    this.elem = this.render();
    this.updateProductCards(); // Изначально отображаем все товары
  }

  // Метод для создания корневого элемента списка товаров
  render() {
    const container = createElement(`
      <div class="products-grid">
        <div class="products-grid__inner">
          <!--ВОТ ТУТ БУДУТ КАРТОЧКИ ТОВАРОВ-->
        </div>
      </div>
    `);
    
    return container;
  }

  // Метод для обновления отображаемых карточек товаров
  updateProductCards() {
    const innerContainer = this.elem.querySelector('.products-grid__inner');
    innerContainer.innerHTML = ''; // Очищаем контейнер перед добавлением новых карточек

    const filteredProducts = this.getFilteredProducts();
    
    filteredProducts.forEach(product => {
      const productCard = new ProductCard(product);
      innerContainer.append(productCard.elem); // Добавляем карточку товара в контейнер
    });
  }

  // Метод для получения отфильтрованных товаров
  getFilteredProducts() {
    return this.products.filter(product => {
      // Проверка на наличие орехов
      if (this.filters.noNuts && (product.nuts === true)) {
        return false; // Исключаем товары с орехами
      }
      // Проверка на вегетарианство
      if (this.filters.vegeterianOnly && product.vegeterian !== true) {
        return false; // Исключаем не вегетарианские товары
      }
      // Проверка на остроту
      if (this.filters.maxSpiciness !== undefined && product.spiciness > this.filters.maxSpiciness) {
        return false; // Исключаем товары с остротой выше максимальной
      }
      // Проверка на категорию
      if (this.filters.category && product.category !== this.filters.category) {
        return false; // Исключаем товары, не соответствующие категории
      }
      return true; // Если все проверки пройдены, товар подходит
    });
  }
  
  // Метод для обновления фильтров
  updateFilter(filters) {
    Object.assign(this.filters, filters); // Обновляем текущие фильтры
    this.updateProductCards(); // Обновляем отображаемые карточки товаров
  }
}
