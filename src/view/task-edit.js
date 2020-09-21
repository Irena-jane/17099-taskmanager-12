import he from "he";
import SmartView from "./smart";
import {COLORS} from "../const";


import flatpickr from "flatpickr";
import "../../node_modules/flatpickr/dist/flatpickr.min.css";
import "../../node_modules/flatpickr/dist/themes/light.css";

import {formatTaskDueDate, isTaskRepeating} from "../utils/task";

const createTaskEditDateTemplate = (dueDate, isDueDate) => {

  return `<button class="card__date-deadline-toggle" type="button">
                  date: <span class="card__date-status">
                  ${isDueDate ? `yes` : `no`}</span>
                </button>

                ${isDueDate ? `<fieldset class="card__date-deadline">
                  <label class="card__input-deadline-wrap">
                    <input
                      class="card__date"
                      type="text"
                      placeholder=""
                      name="date"
                      value="${formatTaskDueDate(dueDate)}"
                    />
                  </label>
                </fieldset>` : ``}`;
};

const createTaskEditRepeatingTemplate = (repeating, isRepeating) => {

  return `<button class="card__repeat-toggle" type="button">
            repeat:<span class="card__repeat-status">
            ${isRepeating ? `yes` : `no`}</span>
          </button>
          ${isRepeating ? `<fieldset class="card__repeat-days">
                <div class="card__repeat-days-inner">
                ${Object.entries(repeating).map(([day, repeat]) => `<input
                    class="visually-hidden card__repeat-day-input"
                    type="checkbox"
                    id="repeat-${day}-4"
                    name="repeat"
                    value="${day}"
                    ${repeat ? `checked` : ``}
                  />
                  <label class="card__repeat-day" for="repeat-${day}-4"
                    >${day}</label>`).join(``)}
                  </div>
              </fieldset>` : ``}`;

};
const createTaskEditColorsTemplate = (currentColor) => {

  return `<div class="card__colors-inner">
              <h3 class="card__colors-title">Color</h3>
              <div class="card__colors-wrap">
              ${COLORS.map((color) => `<input
                  type="radio"
                  id="color-${color}-4"
                  class="card__color-input card__color-input--${color} visually-hidden"
                  name="color"
                  value="${color}"
                  ${currentColor === color ? `checked` : ``}
                />
                <label
                  for="color-${color}-4"
                  class="card__color card__color--${color}"
                  >${color}</label>`)}

              </div>
            </div>`;
};

const createTaskEditTemplate = (data) => {
  const {color, description, dueDate, repeating, isDueDate, isRepeating} = data;

  const hasRepeatingClass = isTaskRepeating(repeating) ?
    ` card--repeat` : ``;

  const dateTemplate = createTaskEditDateTemplate(dueDate, isDueDate);
  const repeatingTemplate = createTaskEditRepeatingTemplate(repeating, isRepeating);
  const colorsTemplate = createTaskEditColorsTemplate(color);

  const isSubmitDisabled = (isDueDate && dueDate === null)
  || (isRepeating && !isTaskRepeating(repeating));

  return (
    `<article class="card card--edit card--${color} ${hasRepeatingClass}">
      <form class="card__form" method="get">
        <div class="card__inner">
          <div class="card__color-bar">
            <svg class="card__color-bar-wave" width="100%" height="10">
              <use xlink:href="#wave"></use>
            </svg>
          </div>

          <div class="card__textarea-wrap">
            <label>
              <textarea
                class="card__text"
                placeholder="Start typing your text here..."
                name="text"
              >${he.encode(description)}</textarea>
            </label>
          </div>

          <div class="card__settings">
            <div class="card__details">
              <div class="card__dates">
                ${dateTemplate}
                ${repeatingTemplate}

              </div>
            </div>

            ${colorsTemplate}

          </div>

          <div class="card__status-btns">
            <button class="card__save" ${isSubmitDisabled ? `disabled` : ``} type="submit">save</button>
            <button class="card__delete" type="button">delete</button>
          </div>
        </div>
      </form>
    </article>`
  );
};
const BLANK_TASK = {
  color: `black`,
  description: ``,
  dueDate: null,
  repeating: {
    mo: false,
    tu: false,
    we: false,
    th: false,
    fr: false,
    sa: false,
    su: false
  },
  isFavorite: false,
  isArchive: false
};

