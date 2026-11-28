import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { FAQS } from '../src/data/siteData';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const SITE_URL = 'https://ogsmarthomes.com';
const SITE_NAME = 'OG Smarthomes';
const DEFAULT_OG_IMAGE = `${SITE_URL}/src/assets/images/hero_wide_with_1795076675422.jpg`;

const CATEGORIES: Record<string, { name: string; description: string }> = {
  'smart-locks': {
    name: 'Smart Locks & Access',
    description: 'Biometric locks, video intercoms, guest access codes, and keyless entry for Nigerian residences and estates.',
  },
  'security-cctv': {
    name: 'CCTV & Perimeter Security',
    description: 'Weatherproof IP cameras, night vision, compound monitoring, and smartphone alert configurations.',
  },
  'lighting-energy': {
    name: 'Smart Lighting & Switches',
    description: 'Glass touch switches, dimmable cove scenes, sunset-to-sunrise schedules, and motion illumination.',
  },
  'climate-solar': {
    name: 'Solar, Inverter & Climate',
    description: 'Automating AC loads, inverter power monitoring, and protecting smart devices during power switchovers.',
  },
  'guides-planning': {
    name: 'Installation & Buying Guides',
    description: 'Cost breakdowns, retrofitting older homes, DIY vs professional installation, and site survey advice.',
  },
};

interface FAQItem {
  question: string;
  answer: string;
}

interface PostData {
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  tags?: string[];
  featuredImage?: string;
  featuredImageAlt?: string;
  metaTitle?: string;
  metaDescription?: string;
  focusKeyword?: string;
  publishedAt: string;
  updatedAt?: string;
  readingTime?: string;
  author: {
    name: string;
    role: string;
    bio?: string;
  };
  faq?: FAQItem[];
  content: string;
}

async function loadAllPosts(): Promise<PostData[]> {
  const postsDir = path.resolve(rootDir, 'src/content/blog/posts');
  if (!fs.existsSync(postsDir)) {
    return [];
  }

  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith('.ts'));
  const posts: PostData[] = [];

  for (const file of files) {
    try {
      const fullPath = path.join(postsDir, file);
      const fileUrl = pathToFileURL(fullPath).href;
      // Dynamically import via tsx
      const mod = await import(fileUrl);
      const post = mod.default || mod;
      if (post && post.slug) {
        posts.push(post as PostData);
      }
    } catch (e) {
      console.warn(`Error importing post ${file}:`, e);
    }
  }

  return posts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function renderHeadTags(options: {
  title: string;
  description: string;
  canonicalUrl: string;
  ogType?: 'website' | 'article';
  ogImage?: string;
  ogImageAlt?: string;
  publishedAt?: string;
  updatedAt?: string;
  authorName?: string;
  jsonLd?: object[];
}): string {
  const fullTitle = options.title.includes(SITE_NAME) ? options.title : `${options.title} | ${SITE_NAME}`;
  const canonical = options.canonicalUrl.startsWith('http')
    ? options.canonicalUrl
    : `${SITE_URL}${options.canonicalUrl.startsWith('/') ? options.canonicalUrl : `/${options.canonicalUrl}`}`;
  const ogImg = options.ogImage
    ? options.ogImage.startsWith('http')
      ? options.ogImage
      : `${SITE_URL}${options.ogImage}`
    : DEFAULT_OG_IMAGE;

  let tags = `
    <title>${escapeHtml(fullTitle)}</title>
    <meta name="title" content="${escapeHtml(fullTitle)}" />
    <meta name="description" content="${escapeHtml(options.description)}" />
    <link rel="canonical" href="${canonical}" />
    <meta property="og:site_name" content="${SITE_NAME}" />
    <meta property="og:type" content="${options.ogType || 'website'}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:title" content="${escapeHtml(fullTitle)}" />
    <meta property="og:description" content="${escapeHtml(options.description)}" />
    <meta property="og:image" content="${ogImg}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="${canonical}" />
    <meta name="twitter:title" content="${escapeHtml(fullTitle)}" />
    <meta name="twitter:description" content="${escapeHtml(options.description)}" />
    <meta name="twitter:image" content="${ogImg}" />
  `;

  if (options.ogType === 'article') {
    if (options.publishedAt) {
      tags += `    <meta property="article:published_time" content="${options.publishedAt}" />\n`;
    }
    if (options.updatedAt) {
      tags += `    <meta property="article:modified_time" content="${options.updatedAt}" />\n`;
    }
    if (options.authorName) {
      tags += `    <meta property="article:author" content="${escapeHtml(options.authorName)}" />\n`;
    }
  }

  if (options.jsonLd && options.jsonLd.length > 0) {
    for (const schema of options.jsonLd) {
      tags += `    <script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n    </script>\n`;
    }
  }

  return tags;
}

