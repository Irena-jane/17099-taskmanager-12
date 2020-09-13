import TaskView from "../view/task";
import TaskEditView from "../view/task-edit";

import {render, replace, RenderPosition, remove} from "../utils/render";

const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`
};
export default class Task {
  constructor(taskListContainer, changeData, changeMode) {
    this._taskListContainer = taskListContainer;

    this._changeData = changeData;
    this._changeMode = changeMode;
    this._mode = Mode.DEFAULT;

    this._taskComponent = null;
    this._taskEditComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleArchiveClick = this._handleArchiveClick.bind(this);
  }

  init(task) {
    this._task = task;
    console.log(task);
    const prevTaskComponent = this._taskComponent;
    const prevTaskEditComponent = this._taskEditComponent;

    this._taskComponent = new TaskView(task);
    this._taskEditComponent = new TaskEditView(task);

    this._taskComponent.setEditClickHandler(this._handleEditClick);
    this._taskEditComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._taskComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._taskComponent.setArchiveClickHandler(this._handleArchiveClick);

    if (prevTaskComponent === null || prevTaskEditComponent === null) {
      render(this._taskListContainer, this._taskComponent, RenderPosition.BEFOREEND);
      return;
    }
    if (this._mode === Mode.DEFAULT) {
      replace(this._taskComponent, prevTaskComponent);
    }
    if (this._mode === Mode.EDITING) {
      replace(this._taskEditComponent, prevTaskEditComponent);
    }
    remove(prevTaskComponent);
    remove(prevTaskEditComponent);

  }
  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceFormToCard();
    }
  }
  _handleFavoriteClick() {
    this._changeData(
        Object.assign(
            {},
            this._task,
            {
              isFavorite: !this._task.isFavorite
            }));
  }
  _handleArchiveClick() {
    this._changeData(
        Object.assign(
            {},
            this._task,
            {
              isArchive: !this._task.isArchive
            }));
  }
  destroy() {
    remove(this._taskComponent);
    remove(this._taskEditComponent);
  }
  _onEscKeyDown(e) {
    if (e.key === `Escape` || e.key === `Esc`) {
      e.preventDefault();
      this._taskEditComponent.reset(this._task);
      this._replaceFormToCard();
    }
  }
  _replaceCardToForm() {
    replace(this._taskEditComponent, this._taskComponent);
    document.addEventListener(`keydown`, this._onEscKeyDown);
    this._changeMode();
    this._mode = Mode.EDITING;
  }
  _replaceFormToCard() {
    replace(this._taskComponent, this._taskEditComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    this._mode = Mode.DEFAULT;
  }
  _handleEditClick() {
    this._replaceCardToForm();
  }
  _handleFormSubmit(task) {
    this._changeData(task);
    this._replaceFormToCard();
  }

}

