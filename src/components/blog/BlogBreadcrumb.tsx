import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BlogBreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  dark?: boolean;
}

export const BlogBreadcrumb: React.FC<BlogBreadcrumbProps> = ({
  items,
  className = '',
  dark = false,
}) => {
  return (
    <nav aria-label="Breadcrumb" className={`flex items-center text-[13px] font-medium ${className}`}>
      <ol className="flex items-center flex-wrap gap-1.5 list-none p-0 m-0">
        <li>
          <Link
            to="/"
            className={`no-underline transition-colors ${
              dark ? 'text-white/60 hover:text-white' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Home
          </Link>
        </li>
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <React.Fragment key={idx}>
              <li aria-hidden="true" className={dark ? 'text-white/30' : 'text-gray-400'}>
                <ChevronRight size={14} />
              </li>
              <li>
                {item.href && !isLast ? (
                  <Link
                    to={item.href}
                    className={`no-underline transition-colors ${
                      dark ? 'text-white/60 hover:text-white' : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    aria-current={isLast ? 'page' : undefined}
                    className={`truncate max-w-[280px] sm:max-w-[420px] inline-block align-bottom ${
                      dark ? 'text-[#ffc46b] font-semibold' : 'text-gray-900 font-semibold'
                    }`}
                    title={item.label}
                  >
                    {item.label}
                  </span>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};
