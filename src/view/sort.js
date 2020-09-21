import Abstract from "./abstract";
import {SortType} from "../const";

const createSortTemplate = (currentSortType) => {
  return (
    `<div class="board__filter-list">
        <a href="#" class="board__filter ${currentSortType === SortType.DEFAULT ? `board__filter--active` : ``}" data-sort-type="${SortType.DEFAULT}">SORT BY DEFAULT</a>
        <a href="#" class="board__filter ${currentSortType === SortType.DATE_UP ? `board__filter--active` : ``}" data-sort-type="${SortType.DATE_UP}">SORT BY DATE up</a>
        <a href="#" class="board__filter ${currentSortType === SortType.DATE_DOWN ? `board__filter--active` : ``}" data-sort-type="${SortType.DATE_DOWN}">SORT BY DATE down</a>
      </div>`
  );
};

export default class Sort extends Abstract {
  constructor(currentSortType) {
    super();
    this._currentSortType = currentSortType;
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }
  getTemplate() {
    return createSortTemplate(this._currentSortType);
  }
  _sortTypeChangeHandler(e) {
    if (e.target.tagName !== `A`) {
      return;
    }
    e.preventDefault();
    this._callback.sortTypeChange(e.target.dataset.sortType);
  }
  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener(`click`, this._sortTypeChangeHandler);
  }
}
