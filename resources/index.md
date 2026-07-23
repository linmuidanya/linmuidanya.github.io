---
layout: default
title: Resources
description: A shelf of documents, examples, and source files.
permalink: /resources/
---
<section class="shell page-intro">
  <p class="eyebrow">02 / Resources</p>
  <h1>Things worth opening.</h1>
  <p>Keep the file itself in the repository, then add one entry to <code>_data/resources.yml</code>. PDFs open in the browser; source files remain easy to download or inspect on GitHub.</p>
</section>

<section class="shell resource-section" id="documents">
  <div class="resource-section-heading"><span class="resource-icon resource-icon-pdf">PDF</span><h2>Documents</h2></div>
  <div class="resource-grid">
    {% for item in site.data.resources.documents %}
      <a class="resource-card" href="{{ item.path | relative_url }}">
        <span class="resource-card-type">{{ item.type }}</span>
        <strong>{{ item.title }}</strong>
        <span>{{ item.description }}</span>
        <span class="card-arrow" aria-hidden="true">↗</span>
      </a>
    {% endfor %}
  </div>
  <p class="resource-hint">Put PDFs in <code>resources/documents/</code>, then link them here.</p>
</section>

<section class="shell resource-section" id="source">
  <div class="resource-section-heading"><span class="resource-icon resource-icon-code">&lt;/&gt;</span><h2>Source code</h2></div>
  <div class="resource-grid">
    {% for item in site.data.resources.source %}
      <a class="resource-card" href="{{ item.path | relative_url }}">
        <span class="resource-card-type">{{ item.type }}</span>
        <strong>{{ item.title }}</strong>
        <span>{{ item.description }}</span>
        <span class="card-arrow" aria-hidden="true">↗</span>
      </a>
    {% endfor %}
  </div>
  <p class="resource-hint">Keep examples in <code>resources/source/</code> or link to another repository.</p>
</section>
