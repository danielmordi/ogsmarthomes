import type { BlogPost, BlogCategoryMeta } from './blogTypes';

// Categories configured for Og Smart Homes
export const BLOG_CATEGORIES: BlogCategoryMeta[] = [
  {
    slug: 'smart-locks',
    name: 'Smart Locks & Access',
    description: 'Biometric locks, video intercoms, guest access codes, and keyless entry for Nigerian residences and estates.',
  },
  {
    slug: 'security-cctv',
    name: 'CCTV & Perimeter Security',
    description: 'Weatherproof IP cameras, night vision, compound monitoring, and smartphone alert configurations.',
  },
  {
    slug: 'lighting-energy',
    name: 'Smart Lighting & Switches',
    description: 'Glass touch switches, dimmable cove scenes, sunset-to-sunrise schedules, and motion illumination.',
  },
  {
    slug: 'climate-solar',
    name: 'Solar, Inverter & Climate',
    description: 'Automating AC loads, inverter power monitoring, and protecting smart devices during power switchovers.',
  },
  {
    slug: 'guides-planning',
    name: 'Installation & Buying Guides',
    description: 'Cost breakdowns, retrofitting older homes, DIY vs professional installation, and site survey advice.',
  },
];

// Helper to normalize category slugs
export function getCategoryBySlug(slug: string): BlogCategoryMeta | undefined {
  return BLOG_CATEGORIES.find((cat) => cat.slug.toLowerCase() === slug.toLowerCase());
}

// Statically discover all post modules inside /src/content/blog/posts/
// Vite's import.meta.glob with eager: true resolves synchronously at build time.
function loadAllRawPosts(): BlogPost[] {
  const modules = import.meta.glob<{ default: BlogPost }>(
    '/src/content/blog/posts/*.ts',
    { eager: true }
  );

  const posts: BlogPost[] = [];
  for (const path in modules) {
    const mod = modules[path];
    if (mod && mod.default && mod.default.slug) {
      posts.push(mod.default);
    }
  }

  // Sort descending by publishedAt (newest first)
  return posts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

/** Get all posts sorted by publication date (descending) */
export function getAllPosts(): BlogPost[] {
  return loadAllRawPosts();
}

/** Get a single post by slug */
export function getPostBySlug(slug: string): BlogPost | undefined {
  const posts = getAllPosts();
  return posts.find((p) => p.slug.toLowerCase() === slug.toLowerCase());
}

/** Get posts filtered by category slug */
export function getPostsByCategory(categorySlug: string): BlogPost[] {
  const posts = getAllPosts();
  return posts.filter(
    (p) => p.category.toLowerCase() === categorySlug.toLowerCase()
  );
}

/** Get related posts for a given post */
export function getRelatedPosts(currentSlug: string, maxCount = 3): BlogPost[] {
  const all = getAllPosts();
  const current = all.find((p) => p.slug.toLowerCase() === currentSlug.toLowerCase());
  if (!current) return all.filter((p) => p.slug !== currentSlug).slice(0, maxCount);

  // First, check explicit relatedSlugs
  if (current.relatedSlugs && current.relatedSlugs.length > 0) {
    const explicitMatches = all.filter((p) =>
      current.relatedSlugs.includes(p.slug) && p.slug !== currentSlug
    );
    if (explicitMatches.length >= maxCount) {
      return explicitMatches.slice(0, maxCount);
    }
    // Fill remainder with same category
    const sameCategory = all.filter(
      (p) =>
        p.category === current.category &&
        p.slug !== currentSlug &&
        !explicitMatches.some((m) => m.slug === p.slug)
    );
    return [...explicitMatches, ...sameCategory].slice(0, maxCount);
  }

  // Default to same category or newest
  const sameCategory = all.filter(
    (p) => p.category === current.category && p.slug !== currentSlug
  );
  if (sameCategory.length >= maxCount) {
    return sameCategory.slice(0, maxCount);
  }

  const others = all.filter(
    (p) => p.slug !== currentSlug && !sameCategory.some((s) => s.slug === p.slug)
  );
  return [...sameCategory, ...others].slice(0, maxCount);
}

/** Get post count per category */
export function getCategoryCounts(): Record<string, number> {
  const posts = getAllPosts();
  const counts: Record<string, number> = {};
  for (const cat of BLOG_CATEGORIES) {
    counts[cat.slug] = 0;
  }
  for (const post of posts) {
    const slug = post.category.toLowerCase();
    counts[slug] = (counts[slug] || 0) + 1;
  }
  return counts;
}
