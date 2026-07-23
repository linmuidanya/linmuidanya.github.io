(() => {
  const preview = document.querySelector("[data-source-preview]");
  if (!preview) return;

  fetch(preview.dataset.src)
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.text();
    })
    .then((source) => {
      preview.textContent = source;
    })
    .catch(() => {
      preview.textContent = "The source preview could not be loaded. Open the original file instead.";
    });
})();