export default class TaskEdit extends SmartView {
  constructor(task = BLANK_TASK) {
    super();
    this._data = TaskEdit.parseTaskToData(task);
    this._datepicker = null;

    this._formSubmitHandler = this._formSubmitHandler.bind(this);

    this._dueDateChangeHandler = this._dueDateChangeHandler.bind(this);

    this._dueDateToggleHandler = this._dueDateToggleHandler.bind(this);
    this._repeatingToggleHandler = this._repeatingToggleHandler.bind(this);
    this._descriptionInputHandler = this._descriptionInputHandler.bind(this);
    this._colorChangeHandler = this._colorChangeHandler.bind(this);
    this._repeatingChangeHandler = this._repeatingChangeHandler.bind(this);
    this._formDeleteClickHandler = this._formDeleteClickHandler.bind(this);

    this.setDatepicker();
    this._setInnerHandlers();
  }
  removeElement() {
    super.removeElement();
    if (this._datepicker) {
      this._datepicker.destroy();
      this._datepicker = null;
    }
  }
  getTemplate() {
    return createTaskEditTemplate(this._data);
  }
  setDatepicker() {
    if (this._datepicker) {
      this._datepicker.destroy();
      this._datepicker = null;
    }
    if (this._data.isDueDate) {
      flatpickr(this.getElement().querySelector(`.card__date`),
          {
            dateFormat: `j F`,
            defaultDate: this._data.dueDate,
            onChange: this._dueDateChangeHandler
          }
      );
    }
  }
  _dueDateChangeHandler([userDate]) {
    userDate.setHours(23, 59, 59, 999);
    this.updateData({
      dueDate: userDate
    });
  }
  reset(task) {
    this.updateData(TaskEdit.parseTaskToData(task));
  }
  _formSubmitHandler(e) {
    e.preventDefault();
    this._callback.formSubmit(TaskEdit.parseDataToTask(this._data));
  }
  _formDeleteClickHandler(e) {
    e.preventDefault();
    this._callback.deleteClick(TaskEdit.parseDataToTask(this._data));
  }
  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector(`form`).addEventListener(`submit`, this._formSubmitHandler);
  }
  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelector(`.card__delete`).addEventListener(`click`, this._formDeleteClickHandler);
  }
  _setInnerHandlers() {
    const element = this.getElement();
    if (this._data.isRepeating) {
      element
        .querySelector(`.card__repeat-days-inner`)
        .addEventListener(`change`, this._repeatingChangeHandler);
    }
    element
      .querySelector(`.card__date-deadline-toggle`)
      .addEventListener(`click`, this._dueDateToggleHandler);
    element
      .querySelector(`.card__repeat-toggle`)
      .addEventListener(`click`, this._repeatingToggleHandler);
    element
      .querySelector(`.card__text`)
      .addEventListener(`input`, this._descriptionInputHandler);
    element
      .querySelector(`.card__colors-wrap`)
      .addEventListener(`change`, this._colorChangeHandler);
  }
  restoreHandlers() {
    this._setInnerHandlers();
    this.setDatepicker();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setDeleteClickHandler(this._callback.deleteClick);
  }
  _descriptionInputHandler(e) {
    e.preventDefault();
    this.updateData({
      description: e.target.value
    }, true);
  }
  _colorChangeHandler(e) {
    e.preventDefault();
    this.updateData({
      color: e.target.value
    });
  }
  _repeatingChangeHandler(e) {
    e.preventDefault();
    this.updateData({
      repeating: Object.assign(
          {},
          this._data.repeating,
          {
            [e.target.value]: e.target.checked
          }
      )
    });
  }
  _dueDateToggleHandler(e) {
    e.preventDefault();
    this.updateData({
      isDueDate: !this._data.isDueDate,
      isRepeating: !this._data.isDueDate && false
    });
  }
  _repeatingToggleHandler(e) {
    e.preventDefault();
    this.updateData({
      isRepeating: !this._data.isRepeating,
      isDueDate: !this._data.isRepeating && false
    });
  }
  static parseTaskToData(task) {
    return Object.assign(
        {},
        task,
        {
          isDueDate: task.dueDate !== null,
          isRepeating: isTaskRepeating(task.repeating)
        }
    );
  }
  static parseDataToTask(data) {
    // перезаписываем dueDate и repeating for task
    // удаляем isDueDate & isRepeating
    if (!data.isDueDate) {
      data.dueDate = null;
    }
    if (!data.isRepeating) {
      data.repeating = {
        mo: false,
        tu: false,
        we: false,
        th: false,
        fr: false,
        sa: false,
        su: false
      };
    }
    delete data.isDueDate;
    delete data.isRepeating;
    return data;
  }

}

