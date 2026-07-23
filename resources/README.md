---
layout: default
title: Site notes
permalink: /resources/README/
---
# Updating the shelf

This folder is for files you want people to open directly.

## Add a blog post

Create `_posts/YYYY-MM-DD-short-title.md` with front matter like this:

```yaml
---
title: A useful title
description: One sentence for the archive page.
tags: [topic]
---
```

Write the post below the closing `---`, commit, and push. Jekyll builds it automatically.

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
---
```

Use the same pattern in `assets/images/` or `resources/source/`. The Pages workflow runs `scripts/build_resources.rb` before Jekyll, finds matching pairs, and regenerates `_data/resources.yml`. You do not edit that generated file.

The site has no database and no upload service. Git is the source of truth, which means every update is reviewable and reversible.
