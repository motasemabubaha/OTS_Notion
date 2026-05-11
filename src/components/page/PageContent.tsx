'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { PageNode } from '@/lib/types';
import { useStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import BlockEditor from '@/components/editor/BlockEditor';
import DatabaseView from '@/components/database/DatabaseView';
import { useAutosave } from '@/hooks/useDebounce';
import {
  Star,
  MoreHorizontal,
  Copy,
  Trash2,
  Download,
  ChevronRight,
  Image as ImageIcon,
  Smile,
  FileText,
  Database,
  Plus,
} from 'lucide-react';

interface PageViewProps {
  page: PageNode;
  onRefresh: () => void;
}

const EMOJIS = ['📄', '📝', '📋', '📌', '📎', '🗂️', '📚', '📖', '📕', '📗', '📘', '📙', '🎓', '🔬', '🧪', '💻', '🖥️', '⚙️', '🔧', '🛠️', '🎯', '🎪', '✨', '⭐', '🌟', '💡', '🔥', '🚀', '💎', '🏆', '🎨', '🎭', '🎬', '🎮', '🎲', '🧩', '🗓️', '📅', '⏰', '🕐', '❤️', '💜', '💙', '💚', '💛', '🧡'];

export default function PageContent({ page, onRefresh }: PageViewProps) {
  const router = useRouter();
  const { deletePage, duplicatePage, toggleFavorite, fetchPages } = useStore();
  const [title, setTitle] = useState(page.title);
  const [showMenu, setShowMenu] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTitle(page.title);
  }, [page.title]);

  const saveTitle = useCallback(async (newTitle: string) => {
    await fetch(`/api/pages/${page.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTitle }),
    });
    fetchPages();
  }, [page.id, fetchPages]);

  const saveContent = useCallback(async (content: any) => {
    await fetch(`/api/pages/${page.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
  }, [page.id]);

  const autoSaveContent = useAutosave(async () => {}, 1000);

  const handleContentUpdate = useCallback((content: any) => {
    saveContent(content);
  }, [saveContent]);

  const handleTitleBlur = () => {
    const text = titleRef.current?.textContent || 'Untitled';
    if (text !== page.title) {
      saveTitle(text);
    }
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      titleRef.current?.blur();
    }
  };

  const setIcon = async (icon: string) => {
    await fetch(`/api/pages/${page.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ icon }),
    });
    setShowIconPicker(false);
    onRefresh();
    fetchPages();
  };

  const setCover = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.url) {
        await fetch(`/api/pages/${page.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cover: data.url }),
        });
        onRefresh();
      }
    };
    input.click();
  };

  const addDatabase = async () => {
    await fetch('/api/databases', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pageId: page.id }),
    });
    onRefresh();
  };

  const handleExport = async (format: string) => {
    setShowExport(false);
    const res = await fetch('/api/export', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pageId: page.id, format }),
    });
    const blob = await res.blob();
    const ext = format === 'markdown' ? 'md' : format;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${page.title || 'export'}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const breadcrumbs = buildBreadcrumbs(page);

  return (
    <div className="h-full overflow-y-auto scrollbar-thin">
      {page.cover && (
        <div className="relative">
          <img src={page.cover} alt="" className="cover-image" />
          <button
            onClick={setCover}
            className="absolute bottom-2 right-2 btn btn-ghost text-xs bg-black/40 hover:bg-black/60"
          >
            Change cover
          </button>
        </div>
      )}

      <div className="max-w-[900px] mx-auto px-16 py-8">
        <div className="flex items-center justify-between mb-2">
          <div className="breadcrumb">
            {breadcrumbs.map((b, i) => (
              <span key={b.id} className="flex items-center gap-1">
                {i > 0 && <ChevronRight size={12} />}
                <button
                  onClick={() => router.push(`/${b.id}`)}
                  className="hover:text-white/80 transition-colors"
                >
                  {b.icon && <span className="mr-1">{b.icon}</span>}
                  {b.title}
                </button>
              </span>
            ))}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => toggleFavorite(page.id)}
              className={`p-1.5 rounded hover:bg-white/10 transition-colors ${
                page.isFavorite ? 'text-yellow-400' : 'text-white/30 hover:text-white/60'
              }`}
            >
              <Star size={16} fill={page.isFavorite ? 'currentColor' : 'none'} />
            </button>

            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1.5 rounded hover:bg-white/10 text-white/30 hover:text-white/60"
              >
                <MoreHorizontal size={16} />
              </button>
              {showMenu && (
                <div className="dropdown-menu absolute right-0 top-full mt-1 animate-fadeIn z-40">
                  <button className="dropdown-item w-full" onClick={() => { setCover(); setShowMenu(false); }}>
                    <ImageIcon size={14} /> Set cover
                  </button>
                  <button className="dropdown-item w-full" onClick={() => { setShowIconPicker(true); setShowMenu(false); }}>
                    <Smile size={14} /> Set icon
                  </button>
                  <button className="dropdown-item w-full" onClick={() => { addDatabase(); setShowMenu(false); }}>
                    <Database size={14} /> Add database
                  </button>
                  <div className="dropdown-separator" />
                  <button className="dropdown-item w-full" onClick={async () => {
                    const dup = await duplicatePage(page.id);
                    if (dup) router.push(`/${dup.id}`);
                    setShowMenu(false);
                  }}>
                    <Copy size={14} /> Duplicate
                  </button>
                  <button className="dropdown-item w-full" onClick={() => { setShowExport(true); setShowMenu(false); }}>
                    <Download size={14} /> Export
                  </button>
                  <div className="dropdown-separator" />
                  <button className="dropdown-item w-full text-red-400" onClick={async () => {
                    await deletePage(page.id);
                    router.push('/');
                    setShowMenu(false);
                  }}>
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mb-6 group">
          {!page.cover && (
            <div className="flex items-center gap-2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => setShowIconPicker(true)}
                className="btn btn-ghost text-xs text-white/40"
              >
                <Smile size={13} className="mr-1 inline" /> Add icon
              </button>
              <button
                onClick={setCover}
                className="btn btn-ghost text-xs text-white/40"
              >
                <ImageIcon size={13} className="mr-1 inline" /> Add cover
              </button>
            </div>
          )}

          <div className="flex items-start gap-3">
            {page.icon && (
              <button
                onClick={() => setShowIconPicker(true)}
                className="page-icon hover:opacity-80 transition-opacity"
              >
                {page.icon}
              </button>
            )}
            <div
              ref={titleRef}
              className="page-title"
              contentEditable
              suppressContentEditableWarning
              onBlur={handleTitleBlur}
              onKeyDown={handleTitleKeyDown}
            >
              {page.title || ''}
            </div>
          </div>
        </div>

        {showIconPicker && (
          <div className="modal-overlay" onClick={() => setShowIconPicker(false)}>
            <div className="modal-content p-4" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-sm font-medium mb-3">Choose an icon</h3>
              <div className="grid grid-cols-8 gap-2">
                {EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => setIcon(emoji)}
                    className="text-2xl p-2 hover:bg-white/10 rounded transition-colors"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              <button
                onClick={() => { setIcon(''); setShowIconPicker(false); }}
                className="mt-2 text-xs text-white/40 hover:text-white/60"
              >
                Remove icon
              </button>
            </div>
          </div>
        )}

        {showExport && (
          <div className="modal-overlay" onClick={() => setShowExport(false)}>
            <div className="modal-content p-6" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 400 }}>
              <h3 className="text-lg font-medium mb-4">Export Page</h3>
              <div className="space-y-2">
                <button onClick={() => handleExport('markdown')} className="w-full btn btn-ghost text-left py-3 px-4 border border-white/10 rounded-lg hover:border-white/20">
                  <FileText size={16} className="inline mr-2" /> Markdown (.md)
                </button>
                <button onClick={() => handleExport('html')} className="w-full btn btn-ghost text-left py-3 px-4 border border-white/10 rounded-lg hover:border-white/20">
                  <FileText size={16} className="inline mr-2" /> HTML (.html)
                </button>
              </div>
            </div>
          </div>
        )}

        <BlockEditor
          content={page.content}
          onUpdate={handleContentUpdate}
        />

        {page.database && (
          <div className="mt-8">
            <DatabaseView database={page.database as any} onRefresh={onRefresh} />
          </div>
        )}

        {(page as any).children && (page as any).children.length > 0 && (
          <div className="mt-8 border-t border-white/[0.06] pt-4">
            <h3 className="text-sm font-medium text-white/50 mb-2">Sub-pages</h3>
            <div className="space-y-1">
              {(page as any).children.map((child: any) => (
                <button
                  key={child.id}
                  onClick={() => router.push(`/${child.id}`)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-white/[0.04] rounded transition-colors text-left"
                >
                  <span>{child.icon || '📄'}</span>
                  <span>{child.title || 'Untitled'}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function buildBreadcrumbs(page: any): { id: string; title: string; icon: string | null }[] {
  const crumbs: { id: string; title: string; icon: string | null }[] = [];
  let current = page;
  while (current) {
    crumbs.unshift({ id: current.id, title: current.title || 'Untitled', icon: current.icon });
    current = current.parent;
  }
  return crumbs;
}
