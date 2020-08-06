import {createSiteMenuTemplate} from "./view/site-menu";
import {createFilterTemplate} from "./view/filter";
import {createBoardTemplate} from "./view/board";
import {createBoardFilterTemplate} from "./view/board-filter";
import {createLoadMoreBtnTemplate} from "./view/load-more-btn";
import {createTaskListTemplate} from "./view/task-list";
import {createTaskTemplate} from "./view/task";
import {createTaskEditTemplate} from "./view/task-edit";

import {render} from "./render.js";

const TASK_COUNT = 3;


const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

render(siteHeaderElement, createSiteMenuTemplate(), `beforeend`);

render(siteMainElement, createFilterTemplate(), `beforeend`);
render(siteMainElement, createBoardTemplate(), `beforeend`);

const siteBoardElement = document.querySelector(`.board`);

render(siteBoardElement, createBoardFilterTemplate(), `beforeend`);
render(siteBoardElement, createTaskListTemplate(), `beforeend`);


const taskList = document.querySelector(`.board__tasks`);

render(taskList, createTaskEditTemplate(), `beforeend`);

for (let i = 0; i < TASK_COUNT; i++) {
  render(taskList, createTaskTemplate(), `beforeend`);
}

render(siteBoardElement, createLoadMoreBtnTemplate(), `beforeend`);
