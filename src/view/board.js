import Abstract from "./abstract";

const createBoardTemplate = () => {
  return (
    `<section class="board container"></div>`
  );
};

export default class Board extends Abstract {
  getTemplate() {
    return createBoardTemplate();
  }
}
