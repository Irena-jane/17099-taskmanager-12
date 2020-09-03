import BoardView from "../view/board";
import SortView from "../view/sort";
import TaskListView from "../view/task-list";
import NoTasksView from "../view/no-tasks";
import LoadMoreBtnView from "../view/load-more-btn";
import TaskPresenter from "./task";

import {updateItem} from "../utils/common";
import {render, remove, RenderPosition} from "../utils/render";
import {sortTaskUp, sortTaskDown} from "../utils/task";
import {SortType} from "../const";

const TASK_COUNT_PER_STEP = 8;

export default class Board {
  constructor(boardContainer) {
    this._boardContainer = boardContainer;

    this._renderedTaskCount = TASK_COUNT_PER_STEP;
    this._currentSortType = SortType.DEFAULT;
    this._taskPresenter = {};

    this._boardComponent = new BoardView();
    this._sortComponent = new SortView();
    this._taskListComponent = new TaskListView();
    this._noTasksComponent = new NoTasksView();
    this._loadMoreBtnComponent = new LoadMoreBtnView();

    this._handleTaskChange = this._handleTaskChange.bind(this);
    this._handleLoadMoreBtnClick = this._handleLoadMoreBtnClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
  }
  init(boardTasks) {
    this._boardTasks = boardTasks.slice();
    this._sourcedBoardTasks = boardTasks.slice();

    render(this._boardContainer, this._boardComponent);
    render(this._boardComponent, this._taskListComponent);

    this._renderBoard();
  }
  _handleModeChange() {
    Object.values(this._taskPresenter)
      .forEach((presenter) => presenter.resetView());
  }
  _handleTaskChange(updatedTask) {
    this._boardTasks = updateItem(this._boardTasks, updatedTask);
    this._sourcedBoardTasks = updateItem(this._sourcedBoardTasks, updatedTask);

    this._taskPresenter[updatedTask.id].init(updatedTask);
  }
  _sortTasks(sortType) {
    switch (sortType) {
      case SortType.DATE_UP:
        this._boardTasks.sort(sortTaskUp);
        break;
      case SortType.DATE_DOWN:
        this._boardTasks.sort(sortTaskDown);
        break;
      default:
        this._boardTasks = this._sourcedBoardTasks.slice();
    }
    this._currentSortType = sortType;
  }
  _clearTaskList() {
    // this._taskListComponent.getElement().innerHTML = ``;
    Object
      .values(this._taskPresenter)
      .forEach((presenter) => presenter.destroy());
    this._taskPresenter = {};
    this._renderedTaskCount = TASK_COUNT_PER_STEP;
  }
  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    // Сортируем
    this._sortTasks(sortType);
    // очищаем список
    this._clearTaskList();
    // рендерим его заново
    this._renderTaskList();
  }
  _renderSort() {
    render(this._boardComponent, this._sortComponent, RenderPosition.AFTERBEGIN);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }
  _renderTask(task) {
    const taskPresenter = new TaskPresenter(this._taskListComponent, this._handleTaskChange, this._handleModeChange);
    taskPresenter.init(task);
    this._taskPresenter[task.id] = taskPresenter;
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
