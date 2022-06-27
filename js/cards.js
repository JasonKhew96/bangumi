import { HomeCard } from "./card.js";

export class HomeCards extends HTMLElement {
  constructor() {
    super();
    this.classList.add("cards");
  }
  addCard(href, text, callback) {
    this.appendChild(HomeCard.generate().build(href, text, callback));
    return this;
  }
  static generate() {
    return new HomeCards();
  }
}

export const registerHomeCards = () =>
  customElements.define("home-cards", HomeCards);
