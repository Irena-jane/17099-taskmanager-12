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
  date.setHours(23, 59, 59, 999);
  return new Date(date);
};
export const isTaskExpired = (date) => {
  // return date && getCurrentDate() > date.setHours(23, 59, 59, 999);
  if (date === null) {
    return false;
  }
  const currentDate = getCurrentDate();
  return moment(currentDate).isAfter(date, `day`);
};
export const isTaskExpiringToday = (date) => {
  // return date && getCurrentDate() === date.setHours(23, 59, 59, 999);
  if (date === null) {
    return false;
  }
  const currentDate = getCurrentDate();
  return moment(currentDate).isSame(date, `day`);
};
export const isDateEqual = (dateA, dateB) => {
  if (dateA === null || dateB === null) {
    return false;
  }
  return moment(dateA).isSame(dateB, `day`);
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

