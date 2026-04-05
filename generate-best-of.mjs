#!/usr/bin/env node
/**
 * StackPick "Best Of" Category Landing Page Generator
 * Usage: node generate-best-of.mjs --data <json-file> --slug "best-web-hosting"
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const args = process.argv.slice(2);
const dataFlag = args.indexOf('--data');
const slugFlag = args.indexOf('--slug');

if (dataFlag === -1 || slugFlag === -1) {
  console.error('Usage: node generate-best-of.mjs --data <json> --slug <page-slug>');
  process.exit(1);
}

const data = JSON.parse(readFileSync(resolve(args[dataFlag + 1]), 'utf-8'));
const pageSlug = args[slugFlag + 1];
const category = data.category;
const tools = data.tools;

function toolCard(tool, rank) {
  const features = tool.features.map(f => `      <li>${f}</li>`).join('\n');
  const pros = tool.pros.slice(0, 3).map(p => `      <li>${p}</li>`).join('\n');
  return `
  <div class="tool-card" id="${tool.slug}">
    <h3>#${rank} ${tool.name} ${rank === 1 ? '— Best Overall' : rank === 2 ? '— Runner Up' : ''}</h3>
    <div class="price">$${tool.startingPrice}<span>/mo starting</span></div>
    <p><strong>Best for:</strong> ${tool.bestFor} &middot; <span class="rating">${'★'.repeat(Math.round(tool.rating))}${'☆'.repeat(5 - Math.round(tool.rating))}</span> ${tool.rating}/5</p>
    <ul>\n${features}\n    </ul>
    <h4>Why we picked it:</h4>
    <ul>\n${pros}\n    </ul>
    <a href="${tool.affiliateUrl}" class="cta-button" rel="nofollow sponsored">Try ${tool.name} &rarr;</a>
  </div>`;
}

const title = `Best ${category} in 2026: Top ${tools.length} Picks Compared`;
const desc = `We tested and compared the top ${tools.length} ${category.toLowerCase()} tools. See our honest rankings with pricing, features, and pros/cons for each.`;
const url = `https://stackpick.co/${pageSlug}`;

const comparisonsHtml = data.comparisons.map(c =>
  `    <li><a href="/${c.slug}">${c.pair[0]} vs ${c.pair[1]}</a></li>`
).join('\n');

const quickTable = tools.map((t, i) => `
      <tr>
        <td>${i + 1}</td>
        <td><strong>${t.name}</strong></td>
        <td>$${t.startingPrice}/mo</td>
        <td>${t.rating}/5</td>
        <td>${t.bestFor}</td>
        <td><a href="${t.affiliateUrl}" rel="nofollow sponsored">Visit</a></td>
      </tr>`).join('');

const page = `---
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
    "dateModified": "2026-04-04",
    "author": { "@type": "Organization", "name": "StackPick" },
    "publisher": { "@type": "Organization", "name": "StackPick" }
  })} />
  <style>@import '../styles/global.css';</style>
</head>
<body>

<div class="hero">
  <div class="container">
    <h1>Best ${category} in 2026</h1>
    <p>We tested ${tools.length} ${category.toLowerCase()} tools and ranked them by features, pricing, performance, and value.</p>
    <div class="meta">Updated April 2026 &middot; 10 min read</div>
  </div>
</div>

<div class="container">

  <div class="disclosure">
    <strong>Disclosure:</strong> StackPick earns a commission when you purchase through our links at no extra cost to you. This does not affect our editorial rankings.
  </div>

  <h2>Quick Comparison</h2>
  <table class="comparison-table">
    <thead>
      <tr><th>#</th><th>Tool</th><th>Price</th><th>Rating</th><th>Best For</th><th>Link</th></tr>
    </thead>
    <tbody>${quickTable}
    </tbody>
  </table>

${tools.map((t, i) => toolCard(t, i + 1)).join('\n')}

  <h2>Head-to-Head Comparisons</h2>
  <p>Want a deeper dive? Check out our detailed comparisons:</p>
  <ul>
${comparisonsHtml}
  </ul>

  <h2>How We Tested</h2>
  <p>We evaluated each ${category.toLowerCase()} tool based on:</p>
  <ul>
    <li><strong>Pricing:</strong> Starting cost, renewal pricing, free plan availability</li>
    <li><strong>Features:</strong> Core functionality, unique differentiators</li>
    <li><strong>Ease of Use:</strong> Setup time, learning curve, interface quality</li>
    <li><strong>Support:</strong> Response time, quality, available channels</li>
    <li><strong>Value:</strong> Feature-to-price ratio for small businesses</li>
  </ul>

  <footer>
    <p>&copy; 2026 StackPick. All rights reserved.</p>
    <p>Last updated: April 2026.</p>
  </footer>

</div>
</body>
</html>`;

const outPath = resolve('src/pages', `${pageSlug}.astro`);
writeFileSync(outPath, page);
console.log(`✓ Generated: ${pageSlug}.astro (${tools.length} tools)`);
