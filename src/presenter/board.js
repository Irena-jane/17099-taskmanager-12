import BoardView from "../view/board";
import SortView from "../view/sort";
import TaskListView from "../view/task-list";
import NoTasksView from "../view/no-tasks";
import LoadMoreBtnView from "../view/load-more-btn";
import TaskPresenter from "./task";
import TaskNewPresenter from "../presenter/task-new";

import {render, remove, RenderPosition} from "../utils/render";
import {sortTaskUp, sortTaskDown} from "../utils/task";
import {filter} from "../utils/filter";
import {SortType, UserAction, UpdateType, FilterType} from "../const";

const TASK_COUNT_PER_STEP = 8;

export default class Board {
  constructor(boardContainer, tasksModel, filterModel) {
    this._boardContainer = boardContainer;
    this._tasksModel = tasksModel;
    this._filterModel = filterModel;

    this._renderedTaskCount = TASK_COUNT_PER_STEP;
    this._currentSortType = SortType.DEFAULT;
    this._taskPresenter = {};

    this._boardComponent = new BoardView();
    this._sortComponent = null;
    this._taskListComponent = new TaskListView();
    this._noTasksComponent = new NoTasksView();
    this._loadMoreBtnComponent = null;

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._handleLoadMoreBtnClick = this._handleLoadMoreBtnClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);

    this._taskNewPresenter = new TaskNewPresenter(this._taskListComponent, this._handleViewAction);
    this._tasksModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }
  init() {
    render(this._boardContainer, this._boardComponent);
    render(this._boardComponent, this._taskListComponent);

    this._renderBoard();
  }
  _getTasks() {
    const currentFilter = this._filterModel.getFilter();
    let tasks = this._tasksModel.getTasks();
    tasks = filter[currentFilter](tasks);
    switch (this._currentSortType) {
      case SortType.DATE_UP:
        return tasks.sort(sortTaskUp);
      case SortType.DATE_DOWN:
        return tasks.sort(sortTaskDown);
    }
    return tasks;
  }
  createTask() {
    this._currentSortType = SortType.DEFAULT;
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.ALL);
    this._taskNewPresenter.init();
  }
  _handleModeChange() {
    this._taskNewPresenter.destroy();
    Object.values(this._taskPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_TASK:
        this._tasksModel.updateTask(updateType, update);
        break;
      case UserAction.ADD_TASK:
        this._tasksModel.addTask(updateType, update);
        break;
      case UserAction.DELETE_TASK:
        this._tasksModel.deleteTask(updateType, update);
        break;
    }
  }
  _handleModelEvent(updateType, update) {
    switch (updateType) {
      case UpdateType.PATCH:
        // частичная перерисовка
        this._taskPresenter[update.id].init(update);
        break;
      case UpdateType.MINOR:
        // перерисовка списка
        this._clearBoard();
        this._renderBoard();
        break;
      case UpdateType.MAJOR:
        // перерисовка доски
        this._clearBoard({resetRenderedTaskCount: true, resetSortType: true});
        this._renderBoard();
        break;
    }
  }
  _clearBoard({resetRenderedTaskCount = false, resetSortType = false} = {}) {
    Object
      .values(this._taskPresenter)
      .forEach((presenter) => presenter.destroy());
    this._taskPresenter = {};
    remove(this._sortComponent);
    remove(this._noTasksComponent);
    remove(this._loadMoreBtnComponent);

    const taskCount = this._getTasks().length;
    this._taskNewPresenter.destroy();
    if (resetRenderedTaskCount) {
      this._renderedTaskCount = TASK_COUNT_PER_STEP;
    } else {
      this._renderedTaskCount = Math.min(taskCount, TASK_COUNT_PER_STEP);
    }
    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    // Сортируем
    this._currentSortType = sortType;
    // очищаем список
    this._clearBoard({resetRenderedTaskCount: true});
    // рендерим его заново
    this._renderBoard();
  }
  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }
    this._sortComponent = new SortView(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
    render(this._boardComponent, this._sortComponent, RenderPosition.AFTERBEGIN);
  }
  _renderTask(task) {
    const taskPresenter = new TaskPresenter(this._taskListComponent, this._handleViewAction, this._handleModeChange);
    taskPresenter.init(task);
    this._taskPresenter[task.id] = taskPresenter;
  }

  _renderTasks(tasks) {
    tasks.forEach((task) => this._renderTask(task));
  }

  _renderNoTasks() {
    render(this._boardComponent, this._noTasksComponent, RenderPosition.AFTERBEGIN);
  }

  _renderLoadMoreBtn() {
    if (this._loadMoreBtnComponent !== null) {
      this._loadMoreBtnComponent = null;
    }
    this._loadMoreBtnComponent = new LoadMoreBtnView();
    this._loadMoreBtnComponent.setClickHandler(() => {
      this._handleLoadMoreBtnClick();
    });
    render(this._boardComponent, this._loadMoreBtnComponent, RenderPosition.BEFOREEND);

  }

  _handleLoadMoreBtnClick() {
    const taskCount = this._getTasks().length;
    const newTaskCountToRender = Math.min(taskCount, this._renderedTaskCount + TASK_COUNT_PER_STEP);
    const tasks = this._getTasks().slice(this._renderedTaskCount, newTaskCountToRender);
    this._renderTasks(tasks);

    this._renderedTaskCount += TASK_COUNT_PER_STEP;
    if (this._renderedTaskCount >= taskCount) {
      remove(this._loadMoreBtnComponent);
    }
  }
  _renderBoard() {
    const tasks = this._getTasks();
    const taskCount = tasks.length;

    if (taskCount === 0) {
      this._renderNoTasks();
      return;
    }
    this._renderSort();
    this._renderTasks(tasks.slice(0, Math.min(taskCount, this._renderedTaskCount)));
    if (taskCount > this._renderedTaskCount) {
      this._renderLoadMoreBtn();
    }

  }
}
