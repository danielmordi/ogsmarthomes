import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const SITE_URL = 'https://ogsmarthomes.com';
const SITE_NAME = 'OG Smarthomes';

interface PostRecord {
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  authorName?: string;
}

function loadPostsFromDisk(): PostRecord[] {
  const postsDir = path.resolve(rootDir, 'src/content/blog/posts');
  if (!fs.existsSync(postsDir)) {
    return [];
  }

  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith('.ts'));
  const posts: PostRecord[] = [];

  for (const file of files) {
    try {
      const content = fs.readFileSync(path.join(postsDir, file), 'utf-8');
      const titleMatch = content.match(/title:\s*['"]([^'"]+)['"]/);
      const slugMatch = content.match(/slug:\s*['"]([^'"]+)['"]/);
      const excerptMatch = content.match(/excerpt:\s*['"]([^'"]+)['"]/);
      const categoryMatch = content.match(/category:\s*['"]([^'"]+)['"]/);
      const publishedMatch = content.match(/publishedAt:\s*['"]([^'"]+)['"]/);
      const authorMatch = content.match(/name:\s*['"]([^'"]+)['"]/);

      if (titleMatch && slugMatch && excerptMatch) {
        posts.push({
          title: titleMatch[1],
          slug: slugMatch[1],
          excerpt: excerptMatch[1],
          category: categoryMatch ? categoryMatch[1] : 'smart-homes',
          publishedAt: publishedMatch ? publishedMatch[1] : new Date().toISOString(),
          authorName: authorMatch ? authorMatch[1] : 'OG Smarthomes Engineering Team',
        });
      }
    } catch (e) {
      console.warn(`Could not parse post for RSS: ${file}`, e);
    }
  }

  // Sort newest first
  return posts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export function generateRssXml(): string {
  const posts = loadPostsFromDisk();
  const buildDate = new Date().toUTCString();

  let xml = `<?xml version="1.0" encoding="UTF-8" ?>\n`;
  xml += `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">\n`;
  xml += `  <channel>\n`;
  xml += `    <title>${SITE_NAME} | Smart Home Automation Blog</title>\n`;
  xml += `    <link>${SITE_URL}/blog</link>\n`;
  xml += `    <description>Practical guides, installation tips, and advice for smart locks, CCTV, lighting automation, and solar systems in Nigeria.</description>\n`;
  xml += `    <language>en-gb</language>\n`;
  xml += `    <lastBuildDate>${buildDate}</lastBuildDate>\n`;
  xml += `    <atom:link href="${SITE_URL}/blog/rss.xml" rel="self" type="application/rss+xml" />\n`;

  for (const post of posts) {
    const postUrl = `${SITE_URL}/blog/${post.slug}`;
    const pubDate = new Date(post.publishedAt).toUTCString();

    xml += `    <item>\n`;
    xml += `      <title><![CDATA[${post.title}]]></title>\n`;
    xml += `      <link>${postUrl}</link>\n`;
    xml += `      <guid isPermaLink="true">${postUrl}</guid>\n`;
    xml += `      <pubDate>${pubDate}</pubDate>\n`;
    xml += `      <dc:creator><![CDATA[${post.authorName || 'OG Smarthomes'}]]></dc:creator>\n`;
    xml += `      <category><![CDATA[${post.category}]]></category>\n`;
    xml += `      <description><![CDATA[${post.excerpt}]]></description>\n`;
    xml += `    </item>\n`;
  }

  xml += `  </channel>\n`;
  xml += `</rss>\n`;

  return xml;
}

function main() {
  const xml = generateRssXml();

  // Write to public/blog/rss.xml
  const publicBlogDir = path.resolve(rootDir, 'public/blog');
  if (!fs.existsSync(publicBlogDir)) fs.mkdirSync(publicBlogDir, { recursive: true });
  fs.writeFileSync(path.join(publicBlogDir, 'rss.xml'), xml, 'utf-8');
  console.log('✓ Generated public/blog/rss.xml');

  // Also write to dist/blog/rss.xml if dist exists
  const distBlogDir = path.resolve(rootDir, 'dist/blog');
  if (fs.existsSync(distBlogDir)) {
    fs.writeFileSync(path.join(distBlogDir, 'rss.xml'), xml, 'utf-8');
    console.log('✓ Synced to dist/blog/rss.xml');
  }
}

if (process.argv[1] && process.argv[1].endsWith('generate-rss.ts')) {
  main();
}
