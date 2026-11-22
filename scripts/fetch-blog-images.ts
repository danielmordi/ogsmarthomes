import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables from .env
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
const IMAGES_JSON_PATH = path.resolve(rootDir, 'src/content/blog/images.json');
const POSTS_DIR = path.resolve(rootDir, 'src/content/blog/posts');

interface UnsplashUser {
  name: string;
  links: {
    html: string;
  };
}

interface UnsplashPhoto {
  id: string;
  width: number;
  height: number;
  description: string | null;
  alt_description: string | null;
  urls: {
    raw: string;
    full: string;
    regular: string;
  };
  links: {
    download_location: string;
  };
  user: UnsplashUser;
}

interface BlogImageRecord {
  id: string;
  rawUrl: string;
  width: number;
  height: number;
  alt: string;
  photographerName: string;
  photographerProfileUrl: string;
}

interface PostImagesData {
  featured: BlogImageRecord;
  body: BlogImageRecord[];
}

type ImagesDb = Record<string, PostImagesData>;

// Track all selected photo IDs to ensure no duplicate photos across any posts
const usedPhotoIds = new Set<string>();

function loadExistingImagesDb(): ImagesDb {
  if (fs.existsSync(IMAGES_JSON_PATH)) {
    try {
      const data = JSON.parse(fs.readFileSync(IMAGES_JSON_PATH, 'utf-8'));
      // Pre-populate usedPhotoIds
      for (const slug in data) {
        if (data[slug].featured?.id) usedPhotoIds.add(data[slug].featured.id);
        if (Array.isArray(data[slug].body)) {
          for (const img of data[slug].body) {
            if (img.id) usedPhotoIds.add(img.id);
          }
        }
      }
      return data;
    } catch {
      return {};
    }
  }
  return {};
}

function saveImagesDb(db: ImagesDb) {
  fs.writeFileSync(IMAGES_JSON_PATH, JSON.stringify(db, null, 2), 'utf-8');
}

async function fetchFromUnsplash(endpoint: string): Promise<any> {
  const separator = endpoint.includes('?') ? '&' : '?';
  const url = `${endpoint}${separator}client_id=${UNSPLASH_ACCESS_KEY}`;

  const res = await fetch(url, {
    headers: {
      'Accept-Version': 'v1',
    },
  });

  if (!res.ok) {
    if (res.status === 403) {
      throw new Error('Unsplash API Rate Limit exceeded (50 reqs/hr in demo mode).');
    }
    throw new Error(`Unsplash request failed with status ${res.status}: ${res.statusText}`);
  }

  return res.json();
}

/**
 * Registers download according to Unsplash API terms
 */
async function registerDownload(downloadLocation: string): Promise<void> {
  try {
    await fetchFromUnsplash(downloadLocation);
  } catch (e) {
    console.warn(`Could not register download for ${downloadLocation}:`, e);
  }
}

/**
 * Clean and humanize alt text so it is descriptive and not keyword-stuffed
 */
