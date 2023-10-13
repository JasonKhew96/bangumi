import { Wrapper } from "./wrapper.js";

export class ModalDialog extends Wrapper {
    constructor() {
        super("dialog");
        this.addClass("modal-dialog");
        this.setOnClickListener(() => {
            this.element.close();
        });
    }

    build(text) {
        this.html = "";
        const content = Wrapper.generate("p", text).addClass("modal-dialog-content");
        this.appendChild(content);
        return this;
    }

    static generate() {
        return new ModalDialog();
    }
}

export const registerModalDialog = () =>
  customElements.define("modal-dialog", ModalDialog);
