#!/usr/bin/env node
/**
 * StackPick "Alternatives" Page Generator
 * Usage: node generate-alternatives.mjs --data <json> --tool "Shopify"
 * Or:    node generate-alternatives.mjs --data <json> --all
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const args = process.argv.slice(2);
const dataFlag = args.indexOf('--data');
const toolFlag = args.indexOf('--tool');
const allFlag = args.includes('--all');

if (dataFlag === -1) {
  console.error('Usage: node generate-alternatives.mjs --data <json> [--tool "X" | --all]');
  process.exit(1);
}

const data = JSON.parse(readFileSync(resolve(args[dataFlag + 1]), 'utf-8'));
const category = data.category;

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function generatePage(mainTool, alternatives) {
  const slug = `${slugify(mainTool.name)}-alternatives`;
  const title = `Top ${alternatives.length} ${mainTool.name} Alternatives in 2026`;
  const desc = `Looking for ${mainTool.name} alternatives? We compared ${alternatives.length} similar ${category.toLowerCase()} tools by features, pricing, and value.`;
  const url = `https://stackpick-89q.pages.dev/${slug}`;

  const altCards = alternatives.map((t, i) => `
  <div class="tool-card" id="${t.slug}">
    <h3>#${i + 1} ${t.name} — $${t.startingPrice}/mo</h3>
    <p><strong>Best for:</strong> ${t.bestFor}</p>
    <p><strong>Why switch from ${mainTool.name}:</strong> ${t.pros[0]}</p>
    <ul>
${t.features.slice(0, 4).map(f => `      <li>${f}</li>`).join('\n')}
    </ul>
    <div class="pros-cons">
      <div class="pros"><h4>Pros</h4><ul>${t.pros.slice(0, 3).map(p => `<li>${p}</li>`).join('')}</ul></div>
      <div class="cons"><h4>Cons</h4><ul>${t.cons.slice(0, 2).map(c => `<li>${c}</li>`).join('')}</ul></div>
    </div>
    <a href="${t.affiliateUrl}" class="cta-button" rel="nofollow sponsored">Try ${t.name} →</a>
  </div>`).join('\n');

  const quickTable = alternatives.map((t, i) => `
      <tr>
        <td>${i + 1}</td>
        <td><strong>${t.name}</strong></td>
        <td>$${t.startingPrice}/mo</td>
        <td>${t.rating}/5</td>
        <td>${t.bestFor}</td>
      </tr>`).join('');

  return { slug, content: `---
const title = ${JSON.stringify(title)};
const description = ${JSON.stringify(desc)};
---

<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>{title}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href="${url}" />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:type" content="article" />
  <script type="application/ld+json" set:html={JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "dateModified": "2026-04-05",
    "author": { "@type": "Organization", "name": "StackPick" },
    "publisher": { "@type": "Organization", "name": "StackPick" }
  })} />
  <style>@import '../styles/global.css';</style>
</head>
<body>

<div class="hero">
  <div class="container">
    <h1>${mainTool.name} Alternatives: ${alternatives.length} Best Options in 2026</h1>
    <p>Not sold on ${mainTool.name}? Here are the best alternatives, compared by features and pricing.</p>
    <div class="meta">Updated April 2026 · 6 min read</div>
  </div>
</div>

<div class="container">

  <div class="disclosure">
    <strong>Disclosure:</strong> StackPick earns a commission when you purchase through our links at no extra cost to you.
  </div>

  <h2>Quick Comparison</h2>
  <table class="comparison-table">
    <thead><tr><th>#</th><th>Alternative</th><th>Price</th><th>Rating</th><th>Best For</th></tr></thead>
    <tbody>${quickTable}
    </tbody>
  </table>

${altCards}

  <h2>Why Look for ${mainTool.name} Alternatives?</h2>
  <p>While ${mainTool.name} is a solid ${category.toLowerCase()} tool rated ${mainTool.rating}/5, it's not perfect for everyone. Common reasons to switch:</p>
  <ul>
${mainTool.cons.map(c => `    <li>${c}</li>`).join('\n')}
  </ul>

  <footer>
    <p>© 2026 StackPick. All rights reserved.</p>
  </footer>

</div>
</body>
</html>` };
}

const toolNames = allFlag
  ? data.tools.map(t => t.name)
  : [args[toolFlag + 1]];

let count = 0;
for (const name of toolNames) {
  const main = data.tools.find(t => t.name.toLowerCase() === name.toLowerCase());
  if (!main) { console.error(`Tool not found: ${name}`); continue; }
  const alts = data.tools.filter(t => t.name !== main.name);
  const { slug, content } = generatePage(main, alts);
  writeFileSync(resolve('src/pages', `${slug}.astro`), content);
  console.log(`✓ ${slug}.astro (${alts.length} alternatives)`);
  count++;
}
console.log(`\nDone: ${count} alternatives page(s) generated.`);
