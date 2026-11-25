import React from 'react';
import type { BlogAuthor } from '../../lib/blogTypes';
import { UserCheck } from 'lucide-react';

interface BlogAuthorBoxProps {
  author: BlogAuthor;
}

export const BlogAuthorBox: React.FC<BlogAuthorBoxProps> = ({ author }) => {
  return (
    <aside className="my-10 p-6 sm:p-7 rounded-[20px] bg-white border border-[#0f1a2b]/10 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-5">
      <div className="w-16 h-16 rounded-full bg-[#0a1220] text-[#ffc46b] flex items-center justify-center shrink-0 shadow-inner">
        {author.avatar ? (
          <img
            src={author.avatar}
            alt={author.name}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <UserCheck size={28} />
        )}
      </div>

      <div className="flex-1 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
          <h3 className="text-[18px] font-bold text-[#0f1a2b] m-0">{author.name}</h3>
          <span className="text-[13px] font-medium text-[#a8650a] tracking-wide uppercase">
            {author.role}
          </span>
        </div>
        <p className="mt-2 text-[14.5px] text-[#5a6678] leading-relaxed m-0">
          {author.bio ||
            'Specialist smart home engineer and installation consultant at OG Smarthomes, helping property owners across Lagos, Abuja, and Port Harcourt design secure, energy-efficient automated living spaces.'}
        </p>
      </div>
    </aside>
  );
};
