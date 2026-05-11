'use client';

import { useEffect } from 'react';
import { useStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/sidebar/Sidebar';
import SearchModal from '@/components/search/SearchModal';
import TemplateGallery from '@/components/templates/TemplateGallery';
import {
  Plus,
  FileText,
  Layout,
  Search,
  Rocket,
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { pages, sidebarOpen, sidebarWidth, fetchPages, createPage, setSearchOpen, setTemplateGalleryOpen } = useStore();

  useEffect(() => {
    fetchPages();
  }, [fetchPages]);

  const handleNewPage = async () => {
    const page = await createPage();
    if (page) router.push(`/${page.id}`);
  };

  const recentPages = [...pages]
    .filter(p => !p.isTemplate)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 8);

  return (
    <div className="h-screen flex overflow-hidden">
      <Sidebar />
      <main
        className="flex-1 overflow-hidden"
        style={{ marginLeft: sidebarOpen ? 0 : 0 }}
      >
        <div className="h-full overflow-y-auto scrollbar-thin">
          <div className="max-w-[900px] mx-auto px-8 py-16">
            <div className="mb-12">
              <h1 className="text-4xl font-bold mb-2">Welcome to OTS Project</h1>
              <p className="text-lg text-white/40">Your personal productivity workspace</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-12">
              <QuickAction
                icon={<Plus size={20} />}
                label="New Page"
                description="Create a blank page"
                onClick={handleNewPage}
              />
              <QuickAction
                icon={<Layout size={20} />}
                label="Templates"
                description="Start from a template"
                onClick={() => setTemplateGalleryOpen(true)}
              />
              <QuickAction
                icon={<Search size={20} />}
                label="Search"
                description="Find anything"
                onClick={() => setSearchOpen(true)}
              />
              <QuickAction
                icon={<Rocket size={20} />}
                label="Quick Note"
                description="Capture a thought"
                onClick={async () => {
                  const page = await createPage();
                  if (page) {
                    await fetch(`/api/pages/${page.id}`, {
                      method: 'PATCH',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ title: 'Quick Note', icon: '📝' }),
                    });
                    fetchPages();
                    router.push(`/${page.id}`);
                  }
                }}
              />
            </div>

            {recentPages.length > 0 && (
              <div>
                <h2 className="text-sm font-medium text-white/40 uppercase tracking-wider mb-3">Recently Updated</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {recentPages.map((page) => (
                    <button
                      key={page.id}
                      onClick={() => router.push(`/${page.id}`)}
                      className="text-left p-4 bg-dark-200 border border-white/[0.06] rounded-lg hover:border-white/15 hover:bg-dark-100 transition-all"
                    >
                      <div className="text-2xl mb-2">{page.icon || '📄'}</div>
                      <div className="text-sm font-medium truncate">{page.title || 'Untitled'}</div>
                      <div className="text-xs text-white/25 mt-1">
                        {new Date(page.updatedAt).toLocaleDateString()}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {recentPages.length === 0 && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-lg font-medium mb-1">No pages yet</h3>
                <p className="text-sm text-white/40 mb-4">Create your first page or use a template to get started</p>
                <div className="flex items-center justify-center gap-3">
                  <button onClick={handleNewPage} className="btn btn-primary">
                    <Plus size={15} className="mr-1.5 inline" /> New Page
                  </button>
                  <button onClick={() => setTemplateGalleryOpen(true)} className="btn btn-ghost border border-white/15">
                    <Layout size={15} className="mr-1.5 inline" /> Browse Templates
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <SearchModal />
      <TemplateGallery />
    </div>
  );
}

function QuickAction({
  icon,
  label,
  description,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="text-left p-4 bg-dark-200 border border-white/[0.06] rounded-lg hover:border-white/15 hover:bg-dark-100 transition-all group"
    >
      <div className="text-white/40 group-hover:text-accent transition-colors mb-2">{icon}</div>
      <div className="text-sm font-medium">{label}</div>
      <div className="text-xs text-white/30">{description}</div>
    </button>
  );
}