function cleanAltText(rawAlt: string | null, topicFallback: string): string {
  if (!rawAlt || rawAlt.trim().length < 5) {
    return `Smart home automation installation: ${topicFallback}`;
  }
  const cleaned = rawAlt.replace(/^(a |an |photo of |image of )/i, '');
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

export async function fetchImagesForPost(
  slug: string,
  searchQuery: string,
  topicLabel: string,
  requiredBodyCount = 3
): Promise<PostImagesData | null> {
  const db = loadExistingImagesDb();

  // If already fetched and cached, skip
  if (db[slug] && db[slug].featured && db[slug].body && db[slug].body.length >= requiredBodyCount) {
    console.log(`⚡ [${slug}] Images already cached. Skipping.`);
    return db[slug];
  }

  console.log(`\n🔍 Searching Unsplash for [${slug}] with query: "${searchQuery}"...`);

  const searchUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
    searchQuery
  )}&orientation=landscape&content_filter=high&per_page=15`;

  const searchData = await fetchFromUnsplash(searchUrl);
  const candidates: UnsplashPhoto[] = (searchData.results || []).filter(
    (photo: UnsplashPhoto) => !usedPhotoIds.has(photo.id)
  );

  if (candidates.length < 1 + requiredBodyCount) {
    console.warn(
      `⚠️ Warning: Only found ${candidates.length} unused photos for query "${searchQuery}". Proposing alternative terms may be needed.`
    );
  }

  if (candidates.length === 0) {
    return null;
  }

  // Pick 1 featured image
  const featuredCandidate = candidates[0];
  usedPhotoIds.add(featuredCandidate.id);
  await registerDownload(featuredCandidate.links.download_location);

  const featuredRecord: BlogImageRecord = {
    id: featuredCandidate.id,
    rawUrl: featuredCandidate.urls.raw,
    width: featuredCandidate.width,
    height: featuredCandidate.height,
    alt: cleanAltText(featuredCandidate.alt_description || featuredCandidate.description, topicLabel),
    photographerName: featuredCandidate.user.name,
    photographerProfileUrl: featuredCandidate.user.links.html,
  };

  // Pick in-body images
  const bodyRecords: BlogImageRecord[] = [];
  const bodyCandidates = candidates.slice(1, 1 + requiredBodyCount);

  for (const photo of bodyCandidates) {
    usedPhotoIds.add(photo.id);
    await registerDownload(photo.links.download_location);

    bodyRecords.push({
      id: photo.id,
      rawUrl: photo.urls.raw,
      width: photo.width,
      height: photo.height,
      alt: cleanAltText(photo.alt_description || photo.description, `${topicLabel} detail`),
      photographerName: photo.user.name,
      photographerProfileUrl: photo.user.links.html,
    });
  }

  const postImages: PostImagesData = {
    featured: featuredRecord,
    body: bodyRecords,
  };

  // Save to disk immediately (resumable)
  db[slug] = postImages;
  saveImagesDb(db);
  console.log(`✓ [${slug}] Saved 1 featured + ${bodyRecords.length} body images to images.json`);

  return postImages;
}

export const ALL_POST_QUERIES: Array<{ slug: string; query: string; topic: string }> = [
  // Batch 1 (Posts 1-5)
  {
    slug: 'smart-home-automation-nigeria-guide',
    query: 'smart home living room interior modern',
    topic: 'Smart home automation living space in luxury residence',
  },
  {
    slug: 'smart-door-locks-buyers-guide',
    query: 'smart door lock digital keypad',
    topic: 'Biometric fingerprint digital entrance lock',
  },
  {
    slug: 'cctv-compound-security-architecture',
    query: 'cctv security camera building outdoor',
    topic: 'Outdoor CCTV perimeter security camera setup',
  },
  {
    slug: 'smart-locks-vs-traditional-locks',
    query: 'door lock key handle entrance',
    topic: 'Traditional lock key comparison with smart digital lock',
  },
  {
    slug: 'automate-exterior-perimeter-lighting',
    query: 'modern house exterior lighting night dusk',
    topic: 'Automated exterior architectural lighting at night',
  },
  // Batch 2 (Posts 6-10)
  {
    slug: 'smart-home-solar-inverter-integration',
    query: 'solar panels roof modern house',
    topic: 'Residential solar power and inverter energy setup',
  },
  {
    slug: 'smart-switches-vs-smart-bulbs',
    query: 'modern wall light switch interior',
    topic: 'Smart glass touch wall switch panel',
  },
  {
    slug: 'smart-home-automation-cost-nigeria',
    query: 'luxury living room modern interior architecture',
    topic: 'High-end smart home automation interior',
  },
  {
    slug: 'video-doorbell-vs-intercom-compound-gates',
    query: 'video doorbell front door entrance',
    topic: 'Smart video doorbell and entrance intercom',
  },
  {
    slug: 'professional-smart-home-installation-vs-diy',
    query: 'technician electrician wiring panel',
    topic: 'Professional electrical wiring and smart home installation',
  },
  // Batch 3 (Posts 11-15)
  {
    slug: 'automate-air-conditioners-cut-electricity-inverter',
    query: 'air conditioner modern interior living room',
    topic: 'Air conditioner climate control in modern home',
  },
  {
    slug: 'retrofitting-smart-home-existing-house',
    query: 'modern living room sofa renovation',
    topic: 'Retrofitting smart home into existing modern apartment',
  },
  {
    slug: 'smart-home-privacy-network-security',
    query: 'cyber security technology wifi router',
    topic: 'Smart home data privacy and secure Wi-Fi router network',
  },
  {
    slug: 'zigbee-vs-zwave-vs-wifi-smart-home-protocols',
    query: 'smart home device wireless technology',
    topic: 'Smart home wireless hub and protocol connectivity',
  },
  {
    slug: 'automated-smart-curtains-blinds-guide',
    query: 'curtains window sunlight modern living room',
    topic: 'Motorized smart window curtains with sunlight in modern interior',
  },
  // Batch 4 (Posts 16-20)
  {
    slug: 'smart-home-sensors-water-gas-smoke-prevention',
    query: 'smoke detector ceiling modern white',
    topic: 'Smart security and emergency detector installed on ceiling',
  },
  {
    slug: 'voice-control-alexa-google-assistant-smart-home',
    query: 'smart speaker voice assistant table',
    topic: 'Voice assistant smart speaker on wooden side table',
  },
  {
    slug: 'smart-home-troubleshooting-offline-devices-wifi',
    query: 'wifi router modern technology living room',
    topic: 'Smart home Wi-Fi mesh router troubleshooting',
  },
  {
    slug: 'estate-compound-security-lagos-abuja',
    query: 'luxury villa modern house exterior gate',
    topic: 'Modern private estate villa perimeter entrance and gate',
  },
  {
    slug: 'smart-home-site-survey-what-to-expect',
    query: 'architect blueprint floor plan table',
    topic: 'Smart home site survey inspection and floor plan review',
  },
];

export async function runBatchImageFetch(
  postQueries: Array<{ slug: string; query: string; topic: string }>
) {
  if (!UNSPLASH_ACCESS_KEY || UNSPLASH_ACCESS_KEY.length < 10) {
    throw new Error('UNSPLASH_ACCESS_KEY is missing or invalid in .env file!');
  }

  console.log(`Starting Unsplash image batch for ${postQueries.length} posts...`);

  for (const item of postQueries) {
    try {
      await fetchImagesForPost(item.slug, item.query, item.topic);
      // Small pause to respect API rate limits smoothly
      await new Promise((resolve) => setTimeout(resolve, 400));
    } catch (e: any) {
      console.error(`Error fetching images for ${item.slug}:`, e.message);
      if (e.message.includes('Rate Limit')) {
        console.warn('Paused batch. Resume again when rate limit resets.');
        break;
      }
    }
  }

  console.log('✓ Image fetch batch step finished.');
}

async function main() {
  const arg = process.argv[2] || '1';

  let selectedQueries: typeof ALL_POST_QUERIES = [];
  if (arg === '1') {
    selectedQueries = ALL_POST_QUERIES.slice(0, 5);
  } else if (arg === '2') {
    selectedQueries = ALL_POST_QUERIES.slice(5, 10);
  } else if (arg === '3') {
    selectedQueries = ALL_POST_QUERIES.slice(10, 15);
  } else if (arg === '4') {
    selectedQueries = ALL_POST_QUERIES.slice(15, 20);
  } else if (arg === 'all') {
    selectedQueries = ALL_POST_QUERIES;
  } else {
    // Single post slug
    const found = ALL_POST_QUERIES.find((q) => q.slug === arg);
    if (found) {
      selectedQueries = [found];
    } else {
      console.error(`Unknown batch or post slug: ${arg}`);
      process.exit(1);
    }
  }

  console.log(`\n📷 Fetching Unsplash images for ${selectedQueries.length} posts (${arg})...\n`);
  await runBatchImageFetch(selectedQueries);
}

if (process.argv[1] && process.argv[1].endsWith('fetch-blog-images.ts')) {
  main().catch((err) => {
    console.error('Image fetch script failed:', err);
    process.exit(1);
  });
}
