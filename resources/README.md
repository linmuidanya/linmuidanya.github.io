---
layout: default
title: Site notes
permalink: /resources/README/
---
# Updating the shelf

This folder is for files you want people to open directly.

## Add a blog post

Use the site's **Create File** page or create `resources/posts/my-topic.md` with front matter like this:

```yaml
---
title: A useful title
description: One sentence for the archive page.
tags: [topic]
---
```

Write the post below the closing `---`, commit, and push. The build reads Git history for its creation and modification dates, generates the Jekyll post, and publishes it automatically. The filename does not need a date.

## Add a PDF, image, or source file

Put the file and a Markdown sidecar with the same name in one of these folders:

```text
resources/documents/lecture-notes.pdf
resources/documents/lecture-notes.md
```

The sidecar contains the metadata:

```yaml
---
title: Lecture notes
description: Notes from the formal methods course.
type: PDF
tags: [lean, mathematics]
pinned: true
pin_weight: 10
---
```

Set `pinned: true` to keep a resource in the section at the top of the shelf. Lower `pin_weight` values appear first. The **Upload PDF** page creates both the PDF and sidecar for you.

Use the same pattern in `resources/images/` or `resources/source/`. For a standalone Markdown document, put the file in `resources/markdown/` with its own front matter. The Pages workflow runs `scripts/build_resources.rb` before Jekyll, finds matching pairs, creates preview pages, and regenerates `_data/resources.yml`. You do not edit that generated file.

Clicking a resource opens its generated preview: PDFs are embedded, images are shown directly, source files are loaded into a readable code block, and Markdown is rendered as HTML. The site has no database and no upload service. Git is the source of truth, which means every update is reviewable and reversible.
