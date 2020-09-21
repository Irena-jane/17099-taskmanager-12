import Abstract from "../view/abstract";

export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

export const renderTemplate = (container, template, position) => {
  if (container instanceof Abstract) {
    container = container.getElement();
  }
  container.insertAdjacentHTML(position, template);
};

export const render = (container, element, position = RenderPosition.BEFOREEND) => {
  if (container instanceof Abstract) {
    container = container.getElement();
  }
  if (element instanceof Abstract) {
    element = element.getElement();
  }
  switch (position) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};
export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template.trim();
  return newElement.firstChild;
};
export const replace = (newChild, oldChild) => {
  if (newChild instanceof Abstract) {
    newChild = newChild.getElement();
  }
  if (oldChild instanceof Abstract) {
    oldChild = oldChild.getElement();
  }
  const parent = oldChild.parentElement;
  if (parent === null || oldChild === null || newChild === null) {
    throw new Error(`Can't replace unexisting element!`);
  }
  parent.replaceChild(newChild, oldChild);
};
export const remove = (component) => {
  if (!(component instanceof Abstract)) {
    throw new Error(`Can remove only components!`);
  }
  if (component === null) {
    return;
  }
  component.getElement().remove();
  component.removeElement();
};


