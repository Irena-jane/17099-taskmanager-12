
import SiteMenuView from "./view/site-menu";
import StatisticsView from "./view/statistics";
import {MenuItem, UpdateType, FilterType} from "./const";

import BoardPresenter from "./presenter/board";
import FilterPresenter from "./presenter/filter";
import {remove, render} from "./utils/render";

import TasksModel from "./model/tasks";
import FilterModel from "./model/filter";
import Api from "./api";

const AUTHORIZATION = `Basic hS2sd3dfSwcl1sa2j`;
const END_POINT = `https://12.ecmascript.pages.academy/task-manager`;

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

const api = new Api(END_POINT, AUTHORIZATION);
const tasksModel = new TasksModel();

const filterModel = new FilterModel();

const boardPresenter = new BoardPresenter(siteMainElement, tasksModel, filterModel, api);
const filterPresenter = new FilterPresenter(siteMainElement, filterModel, tasksModel);

const siteMenuComponent = new SiteMenuView();

const handleTaskNewFormClose = () => {
  siteMenuComponent.getElement().querySelector(`[value=${MenuItem.TASKS}]`).disabled = false;
  siteMenuComponent.setMenuItem(MenuItem.TASKS);
};

let statisticsComponent = null;
const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.ADD_NEW_TASK:
      remove(statisticsComponent);
      boardPresenter.destroy();
      filterModel.setFilter(UpdateType.MAJOR, FilterType.ALL);
      boardPresenter.init();
      boardPresenter.createTask(handleTaskNewFormClose);
      // сброс выделения с кнопки после сохранения
      siteMenuComponent.getElement().querySelector(`[value=${MenuItem.TASKS}]`).disabled = true;
      break;
    case MenuItem.TASKS:
      remove(statisticsComponent);
      boardPresenter.init();
      break;
    case MenuItem.STATICTICS:
      // скрыть доску
      boardPresenter.destroy();
      statisticsComponent = new StatisticsView(tasksModel.getTasks());
      render(siteMainElement, statisticsComponent);
      break;
  }
};


filterPresenter.init();
boardPresenter.init();

api.getTasks()
.then((tasks) => {
  tasksModel.setTasks(UpdateType.INIT, tasks);
  render(siteHeaderElement, siteMenuComponent);
  siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
})
.catch(() => {
  tasksModel.setTasks(UpdateType.INIT, []);
  render(siteHeaderElement, siteMenuComponent);
  siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
});

/* document.querySelector(`#control__new-task`).addEventListener(`click`, (e) => {
  e.preventDefault();
  boardPresenter.createTask(handleTaskNewFormClose);
});
 */
