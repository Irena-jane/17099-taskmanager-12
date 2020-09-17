
import SiteMenuView from "./view/site-menu";

import {generateTask} from "./mock/task";
// import {generateFilter} from "./mock/filter";

import BoardPresenter from "./presenter/board";
import FilterPresenter from "./presenter/filter";
import {RenderPosition, render} from "./utils/render";

import TasksModel from "./model/tasks";
import FilterModel from "./model/filter";

const TASK_COUNT = 22;

const tasks = new Array(TASK_COUNT).fill().map(generateTask);

const tasksModel = new TasksModel();
tasksModel.setTasks(tasks);

const filterModel = new FilterModel();

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

const boardPresenter = new BoardPresenter(siteMainElement, tasksModel, filterModel);
const filterPresenter = new FilterPresenter(siteMainElement, filterModel, tasksModel);

render(siteHeaderElement, new SiteMenuView().getElement(), RenderPosition.BEFOREEND);

// render(siteMainElement, new FilterView(filters, `all`), RenderPosition.BEFOREEND);
filterPresenter.init();
boardPresenter.init();
document.querySelector(`#control__new-task`).addEventListener(`click`, (e) => {
  e.preventDefault();
  boardPresenter.createTask();
});

