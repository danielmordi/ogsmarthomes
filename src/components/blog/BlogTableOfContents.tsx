import React from 'react';
import { ListOrdered } from 'lucide-react';

export interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

interface BlogTableOfContentsProps {
  items: TocItem[];
}

/**
 * Extracts H2 and H3 headings from markdown text
 */
export function extractHeadingsFromMarkdown(markdown: string): TocItem[] {
  const headings: TocItem[] = [];
  const lines = markdown.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('## ')) {
      const text = trimmed.replace(/^##\s+/, '').trim();
      const id = slugifyHeading(text);
      headings.push({ id, text, level: 2 });
    } else if (trimmed.startsWith('### ')) {
      const text = trimmed.replace(/^###\s+/, '').trim();
      const id = slugifyHeading(text);
      headings.push({ id, text, level: 3 });
    }
  }

  return headings;
}

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

export const BlogTableOfContents: React.FC<BlogTableOfContentsProps> = ({ items }) => {
  if (items.length === 0) return null;

  return (
    <nav
      aria-label="Table of contents"
      className="sr-only"
    >
      <div className="flex items-center gap-2 mb-4 text-[#0f1a2b]">
        <ListOrdered size={20} className="text-[#a8650a]" />
        <h2 className="text-[18px] font-bold tracking-tight m-0">Table of Contents</h2>
      </div>

      <ul className="list-none p-0 m-0 space-y-2 text-[14px]">
        {items.map((item, idx) => {
          return (
            <li
              key={idx}
              className={`${
                item.level === 3 ? 'ml-4 text-gray-600 text-[13.5px]' : 'font-medium text-gray-800'
              }`}
            >
              <a
                href={`#${item.id}`}
                className="hover:text-[#a8650a] underline-offset-4 hover:underline transition-colors block py-0.5"
              >
                {item.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
