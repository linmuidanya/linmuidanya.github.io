---
layout: default
title: Resources
description: A shelf of documents, examples, and source files.
permalink: /resources/
---
<section class="shell page-intro">
  <p class="eyebrow">02 / Resources</p>
  <h1>Things worth opening.</h1>
  <p>Documents, images, Markdown, and source code in one compact library.</p>
</section>

<section class="shell resource-library" data-resource-filter-root>
  <div class="resource-library-toolbar">
    <div><p class="filter-label">Browse by type</p><a class="resource-write-link" href="{{ '/write/' | relative_url }}">Create file <span aria-hidden="true">→</span></a></div>
    <div class="filter-bar" data-resource-filter aria-label="Filter resources by type">
      <button class="filter-button is-active" type="button" data-resource-filter-value="all" aria-pressed="true">All</button>
      <button class="filter-button" type="button" data-resource-filter-value="documents" aria-pressed="false">Documents</button>
      <button class="filter-button" type="button" data-resource-filter-value="images" aria-pressed="false">Images</button>
      <button class="filter-button" type="button" data-resource-filter-value="markdown" aria-pressed="false">Markdown</button>
      <button class="filter-button" type="button" data-resource-filter-value="source" aria-pressed="false">Source</button>
    </div>
  </div>

  <div class="resource-grid" aria-label="All resources">
    {% for item in site.data.resources.documents %}{% include resource-card.html item=item category="documents" %}{% endfor %}
    {% for item in site.data.resources.images %}{% include resource-card.html item=item category="images" %}{% endfor %}
    {% for item in site.data.resources.markdown %}{% include resource-card.html item=item category="markdown" %}{% endfor %}
    {% for item in site.data.resources.source %}{% include resource-card.html item=item category="source" %}{% endfor %}
  </div>
  <p class="empty-state resource-filter-empty" data-resource-filter-empty hidden>No resources use that filter yet.</p>
</section>
