#!/usr/bin/env node
/**
 * StackPick Comparison Page Generator
 * Usage: node generate-comparison.mjs --data <json-file> --pair "Tool A,Tool B"
 * Or:    node generate-comparison.mjs --data <json-file> --all
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';

const args = process.argv.slice(2);
const dataFlag = args.indexOf('--data');
const pairFlag = args.indexOf('--pair');
const allFlag = args.includes('--all');

if (dataFlag === -1) {
  console.error('Usage: node generate-comparison.mjs --data <json> [--pair "A,B" | --all]');
  process.exit(1);
}

const data = JSON.parse(readFileSync(resolve(args[dataFlag + 1]), 'utf-8'));
const toolMap = Object.fromEntries(data.tools.map(t => [t.name.toLowerCase(), t]));

function slug(a, b) {
  const s = n => n.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return `${s(a)}-vs-${s(b)}`;
}

function featureRow(label, valA, valB, winA) {
  const clsA = winA === 'a' ? 'win' : winA === 'b' ? 'lose' : '';
  const clsB = winA === 'b' ? 'win' : winA === 'a' ? 'lose' : '';
  return `      <tr>
        <td><strong>${label}</strong></td>
        <td${clsA ? ` class="${clsA}"` : ''}>${valA}</td>
        <td${clsB ? ` class="${clsB}"` : ''}>${valB}</td>
      </tr>`;
}

function prosCons(tool) {
  const pros = tool.pros.map(p => `        <li>${p}</li>`).join('\n');
  const cons = tool.cons.map(c => `        <li>${c}</li>`).join('\n');
  return `  <h2>${tool.name}: Pros &amp; Cons</h2>
  <div class="pros-cons">
    <div class="pros">
      <h4>Pros</h4>
      <ul>\n${pros}\n      </ul>
    </div>
    <div class="cons">
      <h4>Cons</h4>
      <ul>\n${cons}\n      </ul>
    </div>
  </div>`;
}

function generatePage(toolA, toolB) {
  const title = `${toolA.name} vs ${toolB.name} (2026): Which Is Better?`;
  const desc = `Detailed comparison of ${toolA.name} vs ${toolB.name}. Compare pricing, features, performance, and support to pick the right tool.`;
  const pageSlug = slug(toolA.name, toolB.name);
  const url = `https://stackpick.co/${pageSlug}`;
  const category = data.category;

  const cheaperIntro = toolA.startingPrice <= toolB.startingPrice ? 'a' : 'b';
  const cheaperRenewal = (toolA.renewalPrice || 999) <= (toolB.renewalPrice || 999) ? 'a' : 'b';
  const higherRating = toolA.rating >= toolB.rating ? 'a' : 'b';

  const winner = toolA.rating >= toolB.rating ? toolA : toolB;
  const budget = toolA.startingPrice <= toolB.startingPrice ? toolA : toolB;

  return `---
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
    <h1>${toolA.name} vs ${toolB.name}: Which Wins in 2026?</h1>
    <p>An honest, data-driven comparison to help you choose the right ${category.toLowerCase()} solution.</p>
    <div class="meta">Updated April 2026 &middot; 7 min read</div>
  </div>
</div>

<div class="container">

  <div class="disclosure">
    <strong>Disclosure:</strong> StackPick earns a commission when you purchase through our links at no extra cost to you. This does not affect our editorial independence.
  </div>

  <div class="verdict-box">
    <h3>Quick Verdict</h3>
    <p><strong>Choose ${toolA.name}</strong> if you ${toolA.bestFor.toLowerCase().startsWith('are') ? toolA.bestFor.toLowerCase() : 'are ' + toolA.bestFor.toLowerCase()}.</p>
    <p><strong>Choose ${toolB.name}</strong> if you ${toolB.bestFor.toLowerCase().startsWith('are') ? toolB.bestFor.toLowerCase() : 'are ' + toolB.bestFor.toLowerCase()}.</p>
    <p><strong>Our pick: ${winner.name}</strong> — rated ${winner.rating}/5 and best suited for most users.</p>
  </div>

  <div class="cta-row">
    <a href="${toolA.affiliateUrl}" class="cta-button cta-secondary" rel="nofollow sponsored">Try ${toolA.name} ($${toolA.startingPrice}/mo)</a>
    <a href="${toolB.affiliateUrl}" class="cta-button" rel="nofollow sponsored">Try ${toolB.name} ($${toolB.startingPrice}/mo)</a>
  </div>

  <h2>Head-to-Head Comparison</h2>

  <table class="comparison-table">
    <thead>
      <tr><th>Feature</th><th>${toolA.name}</th><th>${toolB.name}</th></tr>
    </thead>
    <tbody>
${featureRow('Starting Price', `$${toolA.startingPrice}/mo`, `$${toolB.startingPrice}/mo`, cheaperIntro)}
${featureRow('Renewal Price', `$${toolA.renewalPrice}/mo`, `$${toolB.renewalPrice}/mo`, cheaperRenewal)}
${featureRow('Rating', `${toolA.rating}/5`, `${toolB.rating}/5`, higherRating)}
${featureRow('Best For', toolA.bestFor, toolB.bestFor, '')}
${featureRow('Commission', toolA.commission, toolB.commission, '')}
    </tbody>
  </table>

  <h2>Key Features</h2>

  <div class="tool-card">
    <h3>${toolA.name}</h3>
    <div class="price">$${toolA.startingPrice}<span>/mo starting</span></div>
    <ul>
${toolA.features.map(f => `      <li>${f}</li>`).join('\n')}
    </ul>
  </div>

  <div class="tool-card">
    <h3>${toolB.name}</h3>
    <div class="price">$${toolB.startingPrice}<span>/mo starting</span></div>
    <ul>
${toolB.features.map(f => `      <li>${f}</li>`).join('\n')}
    </ul>
  </div>

${prosCons(toolA)}

${prosCons(toolB)}

  <h2>Who Should Choose Which?</h2>

  <div class="tool-card">
    <h3>Choose ${toolA.name} if you...</h3>
    <ul>
      <li>Want a tool best suited for: ${toolA.bestFor}</li>
      <li>Value: ${toolA.pros[0]}</li>
      <li>Need: ${toolA.features[0]}</li>
    </ul>
    <a href="${toolA.affiliateUrl}" class="cta-button cta-secondary" rel="nofollow sponsored">Get ${toolA.name} from $${toolA.startingPrice}/mo &rarr;</a>
  </div>

  <div class="tool-card">
    <h3>Choose ${toolB.name} if you...</h3>
    <ul>
      <li>Want a tool best suited for: ${toolB.bestFor}</li>
      <li>Value: ${toolB.pros[0]}</li>
      <li>Need: ${toolB.features[0]}</li>
    </ul>
    <a href="${toolB.affiliateUrl}" class="cta-button" rel="nofollow sponsored">Get ${toolB.name} from $${toolB.startingPrice}/mo &rarr;</a>
  </div>

  <h2>Final Verdict</h2>
  <div class="verdict-box">
    <h3>Our Recommendation</h3>
    <p><strong>For most users, ${winner.name} is the better choice</strong> with a ${winner.rating}/5 rating. It excels at serving ${winner.bestFor.toLowerCase()}.</p>
    <p><strong>${budget.name} is the budget-friendly alternative</strong> starting at just $${budget.startingPrice}/mo.</p>
    <div class="cta-row" style="margin-top: 1rem;">
      <a href="${winner.affiliateUrl}" class="cta-button" rel="nofollow sponsored">Get ${winner.name} (Recommended)</a>
      <a href="${budget.affiliateUrl}" class="cta-button cta-secondary" rel="nofollow sponsored">Get ${budget.name} (Budget Pick)</a>
    </div>
  </div>

  <footer>
    <p>&copy; 2026 StackPick. All rights reserved. We may earn commissions from affiliate links.</p>
    <p>Last updated: April 2026.</p>
  </footer>

</div>
</body>
</html>`;
}

// Execute
const pairs = allFlag
  ? data.comparisons.map(c => c.pair)
  : [args[pairFlag + 1].split(',').map(s => s.trim())];

let count = 0;
for (const [nameA, nameB] of pairs) {
  const a = toolMap[nameA.toLowerCase()];
  const b = toolMap[nameB.toLowerCase()];
  if (!a || !b) {
    console.error(`Tool not found: ${!a ? nameA : nameB}`);
    continue;
  }
  const pageSlug = slug(a.name, b.name);
  const outPath = resolve('src/pages', `${pageSlug}.astro`);
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, generatePage(a, b));
  console.log(`✓ Generated: ${pageSlug}.astro`);
  count++;
}
console.log(`\nDone: ${count} page(s) generated.`);
