# linmuidanya.github.io

A small Jekyll personal site for writing, documents, and source code.

## Local preview

Install Ruby and Bundler, then run:

```sh
bundle install
bundle exec jekyll serve
```

Open `http://localhost:4000`.

## The update workflow

- Add a post to `_posts/YYYY-MM-DD-title.md`.
- Put a file and same-named Markdown sidecar together in `resources/documents/`, `assets/images/`, or `resources/source/`.
- Add `title`, `description`, `type`, and optional `tags` to the sidecar front matter.
- Commit and push to `main`. GitHub Pages rebuilds the site automatically.

The repository includes `.github/workflows/pages.yml`, which regenerates `_data/resources.yml`, builds the Jekyll site, and deploys it from `main`. In the repository Settings, set Pages to use **GitHub Actions** once; later pushes need no extra configuration.

## Post metadata

The archive reads these optional front-matter fields:

```yaml
---
title: The title shown on the card and article page
description: A one-sentence summary for the archive
type: Essay
reading_time: 8 min
tags: [lean, mathematics]
---
```

Tags become filter buttons on the Writing page. If `type` or `reading_time` is omitted, the template uses `Note` and `5 min`.

The current course website checkout is intentionally separate from this folder.
