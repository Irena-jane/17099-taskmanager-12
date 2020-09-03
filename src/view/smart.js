import Abstract from "./abstract";

export default class Smart extends Abstract {
  constructor() {
    super();
    this._data = {};
  }
  updateElement() {
    let prevElement = this.getElement();
    const parent = prevElement.parentElement;
    this.removeElement();
    const newElement = this.getElement();
    parent.replaceChild(newElement, prevElement);
    prevElement = null;
    this._restoreHandlers();
  }
  updateData(update, justDataUpdating) {
    if (!update) {
      return;
    }
    this._data = Object.assign(
        {},
        this._data,
        update
    );
    if (justDataUpdating) {
      return;
    }
    this.updateElement();
  }
  restoreHandlers() {
    throw new Error(`Abstract method not implemented: restoreHandlers`);
  }

}
