
import SiteMenuView from "./view/site-menu";

import FilterView from "./view/filter";

import {generateTask} from "./mock/task";
import {generateFilter} from "./mock/filter";

import BoardPresenter from "./presenter/board";
import {RenderPosition, render} from "./utils/render";

const TASK_COUNT = 22;

const tasks = new Array(TASK_COUNT).fill().map(generateTask);
const filters = generateFilter(tasks);

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

const boardPresenter = new BoardPresenter(siteMainElement);

render(siteHeaderElement, new SiteMenuView().getElement(), RenderPosition.BEFOREEND);

render(siteMainElement, new FilterView(filters).getElement(), RenderPosition.BEFOREEND);

boardPresenter.init(tasks);

