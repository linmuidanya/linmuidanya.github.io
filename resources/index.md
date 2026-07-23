---
layout: default
title: Resources
description: A shelf of documents, examples, and source files.
permalink: /resources/
---
<section class="shell page-intro">
  <p class="eyebrow">02 / Resources</p>
  <h1>Things worth opening.</h1>
  <p>Keep each file beside a Markdown sidecar that describes it. The build reads those sidecars and updates this shelf automatically.</p>
</section>

<section class="shell resource-section" id="documents">
  <div class="resource-section-heading"><span class="resource-icon resource-icon-pdf">PDF</span><h2>Documents</h2></div>
  <div class="resource-grid">
    {% for item in site.data.resources.documents %}
      <a class="resource-card" href="{{ item.path | relative_url }}">
        <span class="resource-card-type">{{ item.type }}</span>
        <strong>{{ item.title }}</strong>
        <span>{{ item.description }}</span>
        {% if item.tags %}<span class="resource-tags">{% for tag in item.tags %}<span class="tag">{{ tag }}</span>{% endfor %}</span>{% endif %}
        <span class="card-arrow" aria-hidden="true">↗</span>
      </a>
    {% endfor %}
  </div>
  <p class="resource-hint">Put <code>lecture-notes.pdf</code> and <code>lecture-notes.md</code> together in <code>resources/documents/</code>.</p>
</section>

<section class="shell resource-section" id="images">
  <div class="resource-section-heading"><span class="resource-icon resource-icon-image">IMG</span><h2>Images</h2></div>
  <div class="resource-grid">
    {% for item in site.data.resources.images %}
      <a class="resource-card" href="{{ item.path | relative_url }}">
        <span class="resource-card-type">{{ item.type }}</span>
        <strong>{{ item.title }}</strong>
        <span>{{ item.description }}</span>
        {% if item.tags %}<span class="resource-tags">{% for tag in item.tags %}<span class="tag">{{ tag }}</span>{% endfor %}</span>{% endif %}
        <span class="card-arrow" aria-hidden="true">↗</span>
      </a>
    {% endfor %}
  </div>
  <p class="resource-hint">Put <code>diagram.png</code> and <code>diagram.md</code> together in <code>assets/images/</code>.</p>
</section>

<section class="shell resource-section" id="source">
  <div class="resource-section-heading"><span class="resource-icon resource-icon-code">&lt;/&gt;</span><h2>Source code</h2></div>
  <div class="resource-grid">
    {% for item in site.data.resources.source %}
      <a class="resource-card" href="{{ item.path | relative_url }}">
        <span class="resource-card-type">{{ item.type }}</span>
        <strong>{{ item.title }}</strong>
        <span>{{ item.description }}</span>
        {% if item.tags %}<span class="resource-tags">{% for tag in item.tags %}<span class="tag">{{ tag }}</span>{% endfor %}</span>{% endif %}
        <span class="card-arrow" aria-hidden="true">↗</span>
      </a>
    {% endfor %}
  </div>
  <p class="resource-hint">Keep <code>hello.lean</code> and <code>hello.md</code> together in <code>resources/source/</code>.</p>
</section>
