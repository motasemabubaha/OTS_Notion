'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { useStore } from '@/lib/store';
import { PageNode } from '@/lib/types';
import Sidebar from '@/components/sidebar/Sidebar';
import SearchModal from '@/components/search/SearchModal';
import TemplateGallery from '@/components/templates/TemplateGallery';
import PageContent from '@/components/page/PageContent';
import { Loader } from 'lucide-react';

export default function PageRoute() {
  const params = useParams();
  const pageId = params.pageId as string;
  const { setCurrentPageId, sidebarOpen } = useStore();
  const [page, setPage] = useState<PageNode | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPage = useCallback(async () => {
    if (!pageId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/pages/${pageId}`);
      if (!res.ok) {
        setError('Page not found');
        setPage(null);
      } else {
        const data = await res.json();
        setPage(data);
        setCurrentPageId(data.id);
      }
    } catch {
      setError('Failed to load page');
    }
    setLoading(false);
  }, [pageId, setCurrentPageId]);

  useEffect(() => {
    loadPage();
  }, [loadPage]);

  useEffect(() => {
    return () => setCurrentPageId(null);
  }, [setCurrentPageId]);

  return (
    <div className="h-screen flex overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-hidden">
        {loading && (
          <div className="h-full flex items-center justify-center">
            <Loader size={24} className="animate-spin text-white/30" />
          </div>
        )}
        {error && (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-4">😕</div>
              <p className="text-white/40">{error}</p>
            </div>
          </div>
        )}
        {!loading && !error && page && (
          <PageContent page={page} onRefresh={loadPage} />
        )}
      </main>
      <SearchModal />
      <TemplateGallery />
    </div>
  );
}
