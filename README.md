# linmuidanya.github.io

A small Jekyll personal site for writing, documents, and source code.

## Local preview

Install Ruby and Bundler, then run:

```sh
bundle install
ruby scripts/build_posts.rb
ruby scripts/build_resources.rb
bundle exec jekyll serve
```

Open `http://localhost:4000`.

## The update workflow

- Open `/write/` on the site to draft, preview, and download Markdown. **Copy and open GitHub** sends new files or edits through GitHub's authenticated editor.
- Open `/upload/` to publish a PDF and its metadata together. The owner-only form uses a fine-grained GitHub token for one request and never stores it.
- Use **Edit homepage** on the homepage to change its title, introduction, and section headings with a live preview, then submit through GitHub.
- Add a post to `resources/posts/any-clear-name.md`; a date is not required in the filename.
- Put a file and same-named Markdown sidecar together in `resources/documents/`, `resources/images/`, or `resources/source/`.
- Put standalone Markdown documents in `resources/markdown/`.
- Add `title`, `description`, `type`, and optional `tags` to the sidecar front matter.
- Add `pinned: true` and an optional `pin_weight` to keep important resources at the top.
- Commit and push to `main`. GitHub Pages rebuilds the site automatically.

The repository includes `.github/workflows/pages.yml`, which derives post dates from Git history, generates resource preview pages, regenerates `_data/resources.yml`, builds the Jekyll site, and deploys it from `main`. In the repository Settings, set Pages to use **GitHub Actions** once; later pushes need no extra configuration.

The browser editor saves one draft in local browser storage. It does not contain a GitHub token: publishing copies the complete Markdown file and opens the signed-in GitHub editor, where you paste and commit it.

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

Post creation time, latest modification time, and revision history come from Git automatically. You do not need to put a date in the filename.

The current course website checkout is intentionally separate from this folder.
