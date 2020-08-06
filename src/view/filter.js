const createFilterItemTemplate = (filter, isChecked) => {
  const {name, count} = filter;
  return `<input
          type="radio"
          id="filter__${name}"
          class="filter__input visually-hidden"
          name="filter"
          ${isChecked ? `checked` : ``}
        />
        <label for="filter__${name}" class="filter__label">
          ${name} <span class="filter__${name}-count">${count}</span></label
        >`;
};

export const createFilterTemplate = (filters) => {
  const filterItemsTemplate = filters.map((filter, i) => createFilterItemTemplate(filter, i === 0)).join(``);

  return (
    `<section class="main__filter filter container">
        ${filterItemsTemplate}
      </section>`
  );
};
