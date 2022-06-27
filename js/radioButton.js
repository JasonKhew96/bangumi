import { Wrapper } from "./wrapper.js";

export class RadioButton extends HTMLElement {
  constructor() {
    super("div");
    this.classList.add("card");
    this._choices = [];
    this.choice = 0;
  }

  addRadio(name, text, value) {
    const input = Wrapper.generate("input");
    input.element.type = "radio";
    input.element.name = name;
    input.element.id = text;
    input.element.addEventListener("click", () => {
      this.choice = value;
    });

    if (this._choices.length == 0) {
      input.element.checked = true;
    }

    const label = Wrapper.generate("label");
    label.element.innerText = text;
    label.setAttribute("for", text);

    this.appendChild(input.element);
    this.appendChild(label.element);

    this._choices.push(value);
    return this;
  }

  static generate() {
    return new RadioButton();
  }
}

export const registerRadioButton = () =>
  customElements.define("radio-button", RadioButton);
