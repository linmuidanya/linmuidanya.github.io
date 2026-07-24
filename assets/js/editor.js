(() => {
  const editor = document.querySelector("[data-editor]");
  if (!editor) return;

  const form = editor.querySelector("[data-editor-form]");
  const preview = editor.querySelector("[data-editor-preview]");
  const outline = editor.querySelector("[data-editor-outline]");
  const pathLabel = editor.querySelector("[data-preview-path]");
  const saveStatus = editor.querySelector("[data-save-status]");
  const message = editor.querySelector("[data-editor-message]");
  const publishButton = editor.querySelector("[data-editor-publish]");
  const downloadButton = editor.querySelector("[data-editor-download]");
  const resetButton = editor.querySelector("[data-editor-reset]");
  const fields = Object.fromEntries(
    ["destination", "filename", "title", "description", "type", "tags", "body"].map((name) => [
      name,
      form.elements.namedItem(name),
    ])
  );
  const repository = editor.dataset.repository;
  const requestedPath = new URLSearchParams(window.location.search).get("path") || "";
  const draftKey = "site-editor-draft";
  const importKey = "site-editor-import";
  let activePath = requestedPath;
  let renderTimer;

  const readStorage = (key) => {
    try {
      return window.localStorage.getItem(key);
    } catch (_) {
      return null;
    }
  };

  const writeStorage = (key, value) => {
    try {
      window.localStorage.setItem(key, value);
      return true;
    } catch (_) {
      return false;
    }
  };

  const removeStorage = (key) => {
    try {
      window.localStorage.removeItem(key);
    } catch (_) {
      // Storage can be unavailable in privacy-restricted browser contexts.
    }
  };

  const decodeBase64 = (encoded) => {
    const bytes = Uint8Array.from(window.atob(encoded), (character) => character.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  };

  const unquote = (value) => {
    const trimmed = value.trim();
    if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
      try {
        return JSON.parse(trimmed);
      } catch (_) {
        return trimmed.slice(1, -1);
      }
    }
    if (trimmed.startsWith("'") && trimmed.endsWith("'")) return trimmed.slice(1, -1).replace(/''/g, "'");
    return trimmed;
  };

  const parseMarkdown = (source) => {
    const match = source.match(/^---\s*\n([\s\S]*?)\n---\s*(?:\n|$)([\s\S]*)$/);
    if (!match) return { body: source };

    const metadata = {};
    match[1].split("\n").forEach((line) => {
      const field = line.match(/^([a-zA-Z_][\w-]*):\s*(.*)$/);
      if (!field) return;
      metadata[field[1]] = unquote(field[2]);
    });
    if (metadata.tags) {
      metadata.tags = metadata.tags
        .replace(/^\[|\]$/g, "")
        .split(",")
        .map((tag) => unquote(tag))
        .filter(Boolean)
        .join(", ");
    }
    return { ...metadata, body: match[2].replace(/^\n+/, "") };
  };

  const slugify = (value) =>
    value
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "untitled";

  const fileName = () => `${slugify(fields.filename.value.replace(/\.md$/i, ""))}.md`;
  const destinationPath = () => `${fields.destination.value}/${fileName()}`;
  const quoteYaml = (value) => JSON.stringify(value.trim());

  const completeMarkdown = () => {
    const tags = fields.tags.value
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean)
      .map(quoteYaml)
      .join(", ");
    const metadata = [
      "---",
      `title: ${quoteYaml(fields.title.value)}`,
      `description: ${quoteYaml(fields.description.value)}`,
      `type: ${quoteYaml(fields.type.value)}`,
      `tags: [${tags}]`,
      "---",
      "",
    ];
    return `${metadata.join("\n")}\n${fields.body.value.trimEnd()}\n`;
  };

  const makeHeadingId = (text, used) => {
    const root = slugify(text);
    const count = used.get(root) || 0;
    used.set(root, count + 1);
    return count ? `${root}-${count + 1}` : root;
  };

  const updateOutline = (content) => {
    const headings = [...content.querySelectorAll("h2, h3")];
    outline.replaceChildren();
    if (!headings.length) {
      outline.hidden = true;
      return;
    }

    const label = document.createElement("p");
    label.className = "outline-label";
    label.textContent = "On this page";
    const list = document.createElement("ol");
    const used = new Map();
    headings.forEach((heading) => {
      heading.id = makeHeadingId(heading.textContent, used);
      const item = document.createElement("li");
      if (heading.tagName === "H3") item.className = "outline-subitem";
      const link = document.createElement("a");
      link.href = `#${heading.id}`;
      link.textContent = heading.textContent;
      item.append(link);
      list.append(item);
    });
    outline.append(label, list);
    outline.hidden = false;
  };

  const render = async () => {
    if (!window.marked || !window.DOMPurify) return;
    window.MathJax?.typesetClear?.([preview]);
    preview.replaceChildren();

    const header = document.createElement("header");
    header.className = "editor-preview-meta";
    const type = document.createElement("p");
    type.className = "eyebrow";
    type.textContent = fields.type.value || "Markdown";
    const title = document.createElement("h1");
    title.textContent = fields.title.value || "Untitled document";
    const description = document.createElement("p");
    description.textContent = fields.description.value;
    header.append(type, title);
    if (description.textContent) header.append(description);

    const content = document.createElement("div");
    content.className = "editor-preview-body";
    const rendered = window.marked.parse(fields.body.value, { gfm: true });
    content.innerHTML = window.DOMPurify.sanitize(rendered);
    preview.append(header, content);
    updateOutline(content);
    pathLabel.textContent = activePath || destinationPath();

    if (window.MathJax?.typesetPromise) {
      try {
        await window.MathJax.typesetPromise([content]);
      } catch (_) {
        // Keep the Markdown preview usable when the optional math renderer fails.
      }
    }
  };

  const draftData = () => ({
    path: activePath,
    destination: fields.destination.value,
    filename: fields.filename.value,
    title: fields.title.value,
    description: fields.description.value,
    type: fields.type.value,
    tags: fields.tags.value,
    body: fields.body.value,
  });

  const applyData = (data) => {
    Object.entries(data).forEach(([name, value]) => {
      if (fields[name] && typeof value === "string") fields[name].value = value;
    });
  };

  const scheduleUpdate = () => {
    saveStatus.textContent = "Saving draft...";
    window.clearTimeout(renderTimer);
    renderTimer = window.setTimeout(() => {
      const saved = writeStorage(draftKey, JSON.stringify(draftData()));
      saveStatus.textContent = saved ? "Draft saved locally" : "Local saving unavailable";
      render();
    }, 180);
  };

  const importExistingDocument = () => {
    const imported = readStorage(importKey);
    if (requestedPath && imported) {
      try {
        const data = parseMarkdown(decodeBase64(imported));
        applyData(data);
        const parts = requestedPath.split("/");
        fields.filename.value = parts.pop().replace(/\.md$/i, "");
        fields.destination.value = parts.join("/") || "resources/markdown";
        activePath = requestedPath;
        removeStorage(importKey);
        return true;
      } catch (_) {
        removeStorage(importKey);
      }
    }
    return false;
  };

  const restoreDraft = () => {
    const stored = readStorage(draftKey);
    if (!stored) return;
    try {
      const draft = JSON.parse(stored);
      if (!requestedPath || draft.path === requestedPath) {
        applyData(draft);
        activePath = draft.path || "";
      }
    } catch (_) {
      removeStorage(draftKey);
    }
  };

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

  if (!importExistingDocument()) restoreDraft();
  render();

  form.addEventListener("input", scheduleUpdate);
  form.addEventListener("change", scheduleUpdate);

  publishButton.addEventListener("click", async () => {
    if (!form.reportValidity()) return;
    const targetPath = activePath || destinationPath();
    const url = activePath
      ? `https://github.com/${repository}/edit/main/${targetPath}`
      : `https://github.com/${repository}/new/main/${fields.destination.value}?filename=${encodeURIComponent(fileName())}`;
    window.open(url, "_blank", "noopener,noreferrer");
    try {
      await copyText(completeMarkdown());
      message.textContent = "Markdown copied. Paste it into the GitHub editor, then commit the file.";
    } catch (_) {
      message.textContent = "The browser could not copy the Markdown. Download the file instead.";
    }
  });

  downloadButton.addEventListener("click", () => {
    const url = URL.createObjectURL(new Blob([completeMarkdown()], { type: "text/markdown;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName();
    link.click();
    URL.revokeObjectURL(url);
    message.textContent = `${fileName()} downloaded.`;
  });

  resetButton.addEventListener("click", () => {
    if (!window.confirm("Reset this local draft?")) return;
    removeStorage(draftKey);
    activePath = "";
    form.reset();
    message.textContent = "Local draft reset.";
    render();
  });
})();
