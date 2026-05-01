'use client';

import { FileText, ExternalLink } from 'lucide-react';
import type { Citation } from '@/lib/types';

interface CitationBubbleProps {
  citation: Citation;
}

export default function CitationBubble({ citation }: CitationBubbleProps) {
  return (
    <div className="mt-4 pt-4 border-t border-white/10">
      <a
        href={citation.link}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center space-x-2 text-xs text-amber-400 hover:text-amber-300 transition-all group bg-white/5 p-2 rounded-lg border border-white/5 hover:border-amber-500/30"
      >
        <FileText className="w-3.5 h-3.5 flex-shrink-0" />
        <span className="font-bold uppercase tracking-wider">
          Source: {citation.source}
        </span>
        <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100 transition ml-auto" />
      </a>
      {citation.relevance && (
        <p className="text-[10px] text-white/50 mt-2 italic leading-tight pl-2 border-l border-amber-500/30">
          {citation.relevance}
        </p>
      )}
    </div>
  );
}
