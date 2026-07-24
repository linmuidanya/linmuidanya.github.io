---
title: How this site is organized
description: A small Markdown document that is rendered as a preview page.
type: Markdown
tags: [markdown, workflow]
---

## Structure

This is a standalone Markdown resource. Put a file like this in `resources/markdown/` and the build will publish it as a readable preview page. Headings at levels two and three are collected into the outline automatically.

### Ordinary content

It can contain headings, lists, links, code blocks, and images just like a blog post.

## Mathematics

Inline mathematics works with dollar delimiters, for example $e^{i\pi} + 1 = 0$.

<div class="math-display">
\[
  \int_0^1 x^2\,dx = \frac{1}{3}.
\]
</div>

## Code

```python
def square(value: int) -> int:
    return value * value
```
