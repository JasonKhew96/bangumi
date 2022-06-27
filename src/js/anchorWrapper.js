import { Wrapper } from "./wrapper.js";

export class AnchorWrapper extends Wrapper {
  constructor(href, text, target = "_blank") {
    super("a", text);
    this.element.href = href;
    this.element.target = target;
  }
  static generate(href, text, target = "_blank") {
    return new AnchorWrapper(href, text, target);
  }
}
