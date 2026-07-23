(() => {
  const root = document.querySelector("[data-post-filter-root]");
  if (!root) return;

  const buttons = [...root.querySelectorAll("[data-filter]")];
  const cards = [...root.querySelectorAll("[data-post-card]")];
  const empty = root.querySelector("[data-filter-empty]");

  const applyFilter = (filter) => {
    let visible = 0;
    cards.forEach((card) => {
      const matches = filter === "all" || card.dataset.tags.split(/\s+/).includes(filter);
      card.hidden = !matches;
      if (matches) visible += 1;
    });
    buttons.forEach((button) => {
      const active = button.dataset.filter === filter;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    if (empty) empty.hidden = visible !== 0;
  };

  buttons.forEach((button) => button.addEventListener("click", () => applyFilter(button.dataset.filter)));
})();
