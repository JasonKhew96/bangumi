export class AppHome extends HTMLElement {
  constructor() {
    super();
    this.classList.add("main");
  }
  static generate() {
    return new AppHome();
  }
}

export const registerAppHome = () =>
  customElements.define("app-home", AppHome);
