import Abstract from "./abstract";

const createNoTasksTemplate = () => {
  return `<p class="board__no-tasks">
    Click «ADD NEW TASK» in menu to create your first task
  </p>`;
};

export default class NoTasks extends Abstract {
  getTemplate() {
    return createNoTasksTemplate();
  }
}

