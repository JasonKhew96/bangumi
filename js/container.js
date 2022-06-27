export class AppContainer extends HTMLElement {
  constructor() {
    super();
    this.classList.add("container");
  }

  build(header, body, footer) {
    this.appendChild(header);
    this.appendChild(body);
    this.appendChild(footer);
    return this;
  }

  static generate() {
    return new AppContainer();
  }
}

export const registerAppContainer = () =>
  customElements.define("app-container", AppContainer);
