
import SiteMenuView from "./view/site-menu";
import BoardView from "./view/board";
import SortView from "./view/sort";
import LoadMoreBtnView from "./view/load-more-btn";
import TaskListView from "./view/task-list";
import NoTasksView from "./view/no-tasks";

import FilterView from "./view/filter";
import TaskView from "./view/task";
import TaskEditView from "./view/task-edit";

import {generateTask} from "./mock/task";
import {generateFilter} from "./mock/filter";

import {RenderPosition, render} from "./render.js";

const TASK_COUNT = 22;
const TASK_COUNT_PER_STEP = 8;

const tasks = new Array(TASK_COUNT).fill().map(generateTask);
const filters = generateFilter(tasks);

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);


const renderTask = (taskListElement, task) => {
  const taskComponent = new TaskView(task);
  const taskEditComponent = new TaskEditView(task);

  const onEscKeyDown = (e) => {
    if (e.key === `Escape` || e.key === `Esc`) {
      replaceFormToCard();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };
  const replaceCardToForm = () => {
    taskListElement.replaceChild(taskEditComponent.getElement(), taskComponent.getElement());
  };
  const replaceFormToCard = () => {
    taskListElement.replaceChild(taskComponent.getElement(), taskEditComponent.getElement());
  };
  taskComponent.getElement().querySelector(`.card__btn--edit`).addEventListener(`click`, () => {
    replaceCardToForm();
    document.addEventListener(`keydown`, onEscKeyDown);
  });
  taskEditComponent.getElement().querySelector(`form`).addEventListener(`submit`, (e) => {
    e.preventDefault();
    replaceFormToCard();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  render(taskListElement, taskComponent.getElement(), RenderPosition.BEFOREEND);
};

const renderBoard = (boardContainer, boardTasks) => {

  const boardComponent = new BoardView();
  const taskListComponent = new TaskListView();

  render(boardContainer, boardComponent.getElement(), RenderPosition.BEFOREEND);
  render(boardComponent.getElement(), taskListComponent.getElement(), RenderPosition.BEFOREEND);

  if (boardTasks.every((boardTask) => boardTask.isArchive)) {
    render(boardComponent.getElement(), new NoTasksView().getElement(), RenderPosition.AFTERBEGIN);
    return;
  }

  render(boardComponent.getElement(), new SortView().getElement(), RenderPosition.AFTERBEGIN);

  boardTasks
    .slice(0, Math.min(TASK_COUNT_PER_STEP, boardTasks.length))
    .forEach((task) => {
      renderTask(taskListComponent.getElement(), task);
    });

  if (boardTasks.length > TASK_COUNT_PER_STEP) {
    let renderedTaskCount = TASK_COUNT_PER_STEP;

    const loadMoreBtnComponent = new LoadMoreBtnView();
    render(boardComponent.getElement(), loadMoreBtnComponent.getElement(), RenderPosition.BEFOREEND);

    loadMoreBtnComponent.getElement().addEventListener(`click`, (e) => {
      e.preventDefault();
      boardTasks
        .slice(renderedTaskCount, renderedTaskCount + TASK_COUNT_PER_STEP)
        .forEach((task) => renderTask(taskListComponent.getElement(), task));

      renderedTaskCount += TASK_COUNT_PER_STEP;
      if (renderedTaskCount >= boardTasks.length) {
        loadMoreBtnComponent.getElement().remove();
        loadMoreBtnComponent.removeElement();
      }
    });

  }

};

render(siteHeaderElement, new SiteMenuView().getElement(), RenderPosition.BEFOREEND);

render(siteMainElement, new FilterView(filters).getElement(), RenderPosition.BEFOREEND);
renderBoard(siteMainElement, tasks);
