import Observer from "../utils/observer";

export default class Tasks extends Observer {
  constructor() {
    super();
    this._tasks = [];
  }
  getTasks() {
    return this._tasks;
  }
  setTasks(tasks) {
    this._tasks = tasks.slice();
  }
  addTask(updateType, update) {
    if (!update) {
      return;
    }
    this._tasks = [update, ...this._tasks];
    this._notify(updateType, update);
  }
  updateTask(updateType, update) {
    const index = this._tasks.findIndex((task) => task.id === update.id);
    if (index === -1) {
      throw new Error(`Can't update unexisting task`);
    }
    this._tasks = [
      ...this._tasks.slice(0, index),
      update,
      ...this._tasks.slice(index + 1)
    ];
    this._notify(updateType, update);
  }
  deleteTask(updateType, update) {
    const index = this._tasks.findIndex((task) => update.id === task.id);
    if (index === -1) {
      throw new Error(`Can't delete unexisting task`);
    }
    this._tasks = this._tasks.filter((task) => update.id !== task.id);
    /*  this._tasks = [...this._tasks.slice(0, index),
      ...this._tasks.slice(index)
    ]; */
    this._notify(updateType, update);
  }
}
