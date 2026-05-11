'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { X, Search, Layout, FileText, Clock, Loader } from 'lucide-react';

interface Template {
  id: string;
  title: string;
  icon: string | null;
  templateCat: string | null;
}

const CATEGORIES = [
  'All',
  'Study',
  'Productivity',
  'Task Management',
  'Project Management',
  'Personal',
  'Student',
  'Cybersecurity',
];

export default function TemplateGallery() {
  const router = useRouter();
  const { templateGalleryOpen, setTemplateGalleryOpen, fetchPages } = useStore();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(false);
  const [applying, setApplying] = useState<string | null>(null);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (templateGalleryOpen) {
      loadTemplates();
    }
  }, [templateGalleryOpen]);

  const loadTemplates = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/templates');
      const data = await res.json();
      setTemplates(data);
    } catch {
      console.error('Failed to load templates');
    }
    setLoading(false);
  };

  const applyTemplate = async (templateId: string) => {
    setApplying(templateId);
    try {
      const res = await fetch(`/api/templates/${templateId}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const page = await res.json();
      await fetchPages();
      setTemplateGalleryOpen(false);
      router.push(`/${page.id}`);
    } catch {
      console.error('Failed to apply template');
    }
    setApplying(null);
  };

  const filteredTemplates = templates.filter((t) => {
    const matchesCat = filter === 'All' || (t.templateCat || '').toLowerCase().includes(filter.toLowerCase());
    const matchesSearch = !search || t.title.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  if (!templateGalleryOpen) return null;

  return (
    <div className="modal-overlay" onClick={() => setTemplateGalleryOpen(false)}>
      <div className="modal-content modal-content-lg animate-fadeIn" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08]">
          <h2 className="text-lg font-semibold">Templates</h2>
          <button onClick={() => setTemplateGalleryOpen(false)} className="p-1 hover:bg-white/10 rounded">
            <X size={18} className="text-white/40" />
          </button>
        </div>

        <div className="flex h-[60vh]">
          <div className="w-48 border-r border-white/[0.08] p-3 overflow-y-auto scrollbar-thin flex-shrink-0">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`w-full text-left px-3 py-1.5 rounded text-sm mb-0.5 transition-colors ${
                  filter === cat ? 'bg-white/10 text-white' : 'text-white/50 hover:bg-white/[0.04] hover:text-white/70'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
            <div className="flex items-center gap-2 mb-4 px-1">
              <Search size={15} className="text-white/30" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search templates..."
                className="bg-transparent border-none outline-none text-sm flex-1 p-0"
              />
            </div>

            {loading && (
              <div className="flex items-center justify-center py-12">
                <Loader size={24} className="animate-spin text-white/30" />
              </div>
            )}

            {!loading && filteredTemplates.length === 0 && (
              <div className="py-12 text-center text-sm text-white/30">
                {templates.length === 0 ? 'No templates available. Run the seed script to add templates.' : 'No matching templates found.'}
              </div>
            )}

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredTemplates.map((t) => (
                <button
                  key={t.id}
                  onClick={() => applyTemplate(t.id)}
                  disabled={applying === t.id}
                  className="text-left p-4 bg-dark-200 border border-white/[0.08] rounded-lg hover:border-white/20 hover:bg-dark-100 transition-all group"
                >
                  <div className="text-2xl mb-2">{t.icon || '📄'}</div>
                  <div className="text-sm font-medium truncate">{t.title}</div>
                  <div className="text-xs text-white/30 mt-0.5">{t.templateCat}</div>
                  {applying === t.id && (
                    <div className="mt-2">
                      <Loader size={14} className="animate-spin text-accent" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
