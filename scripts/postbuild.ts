import { generateSitemapXml } from './generate-sitemap';
import { generateRssXml } from './generate-rss';
import { prerenderAllRoutes } from './prerender';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

async function runPostBuild() {
  console.log('\n========================================');
  console.log('🚀 Running OG Smarthomes SEO & Prerender Build');
  console.log('========================================\n');

  const publicDir = path.resolve(rootDir, 'public');
  const distDir = path.resolve(rootDir, 'dist');

  // 1. Generate Sitemap
  const sitemapXml = generateSitemapXml();
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapXml, 'utf-8');
  if (fs.existsSync(distDir)) {
    fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapXml, 'utf-8');
  }
  console.log('✓ sitemap.xml generated');

  // 2. Generate RSS Feed
  const rssXml = generateRssXml();
  const publicBlogDir = path.join(publicDir, 'blog');
  if (!fs.existsSync(publicBlogDir)) fs.mkdirSync(publicBlogDir, { recursive: true });
  fs.writeFileSync(path.join(publicBlogDir, 'rss.xml'), rssXml, 'utf-8');

  if (fs.existsSync(distDir)) {
    const distBlogDir = path.join(distDir, 'blog');
    if (!fs.existsSync(distBlogDir)) fs.mkdirSync(distBlogDir, { recursive: true });
    fs.writeFileSync(path.join(distBlogDir, 'rss.xml'), rssXml, 'utf-8');
  }
  console.log('✓ blog/rss.xml generated');

  // 3. Ensure robots.txt is in dist
  const robotsSrc = path.join(publicDir, 'robots.txt');
  if (fs.existsSync(robotsSrc) && fs.existsSync(distDir)) {
    fs.copyFileSync(robotsSrc, path.join(distDir, 'robots.txt'));
    console.log('✓ robots.txt copied to dist/');
  }

  // 4. Prerender all blog routes into standalone HTML files
  await prerenderAllRoutes();

  console.log('\n✨ Build complete! All SEO files and static route pages generated.\n');
}

runPostBuild().catch((err) => {
  console.error('Postbuild failed:', err);
  process.exit(1);
});
