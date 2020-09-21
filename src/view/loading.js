import Abstract from "./abstract";

const createNoTasksTemplate = () => {
  return `<p class="board__no-tasks">
    Loading . . .
  </p>`;
};

export default class NoTasks extends Abstract {
  getTemplate() {
    return createNoTasksTemplate();
  }
}