function injectIntoTemplate(
  templateHtml: string,
  headTags: string,
  bodyContent: string
): string {
  // Replace title & description in existing template
  let html = templateHtml;

  // Strip existing <title> and meta description/og/twitter/canonical/json-ld tags from the base template head
  html = html.replace(/<title>[\s\S]*?<\/title>/i, '');
  html = html.replace(/<meta\s+name=["']title["'][^>]*>/i, '');
  html = html.replace(/<meta\s+name=["']description["'][^>]*>/i, '');
  html = html.replace(/<meta\s+property=["']og:[^"']+["'][^>]*>/gi, '');
  html = html.replace(/<meta\s+name=["']twitter:[^"']+["'][^>]*>/gi, '');
  html = html.replace(/<link\s+rel=["']canonical["'][^>]*>/i, '');
  html = html.replace(/<script\s+type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi, '');

  // Inject our rich head tags before </head>
  html = html.replace('</head>', `${headTags}\n  </head>`);

  // Inject body content into <div id="root"></div>
  if (bodyContent) {
    html = html.replace(
      '<div id="root"></div>',
      `<div id="root">${bodyContent}</div>`
    );
  }

  return html;
}

export async function prerenderAllRoutes() {
  const distDir = path.resolve(rootDir, 'dist');
  const templatePath = path.join(distDir, 'index.html');

  if (!fs.existsSync(templatePath)) {
    console.error('dist/index.html not found! Run "vite build" first.');
    return;
  }

  const baseTemplate = fs.readFileSync(templatePath, 'utf-8');
  const posts = await loadAllPosts();
  console.log(`Prerendering homepage, ${posts.length} blog posts, and category routes...`);

  // 0. Prerender Homepage (/) into dist/index.html
  const homeDescription =
    'Upgrade your home with smart door locks, CCTV, lighting & switches across Lagos, Abuja & Port Harcourt. Get a custom smart home plan and itemised quote today.';
  const homeSchemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE_NAME,
      url: `${SITE_URL}/`,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'HomeAndConstructionBusiness',
      name: SITE_NAME,
      url: `${SITE_URL}/`,
      image: DEFAULT_OG_IMAGE,
      description: homeDescription,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Lekki Phase 1, Lagos',
        addressCountry: 'NG',
      },
      areaServed: [
        { '@type': 'City', name: 'Lagos' },
        { '@type': 'City', name: 'Abuja' },
        { '@type': 'City', name: 'Port Harcourt' },
      ],
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          opens: '08:00',
          closes: '18:00',
        },
      ],
      sameAs: [
        'https://instagram.com/ogsmarthomes',
        'https://facebook.com/ogsmarthomes',
        'https://linkedin.com/company/ogsmarthomes',
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQS.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    },
  ];

  const homeHead = renderHeadTags({
    title: 'OG Smarthomes | Smart Home Installation in Nigeria',
    description: homeDescription,
    canonicalUrl: '/',
    ogType: 'website',
    jsonLd: homeSchemas,
  });

  const homeStaticBody = `
    <main class="site-container py-12">
      <header>
        <h1>Same Home. Smarter Everything.</h1>
        <p>${escapeHtml(homeDescription)}</p>
        <p><a href="/#survey">Get a custom quote</a> | <a href="/blog">Read Smart Home Guides</a></p>
      </header>
      <section>
        <h2>Smart Home Services Across Lagos, Abuja &amp; Port Harcourt</h2>
        <ul>
          <li>Smart Door Locks &amp; Biometric Access Control</li>
          <li>24/7 CCTV Cameras &amp; Video Doorbells</li>
          <li>Smart Touch Switches &amp; Automated Lighting</li>
          <li>Gate Automation, Intercoms &amp; Solar/Inverter Integration</li>
        </ul>
      </section>
      <section>
        <h2>Frequently Asked Questions</h2>
        <dl>
          ${FAQS.map((f) => `<dt>${escapeHtml(f.question)}</dt><dd>${escapeHtml(f.answer)}</dd>`).join('')}
        </dl>
      </section>
    </main>
  `;

  const homeHtml = injectIntoTemplate(baseTemplate, homeHead, homeStaticBody);
  fs.writeFileSync(templatePath, homeHtml, 'utf-8');
  console.log('✓ Prerendered: /');

  // 1. Prerender /blog/index.html
  const blogDir = path.join(distDir, 'blog');
  if (!fs.existsSync(blogDir)) fs.mkdirSync(blogDir, { recursive: true });

  const blogIndexHead = renderHeadTags({
    title: 'Smart Home Automation Blog & Guides | OG Smarthomes',
    description: 'Comprehensive guides, cost breakdowns, and expert installation advice for smart locks, CCTV cameras, home automation switches, and solar power integration in Nigeria.',
    canonicalUrl: '/blog',
    ogType: 'website',
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
        ],
      },
    ],
  });

  const blogIndexHtml = injectIntoTemplate(
    baseTemplate,
    blogIndexHead,
    `<main class="site-container py-12"><h1 class="text-4xl font-bold">Insights, Guides & Tips for Modern Automated Homes</h1><p class="mt-4 text-lg">Practical advice from experienced automation technicians on securing your residence, choosing reliable smart hardware, reducing energy bills, and integrating solar power in Nigeria.</p></main>`
  );
  fs.writeFileSync(path.join(blogDir, 'index.html'), blogIndexHtml, 'utf-8');
  console.log('✓ Prerendered: /blog');

  // 2. Prerender each category route: /blog/category/:slug/index.html
  for (const [catSlug, catData] of Object.entries(CATEGORIES)) {
    const catDir = path.join(blogDir, 'category', catSlug);
    if (!fs.existsSync(catDir)) fs.mkdirSync(catDir, { recursive: true });

    const catHead = renderHeadTags({
      title: `${catData.name} | Smart Home Guides`,
      description: catData.description,
      canonicalUrl: `/blog/category/${catSlug}`,
      ogType: 'website',
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
            { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
            {
              '@type': 'ListItem',
              position: 3,
              name: catData.name,
              item: `${SITE_URL}/blog/category/${catSlug}`,
            },
          ],
        },
      ],
    });

    const catHtml = injectIntoTemplate(
      baseTemplate,
      catHead,
      `<main class="site-container py-12"><nav aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/blog">Blog</a> / <span>${catData.name}</span></nav><h1 class="text-4xl font-bold mt-4">${catData.name}</h1><p class="mt-2 text-lg">${catData.description}</p></main>`
    );
    fs.writeFileSync(path.join(catDir, 'index.html'), catHtml, 'utf-8');
    console.log(`✓ Prerendered: /blog/category/${catSlug}`);
  }

  // 3. Prerender each post: /blog/:slug/index.html
  for (const post of posts) {
    const postDir = path.join(blogDir, post.slug);
    if (!fs.existsSync(postDir)) fs.mkdirSync(postDir, { recursive: true });

    const postUrl = `${SITE_URL}/blog/${post.slug}`;
    const postImg = post.featuredImage?.startsWith('http')
      ? post.featuredImage
      : `${SITE_URL}${post.featuredImage || ''}`;

    // Build schemas
    const articleSchema = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': postUrl,
      },
      headline: post.title,
      description: post.metaDescription || post.excerpt,
      image: [postImg],
      datePublished: post.publishedAt,
      dateModified: post.updatedAt || post.publishedAt,
      author: {
        '@type': 'Person',
        name: post.author.name,
        jobTitle: post.author.role,
        url: SITE_URL,
      },
      publisher: {
        '@type': 'Organization',
        name: SITE_NAME,
        url: SITE_URL,
        logo: {
          '@type': 'ImageObject',
          url: DEFAULT_OG_IMAGE,
        },
      },
      keywords: post.tags?.join(', ') || post.focusKeyword,
    };

    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
        {
          '@type': 'ListItem',
          position: 3,
          name: CATEGORIES[post.category]?.name || post.category,
          item: `${SITE_URL}/blog/category/${post.category}`,
        },
        { '@type': 'ListItem', position: 4, name: post.title, item: postUrl },
      ],
    };

    const schemas: object[] = [articleSchema, breadcrumbSchema];

    if (post.faq && post.faq.length > 0) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: post.faq.map((q) => ({
          '@type': 'Question',
          name: q.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: q.answer,
          },
        })),
      });
    }

    const postHead = renderHeadTags({
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt,
      canonicalUrl: `/blog/${post.slug}`,
      ogType: 'article',
      ogImage: postImg,
      ogImageAlt: post.featuredImageAlt || post.title,
      publishedAt: post.publishedAt,
      updatedAt: post.updatedAt,
      authorName: post.author.name,
      jsonLd: schemas,
    });

    // Semantic static fallback content for crawlers
    const staticBody = `
      <article class="site-container max-w-[960px] py-12">
        <nav aria-label="Breadcrumb">
          <a href="/">Home</a> / <a href="/blog">Blog</a> / <a href="/blog/category/${post.category}">${CATEGORIES[post.category]?.name || post.category}</a> / <span>${escapeHtml(post.title)}</span>
        </nav>
        <header class="my-6">
          <h1 class="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4">${escapeHtml(post.title)}</h1>
          <p class="text-xl text-[#b9c4d6] leading-relaxed">${escapeHtml(post.excerpt)}</p>
          <div class="text-sm text-gray-400 mt-4">By ${escapeHtml(post.author.name)} · Published on ${post.publishedAt} · ${post.readingTime || '5 min read'}</div>
        </header>
        <div class="prose max-w-none text-gray-200 my-8">
          ${post.content
            .replace(/^###\s+([^\n]+)/gm, '<h3>$1</h3>')
            .replace(/^##\s+([^\n]+)/gm, '<h2>$1</h2>')
            .replace(/^#\s+([^\n]+)/gm, '<h2>$1</h2>')
            .replace(/\n\n+/g, '<br/><br/>')}
        </div>
        ${post.faq && post.faq.length > 0
        ? `<section class="my-8">
                <h2 class="text-2xl font-bold">Frequently Asked Questions</h2>
                <dl class="space-y-4 mt-4">
                  ${post.faq.map((f) => `<dt class="font-semibold text-lg">${escapeHtml(f.question)}</dt><dd class="text-gray-300 ml-4">${escapeHtml(f.answer)}</dd>`).join('')}
                </dl>
              </section>`
        : ''
      }
        <aside class="my-8 p-6 rounded-xl bg-white/10">
          <h3 class="text-xl font-bold">About the Author</h3>
          <p class="font-semibold">${escapeHtml(post.author.name)} — ${escapeHtml(post.author.role)}</p>
          <p class="text-sm text-gray-300">${escapeHtml(post.author.bio || '')}</p>
        </aside>
      </article>
    `;

    const postHtml = injectIntoTemplate(baseTemplate, postHead, staticBody);
    fs.writeFileSync(path.join(postDir, 'index.html'), postHtml, 'utf-8');
    console.log(`✓ Prerendered: /blog/${post.slug}`);
  }

  // 4. Prerender legal pages
  const legalPages = [
    {
      path: 'privacy-policy',
      title: 'Privacy Policy | OG Smarthomes',
      description: 'How OG Smarthomes collects, safeguards, and processes personal information, consultation records, and property security details in accordance with the Nigeria Data Protection Act (NDPA) 2023.',
    },
    {
      path: 'terms-and-conditions',
      title: 'Terms and Conditions | OG Smarthomes',
      description: 'The standard contractual terms governing smart home product purchases, system consultations, engineering quotations, and technical installations by OG Smarthomes.',
    },
    {
      path: 'cookie-policy',
      title: 'Cookie Policy | OG Smarthomes',
      description: 'Information on how OG Smarthomes uses cookies, local storage tokens, and web technologies to ensure site security, remember your demo preferences, and improve user experience.',
    },
    {
      path: 'refund-and-warranty-policy',
      title: 'Refund & Warranty Policy | OG Smarthomes',
      description: 'Clear policies regarding product returns, deposit cancellations, our 90-day installation workmanship guarantee, manufacturer hardware warranties, and surge protection requirements.',
    },
  ];

  for (const page of legalPages) {
    const pageDir = path.join(distDir, page.path);
    if (!fs.existsSync(pageDir)) fs.mkdirSync(pageDir, { recursive: true });

    const head = renderHeadTags({
      title: page.title,
      description: page.description,
      canonicalUrl: `/${page.path}`,
      ogType: 'website',
    });

    const body = `
      <main class="site-container py-12 max-w-[800px]">
        <h1 class="text-3xl font-bold mb-4">${escapeHtml(page.title)}</h1>
        <p class="text-gray-300">${escapeHtml(page.description)}</p>
      </main>
    `;

    const html = injectIntoTemplate(baseTemplate, head, body);
    fs.writeFileSync(path.join(pageDir, 'index.html'), html, 'utf-8');
    console.log(`✓ Prerendered: /${page.path}`);
  }

  console.log(`\n🎉 All ${posts.length} blog routes and 4 legal routes successfully prerendered into standalone HTML files!`);
}

if (process.argv[1] && process.argv[1].endsWith('prerender.ts')) {
  prerenderAllRoutes().catch((err) => {
    console.error('Prerender failed:', err);
    process.exit(1);
  });
}
