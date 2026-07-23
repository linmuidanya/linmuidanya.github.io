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

## Add a PDF or source file

Put the file in `resources/documents/` or `resources/source/`. Then add its title, description, type, and path to `_data/resources.yml`. The path should start with `/resources/`.

The site has no database and no upload service. Git is the source of truth, which means every update is reviewable and reversible.
