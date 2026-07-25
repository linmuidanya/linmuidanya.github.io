(() => {
  const toggle = document.querySelector("[data-profile-toggle]");
  const card = document.querySelector("[data-profile-card]");
  if (!toggle || !card) return;

  const setOpen = (open, returnFocus = false) => {
    card.hidden = !open;
    toggle.setAttribute("aria-expanded", String(open));
    if (!open && returnFocus) toggle.focus();
  };

  toggle.addEventListener("click", () => setOpen(card.hidden));

  document.addEventListener("click", (event) => {
    if (!card.hidden && !card.contains(event.target) && !toggle.contains(event.target)) setOpen(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !card.hidden) setOpen(false, true);
  });
})();
