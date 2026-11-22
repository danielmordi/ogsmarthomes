import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const SITE_URL = 'https://ogsmarthomes.com';

const CATEGORIES = [
  'smart-locks',
  'security-cctv',
  'lighting-energy',
  'climate-solar',
  'guides-planning',
];

interface SimplePostMeta {
  slug: string;
  publishedAt: string;
  updatedAt?: string;
}

function loadPostsFromDisk(): SimplePostMeta[] {
  const postsDir = path.resolve(rootDir, 'src/content/blog/posts');
  if (!fs.existsSync(postsDir)) {
    return [];
  }

  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith('.ts') || f.endsWith('.json'));
  const posts: SimplePostMeta[] = [];

  for (const file of files) {
    try {
      const content = fs.readFileSync(path.join(postsDir, file), 'utf-8');
      const slugMatch = content.match(/slug:\s*['"]([^'"]+)['"]/);
      const publishedMatch = content.match(/publishedAt:\s*['"]([^'"]+)['"]/);
      const updatedMatch = content.match(/updatedAt:\s*['"]([^'"]+)['"]/);

      if (slugMatch && slugMatch[1]) {
        posts.push({
          slug: slugMatch[1],
          publishedAt: publishedMatch ? publishedMatch[1] : new Date().toISOString().split('T')[0],
          updatedAt: updatedMatch ? updatedMatch[1] : undefined,
        });
      }
    } catch (e) {
      console.warn(`Could not parse post file ${file}:`, e);
    }
  }

  return posts;
}

export function generateSitemapXml(): string {
  const posts = loadPostsFromDisk();
  const today = new Date().toISOString().split('T')[0];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // 1. Homepage
  xml += `  <url>\n`;
  xml += `    <loc>${SITE_URL}/</loc>\n`;
  xml += `    <lastmod>${today}</lastmod>\n`;
  xml += `    <changefreq>weekly</changefreq>\n`;
  xml += `    <priority>1.0</priority>\n`;
  xml += `  </url>\n`;

  // 2. Blog Index
  xml += `  <url>\n`;
  xml += `    <loc>${SITE_URL}/blog</loc>\n`;
  xml += `    <lastmod>${today}</lastmod>\n`;
  xml += `    <changefreq>daily</changefreq>\n`;
  xml += `    <priority>0.9</priority>\n`;
  xml += `  </url>\n`;

  // 3. Category Pages
  for (const cat of CATEGORIES) {
    xml += `  <url>\n`;
    xml += `    <loc>${SITE_URL}/blog/category/${cat}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.8</priority>\n`;
    xml += `  </url>\n`;
  }

  // 4. Post Pages
  for (const post of posts) {
    const lastmod = post.updatedAt || post.publishedAt || today;
    xml += `  <url>\n`;
    xml += `    <loc>${SITE_URL}/blog/${post.slug}</loc>\n`;
    xml += `    <lastmod>${lastmod}</lastmod>\n`;
    xml += `    <changefreq>monthly</changefreq>\n`;
    xml += `    <priority>0.8</priority>\n`;
    xml += `  </url>\n`;
  }

  // 5. Legal Pages
  const legalPages = [
    '/privacy-policy',
    '/terms-and-conditions',
    '/cookie-policy',
    '/refund-and-warranty-policy',
  ];
  for (const page of legalPages) {
    xml += `  <url>\n`;
    xml += `    <loc>${SITE_URL}${page}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>monthly</changefreq>\n`;
    xml += `    <priority>0.5</priority>\n`;
    xml += `  </url>\n`;
  }

  xml += `</urlset>\n`;
  return xml;
}

function main() {
  const xml = generateSitemapXml();

  // Write to public/
  const publicDir = path.resolve(rootDir, 'public');
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), xml, 'utf-8');
  console.log('✓ Generated public/sitemap.xml');

  // Also write to dist/ if dist exists
  const distDir = path.resolve(rootDir, 'dist');
  if (fs.existsSync(distDir)) {
    fs.writeFileSync(path.join(distDir, 'sitemap.xml'), xml, 'utf-8');
    console.log('✓ Synced to dist/sitemap.xml');
  }
}

if (process.argv[1] && process.argv[1].endsWith('generate-sitemap.ts')) {
  main();
}
