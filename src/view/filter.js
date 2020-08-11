import {createElement} from "../utils";

const createFilterItemTemplate = (filter, isChecked) => {
  const {name, count} = filter;
  return `<input
          type="radio"
          id="filter__${name}"
          class="filter__input visually-hidden"
          name="filter"
          ${isChecked ? `checked` : ``}
        />
        <label for="filter__${name}" class="filter__label">
          ${name} <span class="filter__${name}-count">${count}</span></label
        >`;
};

const createFilterTemplate = (filters) => {
  const filterItemsTemplate = filters.map((filter, i) => createFilterItemTemplate(filter, i === 0)).join(``);

  return (
    `<section class="main__filter filter container">
        ${filterItemsTemplate}
      </section>`
  );
};

export default class Filter {
  constructor(filters) {
    this._element = null;
    this._filters = filters;
  }
  getTemplate() {
    return createFilterTemplate(this._filters);
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
