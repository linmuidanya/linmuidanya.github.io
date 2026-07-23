---
layout: default
title: Writing
description: Notes on mathematics, programming, and formal methods.
permalink: /notes/
---
<section class="shell page-intro">
  <p class="eyebrow">01 / Writing</p>
  <h1>Notes from the workbench.</h1>
  <p>Short essays, explanations, and working notes. Each one starts as a Markdown file in <code>_posts/</code>, with metadata that keeps the archive easy to scan.</p>
</section>

{% assign all_tags = site.posts | map: "tags" | join: "," | split: "," | uniq | sort %}
<section class="shell writing-archive" data-post-filter-root>
  <div class="filter-bar" aria-label="Filter writing by tag" data-post-filter>
    <span class="filter-label">Filter</span>
    <button class="filter-button is-active" type="button" data-filter="all" aria-pressed="true">All notes</button>
    {% for tag in all_tags %}{% unless tag == "" %}<button class="filter-button" type="button" data-filter="{{ tag | slugify }}" aria-pressed="false">{{ tag }}</button>{% endunless %}{% endfor %}
  </div>
  <div class="post-grid archive-grid" aria-label="All writing">
  {% for post in site.posts %}
    {% capture tag_values %}{% for tag in post.tags %}{{ tag | slugify }} {% endfor %}{% endcapture %}
    <a class="post-card" href="{{ post.url | relative_url }}" data-post-card data-tags="{{ tag_values | strip }}">
      <span class="post-card-meta"><span>{{ post.type | default: "Note" }}</span><time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%d %b %Y" }}</time></span>
      <strong>{{ post.title }}</strong>
      <span class="post-card-description">{{ post.description | default: post.excerpt | strip_html | truncate: 160 }}</span>
      <span class="tag-list">{% for tag in post.tags %}<span class="tag">{{ tag }}</span>{% endfor %}</span>
      <span class="card-arrow" aria-hidden="true">↗</span>
    </a>
  {% else %}
    <p class="empty-state">No notes yet.</p>
  {% endfor %}
  </div>
  <p class="empty-state filter-empty" data-filter-empty hidden>No notes use that tag yet.</p>
</section>
