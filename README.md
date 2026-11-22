# Og Smart Homes — Website & Static Blog System

A high-performance, SEO-optimized website and static file-based blog for **Og Smart Homes**, a luxury smart home automation company operating across Lagos, Abuja, and Port Harcourt, Nigeria. Built with React 19, TypeScript 7, Tailwind CSS v4, and Vite 8.

---

## 📚 Blog System Architecture

The blog is 100% static, crawlable, and file-based. There is no runtime backend and no database.

- **Content Storage:** `src/content/blog/posts/*.ts` (one typed TypeScript file per post).
- **Post Loader:** `src/lib/blog.ts` loads posts eagerly via Vite's `import.meta.glob`, supporting sorting by date, category filtering, and related post resolution.
- **Images:** Registered in `src/content/blog/images.json` via Unsplash API, served with WebP parameters and responsive `srcset`.
- **Pre-rendering:** `scripts/prerender.ts` automatically generates standalone `.html` files for `/blog`, all category paths, and each individual post (`/blog/:slug/index.html`) during `npm run build`.
- **Search Engine Discovery:** Automatic build-time generation of `public/sitemap.xml`, `public/blog/rss.xml`, and `public/robots.txt`.

---

## ✍️ How to Add a New Post

1. **Create the Content File:**
   Create a new file in `src/content/blog/posts/<your-slug>.ts`:
   ```typescript
   import type { BlogPost } from '../../../lib/blogTypes';

   const post: BlogPost = {
     title: 'Your Article Title Here',
     slug: 'your-slug-here',
     excerpt: 'A brief summary of your article (1-2 sentences)...',
     category: 'lighting-energy', // 'smart-locks' | 'security-cctv' | 'lighting-energy' | 'climate-solar' | 'guides-planning'
     tags: ['tag1', 'tag2', 'tag3'],
     featuredImage: 'https://images.unsplash.com/...',
     featuredImageAlt: 'Descriptive alt text for the featured image',
     metaTitle: 'Title Tag for SEO (< 60 chars) | Og Smart Homes',
     metaDescription: 'Meta description for Google search results (140-160 chars).',
     focusKeyword: 'primary search keyword',
     publishedAt: '2026-03-22',
     updatedAt: '2026-03-22',
     readingTime: '7 min read',
     author: {
       name: 'Tunde Adeyemi',
       role: 'Lead Systems Engineer, Og Smart Homes',
       bio: 'Short bio of the author...',
     },
     faq: [
       {
         question: 'Frequently Asked Question 1?',
         answer: 'Clear, authoritative answer to the question.',
       },
     ],
     relatedSlugs: ['related-slug-1', 'related-slug-2'],
     content: `
   Article markdown content here...

   ## H2 Heading Containing Keyword
   Paragraph copy...
     `,
   };

   export default post;
   ```

2. **Add Image Query (Optional):**
   If using the automated Unsplash script, add an entry to `ALL_POST_QUERIES` in `scripts/fetch-blog-images.ts` matching your slug, or paste your chosen Unsplash image URLs directly.

3. **Build the Site:**
   Run `npm run build`. The new post will automatically be:
   - Added to the `/blog` index and category pages.
   - Pre-rendered into `dist/blog/<your-slug>/index.html` with its own SEO `<head>` and JSON-LD structured data.
   - Added to `dist/sitemap.xml` and `dist/blog/rss.xml`.

---

## 📷 How to Rerun the Image Script and Swap an Image

The image fetch script runs locally and communicates with the Unsplash API using the `UNSPLASH_ACCESS_KEY` in your `.env` file. It registers official download events and caches all image records in `src/content/blog/images.json`.

### Fetching Images for Posts
To fetch or update images for specific batches:
```bash
# Fetch a specific batch (1, 2, 3, or 4):
npx tsx scripts/fetch-blog-images.ts 1

# Fetch for a single specific post slug:
npx tsx scripts/fetch-blog-images.ts smart-door-locks-buyers-guide

# Fetch all missing images:
npx tsx scripts/fetch-blog-images.ts all
```

### Swapping an Image Manually
1. Open `src/content/blog/images.json`.
2. Locate the post entry key (e.g. `"smart-door-locks-buyers-guide"`).
3. Replace the `rawUrl`, `id`, `alt`, `photographerName`, and `photographerProfileUrl` fields with your desired photo details.
4. Update the corresponding post file in `src/content/blog/posts/<slug>.ts` if the featured image was swapped.
5. Run `npm run build` to re-generate the pre-rendered HTML.

---

## ⚙️ How Sitemap, RSS, and Prerender Run on Build

Running `npm run build` triggers a two-stage build pipeline defined in `package.json`:
```json
"build": "vite build && tsx scripts/postbuild.ts"
```

1. **Vite Compilation:** Compiles the client React bundle into `dist/`, including code-split chunks for `BlogIndex`, `BlogPost`, `BlogCategory`, and `BlogNotFound`.
2. **Post-Build Pipeline (`scripts/postbuild.ts`):**
   - **`scripts/generate-sitemap.ts`:** Reads all static post files in `src/content/blog/posts/*.ts` and core site routes, generating `dist/sitemap.xml` and `public/sitemap.xml`.
   - **`scripts/generate-rss.ts`:** Generates `dist/blog/rss.xml` and `public/blog/rss.xml` with full `<item>` feeds.
   - **`scripts/prerender.ts`:** Dynamically renders static HTML for `/blog`, `/blog/category/:slug`, and all 20 `/blog/:slug` routes. Injects:
     - Crawlable semantic HTML into `<div id="root">`.
     - Complete `<title>`, meta description, canonical `<link>`, Open Graph, and Twitter Cards.
     - Schema.org JSON-LD structured data: `Article`, `BreadcrumbList`, and `FAQPage`.
   - **Robots.txt:** Copies `public/robots.txt` into `dist/` referencing `https://ogsmarthomes.com/sitemap.xml`.

---

## 🚀 Development & Testing Commands

```bash
# Start local development server:
npm run dev

# Run TypeScript typecheck:
npm run lint

# Build production bundle with full static SSG prerender:
npm run build

# Preview built production files locally:
npm run preview
```
