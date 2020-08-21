import {humanizeDate, getTimeFromDate, isDateExpired, isTaskRepeating, createElement} from "../utils";

const createTaskTemplate = (task) => {

  const {color, description, dueDate, repeating, isArchive, isFavorite} = task;

  const date = dueDate !== null ?
    humanizeDate(dueDate) : ``;

  const time = getTimeFromDate(dueDate);
  const hasDeadlineClass = isDateExpired(dueDate) ? ` card--deadline` : ``;

  const hasArchiveClass = isArchive ?
    `card__btn--archive card__btn--disabled` : `card__btn--archive`;
  const hasFavoriteClass = isFavorite ?
    `card__btn--favorites card__btn--disabled` : `card__btn--favorites`;

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

export default class Task {
  constructor(task) {
    this._task = task;
    this._element = null;
  }
  getTemplate() {
    return createTaskTemplate(this._task);
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
