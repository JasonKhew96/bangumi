export class Wrapper {
  constructor(element, text = "", display = true) {
    this.element = document.createElement(element);
    this.html = text;
    this.display = !display;
    this.toggleDisplay();
  }
  get html() {
    return this.element.innerHTML;
  }
  set html(text) {
    this.element.innerHTML = text;
  }
  setAttribute(name, value) {
    this.element.setAttribute(name, value);
    return this;
  }
  setOnClickListener(callback) {
    this.element.addEventListener("click", () => callback());
    return this;
  }
  showSelectable() {
    this.element.style.cursor = "pointer";
    return this;
  }
  addClass(className) {
    this.element.classList.add(className);
    return this;
  }
  toggleDisplay() {
    this.display = !this.display;
    this.element.style.display = this.display ? "" : "none";
    return this;
  }
  appendChild(child) {
    this.element.appendChild(child.element);
    return this;
  }
  createChild(element, text = "", display = true) {
    var wrapper = new Wrapper(element, text, display);
    this.appendChild(wrapper);
    return this;
  }
  static generate(element, text = "", display = true) {
    return new Wrapper(element, text, display);
  }
}
