import Abstract from "./abstract";
import {MenuItem} from "../const";

const createSiteMenuTemplate = () => {
  return (
    `<section class="control__btn-wrap">
          <input
            type="radio"
            name="control"
            id="control__new-task"
            class="control__input visually-hidden"
            value="${MenuItem.ADD_NEW_TASK}"
          />
          <label for="control__new-task" class="control__label control__label--new-task"
            >+ ADD NEW TASK</label
          >
          <input
            type="radio"
            name="control"
            id="control__task"
            class="control__input visually-hidden"
            value="${MenuItem.TASKS}"
            checked
          />
          <label for="control__task" class="control__label">TASKS</label>
          <input
            type="radio"
            name="control"
            id="control__statistic"
            class="control__input visually-hidden"
            value="${MenuItem.STATICTICS}"
          />
          <label for="control__statistic" class="control__label"
            >STATISTICS</label
          >
        </section>`
  );
};

export default class SiteMenu extends Abstract {
  constructor() {
    super();
    this._menuClickHandler = this._menuClickHandler.bind(this);
  }
  getTemplate() {
    return createSiteMenuTemplate();
  }
  _menuClickHandler(e) {
    e.preventDefault();
    this._callback.menuClick(e.target.value);
  }
  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener(`change`, this._menuClickHandler);
  }
  setMenuItem(menuItem) {
    const item = this.getElement().querySelector(`[value=${menuItem}]`);
    if (item !== null) {
      item.checked = true;
    }
  }
}
