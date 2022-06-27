import { Wrapper } from "./wrapper.js";

export class HomeCard extends HTMLElement {
  constructor() {
    super("div");
    this.classList.add("card");
  }

  build(img, subtitle, callback) {
    const imgElement = Wrapper.generate("img")
      .addClass("card-img")
      .setAttribute("src", img);
    this.appendChild(imgElement.element);
    const subtitleElement = Wrapper.generate("div").addClass("card-subtitle");
    subtitleElement.html = subtitle;
    this.appendChild(subtitleElement.element);

    this.addEventListener("click", callback);

    return this;
  }

  static generate() {
    return new HomeCard();
  }
}

export const registerHomeCard = () =>
  customElements.define("home-card", HomeCard);
