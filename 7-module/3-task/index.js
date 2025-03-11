export default class StepSlider {
  constructor({ steps, value = 0 }) {
    this.steps = steps;
    this.value = value;
    this.render();
    this.#initDragAndKeyboardSupport();
  }
  render() {
    this.elem = this.#createSliderElement();
    this.thumb = this.#createThumbElement();
    this.progress = this.#createProgressElement();
    this.stepsElem = this.#createStepsElement();
    this.elem.appendChild(this.progress);
    this.elem.appendChild(this.stepsElem);
    this.elem.appendChild(this.thumb);
    this.elem.addEventListener('click', (event) => this.#onSliderClick(event));
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
    if (sliderWidth > 0) {
      const newValue = Math.round((clickPosition / sliderWidth) * (this.steps - 1));
      this.setValue(newValue);
    }
  }
  setValue(value) {
    this.value = Math.max(0, Math.min(value, this.steps - 1));
    this.#updateSlider();
    this.elem.dispatchEvent(new CustomEvent('slider-change', {
      detail: this.value,
      bubbles: true
    }));
  }
  #updateSlider() {
    this.valueElem.textContent = this.value;
    const leftPercents = (this.value / (this.steps - 1)) * 100;
    
    if (this.thumb) {
      this.thumb.style.left = `${leftPercents}%`;
    }
    if (this.progress) {
      this.progress.style.width = `${leftPercents}%`;
    }
    
    const steps = this.stepsElem.querySelectorAll('span');
    steps.forEach((step, index) => {
      step.classList.toggle('slider__step-active', index === this.value);
    });
  }
  #initDragAndKeyboardSupport() {
    this.thumb.addEventListener('mousedown', (event) => this.#onThumbMouseDown(event));
    this.thumb.addEventListener('touchstart', (event) => this.#onThumbMouseDown(event));
    document.addEventListener('keydown', (event) => this.#onKeyDown(event));
  }
  #onThumbMouseDown(event) {
    event.preventDefault();
    const onMouseMove = (moveEvent) => this.#onThumbMove(moveEvent);
    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }
  #onThumbMove(event) {
    const sliderRect = this.elem.getBoundingClientRect();
    const clickPosition = event.clientX - sliderRect.left;
    const sliderWidth = sliderRect.width;
    if (sliderWidth > 0) {
      const newValue = Math.round((clickPosition / sliderWidth) * (this.steps - 1));
      this.setValue(newValue);
    }
  }
  #onKeyDown(event) {
    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
      this.setValue(this.value + 1);
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
      this.setValue(this.value - 1);
    }
  }
}