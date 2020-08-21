
export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template.trim();
  return newElement.firstChild;
};
export const getRandomInteger = (a = 1, b = 0) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  const random = Math.floor(lower + Math.random() * (upper - lower + 1));
  return random;
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

