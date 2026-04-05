#!/usr/bin/env node
/**
 * Affiliate Link Updater
 * Usage: node update-affiliate-links.mjs --tool "Bluehost" --url "https://real-affiliate-link.com"
 * Or:    node update-affiliate-links.mjs --batch links.json
 *
 * links.json format:
 * { "Bluehost": "https://...", "SiteGround": "https://..." }
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { execSync } from 'child_process';

const args = process.argv.slice(2);
const batchFlag = args.indexOf('--batch');
const toolFlag = args.indexOf('--tool');
const urlFlag = args.indexOf('--url');

const dataDir = resolve('src/data');
const dataFiles = [
  'web-hosting.json', 'email-marketing.json', 'crm.json',
  'marketing-automation.json', 'ecommerce.json', 'vpn.json',
  'project-management.json', 'website-builders.json', 'lms.json', 'helpdesk.json'
];

function updateTool(toolName, newUrl) {
  let updated = 0;
  for (const file of dataFiles) {
    const path = resolve(dataDir, file);
    const data = JSON.parse(readFileSync(path, 'utf-8'));
    for (const tool of data.tools) {
      if (tool.name.toLowerCase() === toolName.toLowerCase()) {
        const oldUrl = tool.affiliateUrl;
        tool.affiliateUrl = newUrl;
        writeFileSync(path, JSON.stringify(data, null, 2) + '\n');
        console.log(`✓ ${tool.name}: ${oldUrl} → ${newUrl} (in ${file})`);
        updated++;
      }
    }
  }
  return updated;
}

if (batchFlag !== -1) {
  const links = JSON.parse(readFileSync(resolve(args[batchFlag + 1]), 'utf-8'));
  let total = 0;
  for (const [tool, url] of Object.entries(links)) {
    total += updateTool(tool, url);
  }
  console.log(`\nUpdated ${total} tool(s). Now regenerate pages:`);
  console.log('  node generate-comparison.mjs --data src/data/<file>.json --all');
} else if (toolFlag !== -1 && urlFlag !== -1) {
  const count = updateTool(args[toolFlag + 1], args[urlFlag + 1]);
  if (count === 0) console.log('Tool not found in any data file.');
} else {
  console.log('Usage:');
  console.log('  node update-affiliate-links.mjs --tool "Bluehost" --url "https://..."');
  console.log('  node update-affiliate-links.mjs --batch links.json');
}
