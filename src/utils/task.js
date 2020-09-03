import moment from "moment";

export const formatTaskDueDate = (dueDate) => {
  if (!(dueDate instanceof Date)) {
    return ``;
  }
  return moment(dueDate).format(`D MMMM`);
};
export const humanizeDate = (date) => {
  return date.toLocaleString(`en-US`, {day: `numeric`, month: `long`});
};
const castTimeFormat = (value) => {
  return value < 10 ? `0${value}` : String(value);
};
export const getTimeFromDate = (date) => {
  if (date === null) {
    return ``;
  }
  let hours = castTimeFormat(date.getHours());
  let min = castTimeFormat(date.getMinutes());
  return hours + `:` + min;
};
export const isTaskRepeating = (repeating) => {
  return Object.values(repeating).some(Boolean);
};
export const getCurrentDate = () => {
  const date = new Date();
  return date.setHours(23, 59, 59, 999);
};
export const isTaskExpired = (date) => {
  return date && getCurrentDate() > date.setHours(23, 59, 59, 999);
};
export const isTaskExpiringToday = (date) => {
  return date && getCurrentDate() === date.setHours(23, 59, 59, 999);
};
export const isDateExpired = (date) => {
  return date && Date.now() > date.getTime();
};
const getWeightForNullDate = (dateA, dateB) => {
  if (dateA === null && dateB === null) {
    return 0;
  }
  if (dateA === null) {
    return 1;
  }
  if (dateB === null) {
    return -1;
  }
  return null;
};
export const sortTaskUp = (taskA, taskB) => {
  const weight = getWeightForNullDate(taskA.dueDate, taskB.dueDate);
  if (weight !== null) {
    return weight;
  }
  return taskA.dueDate.getTime() - taskB.dueDate.getTime();
};
export const sortTaskDown = (taskA, taskB) => {
  const weight = getWeightForNullDate(taskA.dueDate, taskB.dueDate);
  if (weight !== null) {
    return weight;
  }
  return taskB.dueDate.getTime() - taskA.dueDate.getTime();
};

