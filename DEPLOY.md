# StackPick Deployment Guide

## Option 1: Cloudflare Pages (Recommended)

```bash
# 1. Install Wrangler CLI
npm install -g wrangler

# 2. Login to Cloudflare
wrangler login

# 3. Deploy directly from dist/
wrangler pages deploy dist --project-name=stackpick

# 4. Custom domain setup (in Cloudflare dashboard)
# Go to: Pages > stackpick > Custom domains > Add
# Enter: stackpick.co
# Update DNS: CNAME stackpick.co → stackpick.pages.dev
```

## Option 2: Netlify

```bash
# 1. Install Netlify CLI
npm install -g netlify-cli

# 2. Deploy
netlify deploy --dir=dist --prod
```

## Option 3: Vercel

```bash
npx vercel deploy dist --prod
```

## After Deployment

1. **Google Search Console**
   - Go to https://search.google.com/search-console
   - Add property: stackpick.co
   - Verify via DNS TXT record
   - Submit sitemap: https://stackpick.co/sitemap-index.xml

2. **Register Affiliate Programs** (see affiliate-tracker.json)
   - Priority order: Bluehost, WP Engine, HubSpot, Kinsta, GetResponse
   - Replace placeholder URLs in src/data/*.json after approval
   - Rebuild: `node generate-comparison.mjs --data src/data/xxx.json --all && npx astro build`

3. **Analytics**
   - Add Plausible or Umami script to layout
   - Track: page views, affiliate link clicks, top pages
