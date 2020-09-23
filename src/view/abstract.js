import {createElement} from "../utils/render";
const SHAKE_ANIMATION_TIMEOUT = 600;

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
  /* shake(callback) {
    this.getElement().classList.add(`shake`);
    setTimeout(() => {
      this.getElement().classList.remove(`shake`);
      callback();
    }, SHAKE_ANIMATION_TIMEOUT);
  } */
  shake(callback) {
    this.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    this.getElement().style.zIndex = 20;
    setTimeout(() => {
      this.getElement().style.animation = ``;
      this.getElement().style.zIndex = `initial`;
      callback();
    }, SHAKE_ANIMATION_TIMEOUT);
  }

}
