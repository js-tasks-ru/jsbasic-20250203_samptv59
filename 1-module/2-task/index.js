/**
 * Эту функцию трогать не нужно
 */
function print(text) {
  console.log(text);
}

/**
 * Эту функцию нужно поменять так,
 * чтобы функция sayHello работала корректно
 */
function isValid(name) {
  if (typeof name !== 'string' || name.trim() === '') {
    return false;
  }

  name = name.trim();
  const validNamePattern = /^[A-Za-zА-Яа-яЁё]+$/;

  return name.length >= 4 && validNamePattern.test(name);
}

function sayHello() {
  let userName = prompt('Введите ваше имя');

  if (isValid(userName)) {
    print(`Welcome back, ${userName}!`);
  } else {
    print('Некорректное имя');
  }
}
