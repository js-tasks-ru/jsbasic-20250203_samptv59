export default class StepSlider {
  constructor({ steps, value = 0 }) {
    this.steps = steps;
    this.value = value;
    this.render();
  }

  render() {
    this.elem = this.#createSliderElement();
    this.thumb = this.#createThumbElement();
    this.progress = this.#createProgressElement();
    this.stepsElem = this.#createStepsElement();
    
    this.elem.appendChild(this.thumb);
    this.elem.appendChild(this.progress);
    this.elem.appendChild(this.stepsElem);
    
    this.elem.addEventListener('click', (event) => this.#onSliderClick(event));
    
    this.thumb.ondragstart = () => false; 
    this.thumb.addEventListener('pointerdown', (event) => this.#onThumbPointerDown(event));
    this.elem.addEventListener('pointerup', () => this.#onPointerUp());
    this.elem.addEventListener('pointermove', (event) => this.#onPointerMove(event));
    
    this.#updateSlider();
  }

  #createSliderElement() {
    const slider = document.createElement('div');
    slider.className = 'slider';
    return slider;
  }

  #createThumbElement() {
    const thumb = document.createElement('div');
    thumb.className = 'slider__thumb';
    this.valueElem = document.createElement('span');
    this.valueElem.className = 'slider__value';
    this.valueElem.textContent = this.value;
    thumb.appendChild(this.valueElem);
    return thumb;
  }

  #createProgressElement() {
    const progress = document.createElement('div');
    progress.className = 'slider__progress';
    return progress;
  }

  #createStepsElement() {
    const stepsElem = document.createElement('div');
    stepsElem.className = 'slider__steps';
    for (let i = 0; i < this.steps; i++) {
      const step = document.createElement('span');
      if (i === this.value) {
        step.className = 'slider__step-active';
      }
      stepsElem.appendChild(step);
    }
    return stepsElem;
  }

  #onSliderClick(event) {
    const sliderRect = this.elem.getBoundingClientRect();
    const clickPosition = event.clientX - sliderRect.left;
    const sliderWidth = sliderRect.width;
    const newValue = Math.round((clickPosition / sliderWidth) * (this.steps - 1));
    this.setValue(newValue);
  }

  #onThumbPointerDown(event) {
    event.preventDefault(); // Предотвращаем стандартное поведение
    this.elem.classList.add('slider_dragging');
    this.#onPointerMove(event); // Начинаем перемещение сразу при нажатии
  }

  #onPointerMove(event) {
    const sliderRect = this.elem.getBoundingClientRect();
    let left = event.clientX - sliderRect.left;
    let leftRelative = left / sliderRect.width;
    leftRelative = Math.max(0, Math.min(1, leftRelative)); // Ограничиваем значения от 0 до 1
    
    let segments = this.steps - 1;
    let approximateValue = leftRelative * segments;
    let value = Math.round(approximateValue);
    
    this.setValue(value); // Обновляем значение здесь
    
    let leftPercents = leftRelative * 100;
    this.thumb.style.left = `${leftPercents}%`;
    this.progress.style.width = `${leftPercents}%`;
  }

  #onPointerUp() {
    this.elem.classList.remove('slider_dragging');
  }

  setValue(value) {
    this.value = value;
    this.#updateSlider(); // Обновляем слайдер
    this.elem.dispatchEvent(new CustomEvent('slider-change', {
      detail: this.value,
      bubbles: true
    }));
  }

  #updateSlider() {
    this.valueElem.textContent = this.value;
    const leftPercents = (this.value / (this.steps - 1)) * 100;
    this.thumb.style.left = `${leftPercents}%`;
    this.progress.style.width = `${leftPercents}%`;
    
    const steps = this.stepsElem.querySelectorAll('span');
    steps.forEach((step, index) => {
      step.classList.toggle('slider__step-active', index === this.value);
    });
  }
}
