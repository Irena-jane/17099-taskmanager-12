import {createSiteMenuTemplate} from "./view/site-menu";
import {createFilterTemplate} from "./view/filter";
import {createBoardTemplate} from "./view/board";
import {createBoardFilterTemplate} from "./view/board-filter";
import {createLoadMoreBtnTemplate} from "./view/load-more-btn";
import {createTaskListTemplate} from "./view/task-list";
import {createTaskTemplate} from "./view/task";
import {createTaskEditTemplate} from "./view/task-edit";

import {generateTask} from "./mock/task";
import {generateFilter} from "./mock/filter";

import {render} from "./render.js";

const TASK_COUNT = 22;
const TASK_COUNT_PER_STEP = 8;

const tasks = new Array(TASK_COUNT).fill().map(generateTask);
const filters = generateFilter(tasks);

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

render(siteHeaderElement, createSiteMenuTemplate(), `beforeend`);

render(siteMainElement, createFilterTemplate(filters), `beforeend`);
render(siteMainElement, createBoardTemplate(), `beforeend`);

const siteBoardElement = document.querySelector(`.board`);

render(siteBoardElement, createBoardFilterTemplate(), `beforeend`);
render(siteBoardElement, createTaskListTemplate(), `beforeend`);


const taskList = document.querySelector(`.board__tasks`);

render(taskList, createTaskEditTemplate(tasks[0]), `beforeend`);

for (let i = 1; i < Math.min(TASK_COUNT_PER_STEP, tasks.length); i++) {
  render(taskList, createTaskTemplate(tasks[i]), `beforeend`);
}

if (tasks.length > TASK_COUNT_PER_STEP) {
  let renderedTaskCount = TASK_COUNT_PER_STEP;

  render(siteBoardElement, createLoadMoreBtnTemplate(), `beforeend`);
  const loadMoreBtn = siteBoardElement.querySelector(`.load-more`);

  loadMoreBtn.addEventListener(`click`, (e) => {
    e.preventDefault();
    tasks.slice(renderedTaskCount, renderedTaskCount + TASK_COUNT_PER_STEP)
      .forEach((task) => render(taskList, createTaskTemplate(task), `beforeend`));
    renderedTaskCount += TASK_COUNT_PER_STEP;
    if (renderedTaskCount >= tasks.length) {
      loadMoreBtn.remove();
    }
  });

}

