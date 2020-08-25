import {COLORS} from "../const";
import {getRandomInteger} from "../utils/common";


const generateDescription = () => {
  const descriptions = [
    `Изучить теорию`,
    `Сделать домашку`,
    `Пройти интенсив на соточку`
  ];
  const randomIndex = getRandomInteger(0, descriptions.length - 1);
  return descriptions[randomIndex];
};

const generateDueDate = () => {
  const isDate = Boolean(getRandomInteger(0, 1));

  if (!isDate) {
    return null;
  }

  const currentDate = new Date();
  const currentHours = getRandomInteger(0, 23);
  const currentMinutes = getRandomInteger(0, 59);
  currentDate.setHours(currentHours, currentMinutes, 59, 999);
  const gap = 7;
  const daysGap = getRandomInteger(-gap, gap);
  currentDate.setDate(currentDate.getDate() + daysGap);

  return currentDate;

};
const generateRepeating = () => {
  return {
    mo: false,
    tu: Boolean(getRandomInteger(0, 1)),
    we: false,
    th: false,
    fr: Boolean(getRandomInteger(0, 1)),
    sa: false,
    su: false
  };
};

const generateColor = () => {
  const randomIndex = getRandomInteger(0, COLORS.length - 1);
  return COLORS[randomIndex];
};

export const generateTask = () => {
  const dueDate = generateDueDate();
  const repeating = dueDate === null ?
    generateRepeating()
    : {
      mo: false,
      tu: false,
      we: false,
      th: false,
      fr: false,
      sa: false,
      su: false
    };

  return {
    description: generateDescription(),
    dueDate,
    repeating,
    color: generateColor(),
    isFavorite: Boolean(getRandomInteger(0, 1)),
    isArchive: Boolean(getRandomInteger(0, 1))
  };
};
