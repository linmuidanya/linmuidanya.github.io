(() => {
  const editor = document.querySelector("[data-home-editor]");
  if (!editor) return;

  const form = editor.querySelector("[data-home-form]");
  const saveStatus = editor.querySelector("[data-home-save-status]");
  const message = editor.querySelector("[data-home-message]");
  const submitButton = editor.querySelector("[data-home-submit]");
  const resetButton = editor.querySelector("[data-home-reset]");
  const names = [
    "eyebrow",
    "title",
    "introduction",
    "resources_label",
    "resources_title",
    "recent_label",
    "recent_title",
  ];
  const fields = Object.fromEntries(names.map((name) => [name, form.elements.namedItem(name)]));
  const initialData = Object.fromEntries(names.map((name) => [name, fields[name].value]));
  const draftKey = "homepage-editor-draft";
  let updateTimer;

  const readDraft = () => {
    try {
      return window.localStorage.getItem(draftKey);
    } catch (_) {
      return null;
    }
  };

  const saveDraft = (value) => {
    try {
      window.localStorage.setItem(draftKey, value);
      return true;
    } catch (_) {
      return false;
    }
  };

  const clearDraft = () => {
    try {
      window.localStorage.removeItem(draftKey);
    } catch (_) {
      // Storage can be unavailable in privacy-restricted browser contexts.
    }
  };

  const formData = () => Object.fromEntries(names.map((name) => [name, fields[name].value]));

  const applyData = (data) => {
    names.forEach((name) => {
      if (typeof data[name] === "string") fields[name].value = data[name];
    });
  };

  const render = () => {
    names.forEach((name) => {
      const target = editor.querySelector(`[data-home-preview="${name}"]`);
      target.textContent = fields[name].value;
    });
  };

  const completeYaml = () =>
    `${names.map((name) => `${name}: ${JSON.stringify(fields[name].value.trim())}`).join("\n")}\n`;

  const copyText = async (value) => {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      return;
    }
    const temporary = document.createElement("textarea");
    temporary.value = value;
    temporary.style.position = "fixed";
    temporary.style.opacity = "0";
    document.body.append(temporary);
    temporary.select();
    document.execCommand("copy");
    temporary.remove();
  };

  const stored = readDraft();
  if (stored) {
    try {
      applyData(JSON.parse(stored));
    } catch (_) {
      clearDraft();
    }
  }
  render();

  form.addEventListener("input", () => {
    saveStatus.textContent = "Saving draft...";
    window.clearTimeout(updateTimer);
    updateTimer = window.setTimeout(() => {
      const saved = saveDraft(JSON.stringify(formData()));
      saveStatus.textContent = saved ? "Draft saved locally" : "Local saving unavailable";
      render();
    }, 160);
  });

  submitButton.addEventListener("click", async () => {
    if (!form.reportValidity()) return;
    const url = `https://github.com/${editor.dataset.repository}/edit/main/_data/homepage.yml`;
    window.open(url, "_blank", "noopener,noreferrer");
    try {
      await copyText(completeYaml());
      message.textContent = "Homepage data copied. Select all in GitHub, paste, and commit the change.";
    } catch (_) {
      message.textContent = "The browser could not copy the homepage data.";
    }
  });

  resetButton.addEventListener("click", () => {
    if (!window.confirm("Reset this local homepage draft?")) return;
    clearDraft();
    applyData(initialData);
    saveStatus.textContent = "Draft reset";
    message.textContent = "Local draft reset to the published homepage.";
    render();
  });
})();
