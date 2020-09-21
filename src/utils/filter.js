import {isTaskRepeating, isTaskExpired, isTaskExpiringToday} from "../utils/task";
import {FilterType} from "../const";

export const filter = {
  [FilterType.ALL]: (tasks) => tasks.filter((task) => !task.isArchive),
  [FilterType.OVERDUE]: (tasks) => tasks
    .filter((task) => !task.isArchive)
    .filter((task) => isTaskExpired(task.dueDate)),
  [FilterType.TODAY]: (tasks) => tasks
    .filter((task) => !task.isArchive)
    .filter((task) => isTaskExpiringToday(task.dueDate)),
  [FilterType.FAVORITES]: (tasks) => tasks
    .filter((task) => !task.isArchive)
    .filter((task) => task.isFavorite),
  [FilterType.REPEATING]: (tasks) => tasks
    .filter((task) => !task.isArchive)
    .filter((task) => isTaskRepeating(task.repeating)),
  [FilterType.ARCHIVE]: (tasks) => tasks.filter((task) => task.isArchive)
};
