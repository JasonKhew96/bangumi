export class AppFooter extends HTMLElement {
  constructor() {
    super();
    this.classList.add("footer");
  }

  setText(text) {
    this.innerHTML = text
  }

  static generate() {
    return new AppFooter();
  }
}

export const registerAppFooter = () =>
  customElements.define("app-footer", AppFooter);
