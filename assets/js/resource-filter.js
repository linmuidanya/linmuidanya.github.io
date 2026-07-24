(() => {
  const root = document.querySelector("[data-resource-filter-root]");
  if (!root) return;

  const cards = [...root.querySelectorAll("[data-resource-card]")];
  const typeButtons = [...root.querySelectorAll("[data-resource-filter-value]")];
  const tagButtons = [...root.querySelectorAll("[data-resource-tag-value]")];
  const empty = root.querySelector("[data-resource-filter-empty]");

  const knownTypes = new Set(typeButtons.map((button) => button.dataset.resourceFilterValue));
  const knownTags = new Set(tagButtons.map((button) => button.dataset.resourceTagValue));

  const apply = (type, tag) => {
    let visible = 0;
    cards.forEach((card) => {
      const tags = card.dataset.resourceTags.trim().split(/\s+/).filter(Boolean);
      const matchesType = type === "all" || card.dataset.resourceKind === type;
      const matchesTag = !tag || tags.includes(tag);
      const matches = matchesType && matchesTag;
      card.hidden = !matches;
      if (matches) visible += 1;
    });
    typeButtons.forEach((button) => {
      const active = button.dataset.resourceFilterValue === type;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    tagButtons.forEach((button) => {
      const active = button.dataset.resourceTagValue === tag;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    if (empty) empty.hidden = visible !== 0;
  };

  const select = (requestedType, requestedTag, updateUrl) => {
    const type = knownTypes.has(requestedType) ? requestedType : "all";
    const tag = knownTags.has(requestedTag) ? requestedTag : "";
    apply(type, tag);
    if (updateUrl) {
      const url = new URL(window.location.href);
      if (type === "all") url.searchParams.delete("type");
      else url.searchParams.set("type", type);
      if (tag) url.searchParams.set("tag", tag);
      else url.searchParams.delete("tag");
      window.history.pushState({ type, tag }, "", url);
    }
  };

  const stateFromUrl = () => {
    const parameters = new URLSearchParams(window.location.search);
    return { type: parameters.get("type") || "all", tag: parameters.get("tag") || "" };
  };

  typeButtons.forEach((button) =>
    button.addEventListener("click", () => {
      const state = stateFromUrl();
      select(button.dataset.resourceFilterValue, state.tag, true);
    })
  );
  tagButtons.forEach((button) =>
    button.addEventListener("click", () => {
      const state = stateFromUrl();
      const tag = state.tag === button.dataset.resourceTagValue ? "" : button.dataset.resourceTagValue;
      select(state.type, tag, true);
    })
  );
  window.addEventListener("popstate", () => {
    const state = stateFromUrl();
    select(state.type, state.tag, false);
  });
  const initial = stateFromUrl();
  select(initial.type, initial.tag, false);
})();
