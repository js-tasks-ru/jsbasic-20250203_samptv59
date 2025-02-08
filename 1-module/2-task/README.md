# Допишите функцию валидации имени пользователя

Необходимо, чтобы на сайте можно было поприветствовать только пользователей,
которые удовлетворяют следующему условию - *имя не пустое, без пробелов, минимум 4 символа*.

```js
/**
 * Эту функцию трогать не нужно
 */
function print(text) {
  console.log(text);
}

/**
 * Эту функцию нужно поменять так,
 * чтобы функция sayHello работала корректно
 * @param {string | null} name
 * @returns {boolean}
 */
function isValid(name) {
  if (typeof name !== 'string' || name.trim() === '') {
    return false;
  }

  name = name.trim();
  const validNamePattern = /^[A-Za-zА-Яа-яЁё]+$/;

  return name.length >= 4 && validNamePattern.test(name);
}

/**
 * Эту функцию трогать не нужно
 */
function sayHello() {
  let userName = prompt('Введите ваше имя');

  if (isValid(userName)) {
    print(`Welcome back, ${userName}!`);
  } else {
    print('Некорректное имя');
  }
}

sayHello();
```


