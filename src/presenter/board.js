import BoardView from "../view/board";
import SortView from "../view/sort";
import TaskListView from "../view/task-list";
import NoTasksView from "../view/no-tasks";
import TaskView from "../view/task";
import TaskEditView from "../view/task-edit";
import LoadMoreBtnView from "../view/load-more-btn";

import {render, replace, remove, RenderPosition} from "../utils/render";

const TASK_COUNT_PER_STEP = 8;

export default class Board {
  constructor(boardContainer) {
    this._boardContainer = boardContainer;
    this._renderedTaskCount = TASK_COUNT_PER_STEP;
    this._boardComponent = new BoardView();
    this._sortComponent = new SortView();
    this._taskListComponent = new TaskListView();
    this._noTasksComponent = new NoTasksView();
    this._loadMoreBtnComponent = new LoadMoreBtnView();
    this._handleLoadMoreBtnClick = this._handleLoadMoreBtnClick.bind(this);
  }
  init(boardTasks) {
    this._boardTasks = boardTasks.slice();

    render(this._boardContainer, this._boardComponent);
    render(this._boardComponent, this._taskListComponent);

    this._renderBoard();
  }
  _renderSort() {
    render(this._boardComponent, this._sortComponent, RenderPosition.AFTERBEGIN);
  }
  _renderTask(task) {
    const taskComponent = new TaskView(task);
    const taskEditComponent = new TaskEditView(task);

    const onEscKeyDown = (e) => {
      if (e.key === `Escape` || e.key === `Esc`) {
        replaceFormToCard();
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };
    const replaceCardToForm = () => {
      replace(taskEditComponent, taskComponent);
    };
    const replaceFormToCard = () => {
      replace(taskComponent, taskEditComponent);
    };
    taskComponent.setEditClickHandler(() => {
      replaceCardToForm();
      document.addEventListener(`keydown`, onEscKeyDown);
    });
    taskEditComponent.setFormSubmitHandler(() => {
      replaceFormToCard();
      document.addEventListener(`keydown`, onEscKeyDown);
    });

    render(this._taskListComponent, taskComponent, RenderPosition.BEFOREEND);
  }

  _renderTasks(from, to) {
    this._boardTasks
      .slice(from, to)
      .forEach((task) => this._renderTask(task));

  }
  _renderTaskList() {
    this._renderTasks(0, Math.min(this._boardTasks.length, TASK_COUNT_PER_STEP));
    if (this._boardTasks.length > TASK_COUNT_PER_STEP) {
      this._renderLoadMoreBtn();
    }
  }
  _renderNoTasks() {
    render(this._boardComponent, this._noTasksComponent, RenderPosition.AFTERBEGIN);
  }

  _renderLoadMoreBtn() {
    render(this._boardComponent, this._loadMoreBtnComponent, RenderPosition.BEFOREEND);

    this._loadMoreBtnComponent.setClickHandler(() => {
      this._handleLoadMoreBtnClick();
    });
  }
  _handleLoadMoreBtnClick() {
    this._renderTasks(this._renderedTaskCount, this._renderedTaskCount + TASK_COUNT_PER_STEP);

    this._renderedTaskCount += TASK_COUNT_PER_STEP;
    if (this._renderedTaskCount >= this._boardTasks.length) {
      remove(this._loadMoreBtnComponent);
    }
  }
  _renderBoard() {
    if (this._boardTasks.every((task) => task.isArchive)) {
      this._renderNoTasks();
      return;
    }
    this._renderSort();
    this._renderTaskList();

  }
}
