let calculator = {
  a: 0,
  b: 0,

  read: function (x, y) {
    this.a = x;
    this.b = y;
  },

  sum: function () {
    return this.a + this.b;
  },

  mul: function() {
    return this.a * this.b
  }

};

// НЕ УДАЛЯТЬ СТРОКУ, НУЖНА ДЛЯ ПРОВЕРКИ
window.calculator = calculator; // делает ваш калькулятор доступным глобально
