(() => {
  const root = document.querySelector("[data-pdf-upload]");
  if (!root) return;

  const form = root.querySelector("[data-upload-form]");
  const button = root.querySelector("[data-upload-button]");
  const message = root.querySelector("[data-upload-message]");
  const fields = form.elements;
  const [owner, repository] = root.dataset.repository.split("/");

  const setMessage = (text, state = "") => {
    message.textContent = text;
    message.className = `editor-message${state ? ` is-${state}` : ""}`;
  };

  const slugify = (value) =>
    value
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 90) || `document-${Date.now()}`;

  const fileAsBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result).split(",")[1]);
      reader.onerror = () => reject(reader.error || new Error("Could not read the PDF."));
      reader.readAsDataURL(file);
    });

  const textAsBase64 = (text) => {
    const bytes = new TextEncoder().encode(text);
    let binary = "";
    for (let offset = 0; offset < bytes.length; offset += 8192) {
      binary += String.fromCharCode(...bytes.subarray(offset, offset + 8192));
    }
    return window.btoa(binary);
  };

  const yamlString = (value) => JSON.stringify(value.trim());

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const pdf = fields.namedItem("pdf").files[0];
    const tokenField = fields.namedItem("token");

    if (!pdf || !pdf.name.toLowerCase().endsWith(".pdf")) {
      setMessage("Choose a PDF file before publishing.", "error");
      return;
    }
    if (pdf.size > 25 * 1024 * 1024) {
      setMessage("The PDF must be 25 MB or smaller.", "error");
      return;
    }

    button.disabled = true;
    setMessage("Preparing the document…");

    try {
      const title = fields.namedItem("title").value.trim();
      const description = fields.namedItem("description").value.trim();
      const tags = fields
        .namedItem("tags")
        .value.split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);
      const pinned = fields.namedItem("pinned").checked;
      const pinWeight = Math.max(1, Number.parseInt(fields.namedItem("pin_weight").value, 10) || 100);
      const slug = slugify(title || pdf.name.replace(/\.pdf$/i, ""));
      const pdfPath = `resources/documents/${slug}.pdf`;
      const sidecarPath = `resources/documents/${slug}.md`;
      const sidecar = [
        "---",
        `title: ${yamlString(title)}`,
        `description: ${yamlString(description)}`,
        'type: "PDF"',
        `tags: [${tags.map(yamlString).join(", ")}]`,
        `pinned: ${pinned}`,
        `pin_weight: ${pinWeight}`,
        "---",
        "",
      ].join("\n");

      const apiRoot = `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repository)}`;
      const headers = {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${tokenField.value.trim()}`,
        "Content-Type": "application/json",
        "X-GitHub-Api-Version": "2022-11-28",
      };
      const request = async (path, options = {}) => {
        const response = await fetch(`${apiRoot}${path}`, { ...options, headers });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.message || `GitHub returned ${response.status}.`);
        return result;
      };

      setMessage("Reading the latest version from GitHub…");
      const reference = await request("/git/ref/heads/main");
      const parent = await request(`/git/commits/${reference.object.sha}`);
      const encodedPath = pdfPath.split("/").map(encodeURIComponent).join("/");
      const existing = await fetch(`${apiRoot}/contents/${encodedPath}?ref=main`, { headers });
      if (existing.ok) throw new Error(`A resource named ${slug}.pdf already exists. Choose a more specific title.`);
      if (existing.status !== 404) {
        const result = await existing.json().catch(() => ({}));
        throw new Error(result.message || `Could not check the destination (${existing.status}).`);
      }

      setMessage("Uploading the PDF…");
      const pdfBlob = await request("/git/blobs", {
        method: "POST",
        body: JSON.stringify({ content: await fileAsBase64(pdf), encoding: "base64" }),
      });
      const sidecarBlob = await request("/git/blobs", {
        method: "POST",
        body: JSON.stringify({ content: textAsBase64(sidecar), encoding: "base64" }),
      });
      const tree = await request("/git/trees", {
        method: "POST",
        body: JSON.stringify({
          base_tree: parent.tree.sha,
          tree: [
            { path: pdfPath, mode: "100644", type: "blob", sha: pdfBlob.sha },
            { path: sidecarPath, mode: "100644", type: "blob", sha: sidecarBlob.sha },
          ],
        }),
      });
      const commit = await request("/git/commits", {
        method: "POST",
        body: JSON.stringify({
          message: `Add PDF resource: ${title}`,
          tree: tree.sha,
          parents: [reference.object.sha],
        }),
      });

      setMessage("Publishing the new version…");
      await request("/git/refs/heads/main", {
        method: "PATCH",
        body: JSON.stringify({ sha: commit.sha, force: false }),
      });

      form.reset();
      fields.namedItem("pin_weight").value = "100";
      setMessage(`Published “${title}”. The resource will appear after the Pages build finishes.`, "success");
    } catch (error) {
      setMessage(`Upload failed: ${error.message}`, "error");
    } finally {
      tokenField.value = "";
      button.disabled = false;
    }
  });
})();
