import {createElement} from "../utils/render";

export default class Abstract {
  constructor() {
    if (new.target === Abstract) {
      throw new Error(`Can't initiate Abstract class, only concrete one!`);
    }
    this._element = null;
    this._callback = {};
  }
  getTemplate() {
    throw new Error(`Abstract not impemented! - ${this.getTemplate.name}`);
  }
  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }
  removeElement() {
    this._element = null;
  }

}
