export interface BlogAuthor {
  name: string;
  role: string;
  avatar?: string;
  bio?: string;
}

export interface BlogFAQ {
  question: string;
  answer: string;
}

export interface BlogPost {
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  tags: string[];
  featuredImage: string;
  featuredImageAlt: string;
  metaTitle: string;
  metaDescription: string;
  focusKeyword: string;
  publishedAt: string; // ISO 8601 date string, e.g. "2026-03-15"
  updatedAt: string;
  readingTime: string; // e.g. "6 min read"
  author: BlogAuthor;
  faq: BlogFAQ[];
  relatedSlugs: string[];
  content: string; // Markdown formatted body text
}

export interface BlogImageMeta {
  id: string;
  rawUrl: string;
  width: number;
  height: number;
  alt: string;
  photographerName: string;
  photographerProfileUrl: string;
  downloadLocation?: string;
}

export interface PostImagesRecord {
  featured: BlogImageMeta;
  body: BlogImageMeta[];
}

export type BlogImagesDatabase = Record<string, PostImagesRecord>;

export interface BlogCategoryMeta {
  slug: string;
  name: string;
  description: string;
}
