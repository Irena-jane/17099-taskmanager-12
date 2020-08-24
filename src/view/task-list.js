import Abstract from "./abstract";

const createTaskListTemplate = () => {
  return (
    `<div class="board__tasks"></div>`
  );
};

export default class TaskList extends Abstract {
  getTemplate() {
    return createTaskListTemplate();
  }
}
