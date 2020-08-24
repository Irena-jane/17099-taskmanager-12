export const getRandomInteger = (a = 1, b = 0) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  const random = Math.floor(lower + Math.random() * (upper - lower + 1));
  return random;
};
