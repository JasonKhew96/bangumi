import { Wrapper } from "./wrapper.js";

export class AppHeader extends HTMLElement {
  constructor() {
    super();
    this.classList.add("header");
  }

  build(title, callback) {
    const titleElement = Wrapper.generate("item")
      .addClass("header-title")
      .addClass("header-item")
      .setOnClickListener(callback);
    titleElement.html = title;
    this.innerHTML = "";
    this.appendChild(titleElement.element);
    return this;
  }

  addSubmenu(text, callback) {
    const item = Wrapper.generate("item")
      .addClass("header-text")
      .addClass("header-item");
    item.html = text;
    item.setOnClickListener(callback);
    this.appendChild(item.element);
    return this;
  }

  static generate() {
    return new AppHeader();
  }
}

export const registerAppHeader = () =>
  customElements.define("app-header", AppHeader);
