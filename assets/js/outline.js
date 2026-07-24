(() => {
  const slugify = (value) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  document.querySelectorAll("[data-outline]").forEach((outline) => {
    const target = document.getElementById(outline.dataset.outlineTarget);
    if (!target) {
      outline.hidden = true;
      return;
    }

    const headings = [...target.querySelectorAll("h2, h3")];
    if (headings.length === 0) {
      outline.hidden = true;
      return;
    }

    const list = document.createElement("ol");
    const used = new Set();
    headings.forEach((heading) => {
      const base = heading.id || slugify(heading.textContent) || "section";
      let id = base;
      let number = 2;
      while (used.has(id) || (document.getElementById(id) && document.getElementById(id) !== heading)) id = `${base}-${number++}`;
      heading.id = id;
      used.add(id);

      const item = document.createElement("li");
      item.className = heading.tagName.toLowerCase() === "h3" ? "outline-subitem" : "";
      const link = document.createElement("a");
      link.href = `#${id}`;
      link.textContent = heading.textContent;
      item.appendChild(link);
      list.appendChild(item);
    });

    const label = document.createElement("p");
    label.className = "outline-label";
    label.textContent = "On this page";
    outline.append(label, list);
  });
})();
