'use client';

import { FileText, ExternalLink } from 'lucide-react';
import type { Citation } from '@/lib/types';

interface CitationBubbleProps {
  citation: Citation;
}

export default function CitationBubble({ citation }: CitationBubbleProps) {
  return (
    <div className="mt-3 pt-3 border-t border-gray-200">
      <a
        href={citation.link}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700 transition group"
      >
        <FileText className="w-4 h-4 flex-shrink-0" />
        <span className="font-medium">
          {citation.source} - {citation.section}
        </span>
        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition" />
      </a>
      {citation.relevance && (
        <p className="text-xs text-gray-600 mt-1">{citation.relevance}</p>
      )}
    </div>
  );
}
