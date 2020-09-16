import Abstract from "./abstract";

import {humanizeDate, getTimeFromDate, isDateExpired, isTaskRepeating} from "../utils/task";


const createTaskTemplate = (task) => {

  const {color, description, dueDate, repeating, isArchive, isFavorite} = task;

  const date = dueDate !== null ?
    humanizeDate(dueDate) : ``;

  const time = getTimeFromDate(dueDate);
  const hasDeadlineClass = isDateExpired(dueDate) ? ` card--deadline` : ``;

  const hasArchiveClass = isArchive ?
    `card__btn--archive` : `card__btn--archive card__btn--disabled`;
  const hasFavoriteClass = isFavorite ?
    `card__btn--favorites` : `card__btn--favorites card__btn--disabled`;

  const hasRepeatingClass = isTaskRepeating(repeating) ? ` card--repeat` : ``;

  return (
    `<article class="card card--${color} ${hasDeadlineClass} ${hasRepeatingClass}">
            <div class="card__form">
              <div class="card__inner">
                <div class="card__control">
                  <button type="button" class="card__btn card__btn--edit">
                    edit
                  </button>
                  <button type="button" class="card__btn ${hasArchiveClass}">
                    archive
                  </button>
                  <button
                    type="button"
                    class="card__btn ${hasFavoriteClass}"
                  >
                    favorites
                  </button>
                </div>

                <div class="card__color-bar">
                  <svg class="card__color-bar-wave" width="100%" height="10">
                    <use xlink:href="#wave"></use>
                  </svg>
                </div>

                <div class="card__textarea-wrap">
                  <p class="card__text">${description}</p>
                </div>

                <div class="card__settings">
                  <div class="card__details">
                    <div class="card__dates">
                      <div class="card__date-deadline">
                        <p class="card__input-deadline-wrap">
                          <span class="card__date">${date}</span>
                          <span class="card__time">${time}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>`
  );
};

export default class Task extends Abstract {
  constructor(task) {
    super();
    this._task = task;
    this._editClickHandler = this._editClickHandler.bind(this);
    this._archiveClickHandler = this._archiveClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
  }
  getTemplate() {
    return createTaskTemplate(this._task);
  }
  _editClickHandler(e) {
    e.preventDefault();
    this._callback.click();
  }
  _favoriteClickHandler(e) {
    e.preventDefault();
    this._callback.favoriteClick();
  }
  _archiveClickHandler(e) {
    e.preventDefault();
    this._callback.archiveClick();
  }
  setEditClickHandler(callback) {
    this._callback.click = callback;
    this.getElement().querySelector(`.card__btn--edit`).addEventListener(`click`, this._editClickHandler);
  }
  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector(`.card__btn--favorites`).addEventListener(`click`, this._favoriteClickHandler);
  }
  setArchiveClickHandler(callback) {
    this._callback.archiveClick = callback;
    this.getElement().querySelector(`.card__btn--archive`).addEventListener(`click`, this._archiveClickHandler);
  }
}
