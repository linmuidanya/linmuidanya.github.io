---
title: Building a quiet corner of the internet
description: Why this site is a folder of Markdown, links, and things still in progress.
type: Essay
reading_time: 3 min
tags: [meta, workflow]
---

This site is deliberately small. A new post is just a new Markdown file in `resources/posts/`, with any clear filename you like. The build reads its Git history, adds the dates, and turns it into a Jekyll post with a stable URL.

Documents, images, Markdown files, and source code all live in their own subfolders under `resources/`. Matching Markdown sidecars describe attached files, so the resource catalogue and preview pages update themselves during every deployment.

The useful part is not the theme. It is the trail: a readable note, a runnable example, and a source file close enough to inspect.
