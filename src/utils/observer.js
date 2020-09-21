export default class Observer {
  constructor() {
    this._observers = [];
  }
  addObserver(observer) {
    this._observers.push(observer);
  }
  removeObserver(observerToDelete) {
    this._observers = this._observers.filter((observer) => observer !== observerToDelete);
  }
  _notify(event, payload) {
    this._observers.forEach((observer) => observer(event, payload));
  }
}
