
import SiteMenuView from "./view/site-menu";
import StatisticsView from "./view/statistics";
import {generateTask} from "./mock/task";
import {MenuItem, UpdateType, FilterType} from "./const";

import BoardPresenter from "./presenter/board";
import FilterPresenter from "./presenter/filter";
import {remove, render} from "./utils/render";

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

const siteMenuComponent = new SiteMenuView();
render(siteHeaderElement, siteMenuComponent);
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
siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);

filterPresenter.init();
boardPresenter.init();
document.querySelector(`#control__new-task`).addEventListener(`click`, (e) => {
  e.preventDefault();
  boardPresenter.createTask(handleTaskNewFormClose);
});

