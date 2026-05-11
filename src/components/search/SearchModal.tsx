'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { Search, X, FileText, Hash, Clock } from 'lucide-react';
import { formatRelativeDate } from '@/lib/utils';

export default function SearchModal() {
  const router = useRouter();
  const { searchOpen, setSearchOpen } = useStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ pages: any[]; blocks: any[] }>({ pages: [], blocks: [] });
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(!searchOpen);
      }
      if (e.key === 'Escape' && searchOpen) {
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [searchOpen, setSearchOpen]);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setResults({ pages: [], blocks: [] });
    }
  }, [searchOpen]);

  const doSearch = useCallback(async (q: string) => {
    if (q.trim().length < 2) {
      setResults({ pages: [], blocks: [] });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/pages/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data);
    } catch {
      setResults({ pages: [], blocks: [] });
    }
    setLoading(false);
  }, []);

  const handleInput = (value: string) => {
    setQuery(value);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => doSearch(value), 300);
  };

  const navigateTo = (pageId: string) => {
    setSearchOpen(false);
    router.push(`/${pageId}`);
  };

  if (!searchOpen) return null;

  return (
    <div className="modal-overlay" onClick={() => setSearchOpen(false)}>
      <div className="modal-content animate-fadeIn" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center px-4 py-3 border-b border-white/[0.08]">
          <Search size={18} className="text-white/40 flex-shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => handleInput(e.target.value)}
            placeholder="Search pages and blocks..."
            className="flex-1 bg-transparent border-none outline-none text-base px-3 py-1"
          />
          {query && (
            <button onClick={() => { setQuery(''); setResults({ pages: [], blocks: [] }); }} className="p-1 hover:bg-white/10 rounded">
              <X size={16} className="text-white/40" />
            </button>
          )}
        </div>

        <div className="max-h-[400px] overflow-y-auto scrollbar-thin p-2">
          {loading && (
            <div className="p-4 text-center text-sm text-white/40">Searching...</div>
          )}

          {!loading && query.length >= 2 && results.pages.length === 0 && results.blocks.length === 0 && (
            <div className="p-4 text-center text-sm text-white/40">No results found</div>
          )}

          {!loading && query.length < 2 && (
            <div className="p-4 text-center text-sm text-white/30">Type at least 2 characters to search</div>
          )}

          {results.pages.length > 0 && (
            <div>
              <div className="text-[11px] font-medium text-white/30 uppercase px-2 py-1">Pages</div>
              {results.pages.map((p) => (
                <button
                  key={p.id}
                  onClick={() => navigateTo(p.id)}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-white/[0.06] rounded transition-colors text-left"
                >
                  <span className="text-base">{p.icon || '📄'}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm truncate">{p.title || 'Untitled'}</div>
                  </div>
                  <span className="text-[11px] text-white/25 flex-shrink-0">
                    {formatRelativeDate(p.updatedAt)}
                  </span>
                </button>
              ))}
            </div>
          )}

          {results.blocks.length > 0 && (
            <div className="mt-2">
              <div className="text-[11px] font-medium text-white/30 uppercase px-2 py-1">Blocks</div>
              {results.blocks.map((b) => (
                <button
                  key={b.id}
                  onClick={() => navigateTo(b.page.id)}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-white/[0.06] rounded transition-colors text-left"
                >
                  <Hash size={14} className="text-white/30 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-white/40">{b.page.icon || '📄'} {b.page.title}</div>
                    <div className="text-sm truncate text-white/70">
                      {(b.content as any)?.text || b.type}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
