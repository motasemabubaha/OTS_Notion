'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { PageNode } from '@/lib/types';
import { useRouter } from 'next/navigation';
import {
  ChevronRight,
  ChevronDown,
  Plus,
  Star,
  MoreHorizontal,
  File,
  Search,
  Trash2,
  Copy,
  Heart,
  ArrowRight,
  Clock,
  FileText,
  Database,
  Layout,
  Settings,
  PanelLeftClose,
  PanelLeft,
} from 'lucide-react';

export default function Sidebar() {
  const router = useRouter();
  const {
    pages,
    currentPageId,
    sidebarOpen,
    sidebarWidth,
    toggleSidebar,
    setSidebarWidth,
    setSearchOpen,
    setTemplateGalleryOpen,
    fetchPages,
    createPage,
    deletePage,
    duplicatePage,
    toggleFavorite,
    setCurrentPageId,
  } = useStore();

  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; pageId: string } | null>(null);
  const resizeRef = useRef<boolean>(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchPages();
  }, [fetchPages]);

  useEffect(() => {
    const handler = () => setContextMenu(null);
    window.addEventListener('click', handler);
    return () => window.removeEventListener('click', handler);
  }, []);

  const handleResize = useCallback(
    (e: MouseEvent) => {
      if (!resizeRef.current) return;
      const newWidth = Math.max(200, Math.min(480, e.clientX));
      setSidebarWidth(newWidth);
    },
    [setSidebarWidth]
  );

  const handleResizeEnd = useCallback(() => {
    resizeRef.current = false;
    document.removeEventListener('mousemove', handleResize);
    document.removeEventListener('mouseup', handleResizeEnd);
  }, [handleResize]);

  const startResize = useCallback(() => {
    resizeRef.current = true;
    document.addEventListener('mousemove', handleResize);
    document.addEventListener('mouseup', handleResizeEnd);
  }, [handleResize, handleResizeEnd]);

  const handleNewPage = async () => {
    const page = await createPage();
    if (page) {
      router.push(`/${page.id}`);
    }
  };

  const handleContextMenu = (e: React.MouseEvent, pageId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY, pageId });
  };

  const handleContextAction = async (action: string) => {
    if (!contextMenu) return;
    const { pageId } = contextMenu;
    setContextMenu(null);

    switch (action) {
      case 'delete':
        await deletePage(pageId);
        break;
      case 'duplicate':
        const dup = await duplicatePage(pageId);
        if (dup) router.push(`/${dup.id}`);
        break;
      case 'favorite':
        await toggleFavorite(pageId);
        break;
      case 'newSubpage':
        const sub = await createPage(pageId);
        if (sub) router.push(`/${sub.id}`);
        break;
    }
  };

  const favorites = findFavorites(pages);
  const recentPages = [...pages]
    .filter(p => !p.isTemplate)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  if (!sidebarOpen) {
    return (
      <div className="fixed top-0 left-0 z-30 h-full w-10 flex items-start pt-3 pl-2">
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded hover:bg-white/10 text-white/50 hover:text-white/80 transition-colors"
        >
          <PanelLeft size={18} />
        </button>
      </div>
    );
  }

  return (
    <>
      <div
        ref={sidebarRef}
        className="h-full flex flex-col bg-dark-300 border-r border-white/[0.06] relative select-none"
        style={{ width: sidebarWidth, minWidth: sidebarWidth }}
      >
        <div className="flex items-center justify-between px-3 py-2 border-b border-white/[0.06]">
          <span className="text-sm font-semibold text-white/80 truncate">OTS Project</span>
          <div className="flex items-center gap-0.5">
            <button
              onClick={toggleSidebar}
              className="p-1 rounded hover:bg-white/10 text-white/40 hover:text-white/70"
            >
              <PanelLeftClose size={16} />
            </button>
          </div>
        </div>

        <div className="px-2 py-1.5">
          <button
            onClick={() => setSearchOpen(true)}
            className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-white/50 hover:text-white/80 hover:bg-white/[0.06] rounded transition-colors"
          >
            <Search size={15} />
            <span>Search</span>
            <kbd className="ml-auto text-[10px] text-white/30 bg-white/[0.06] px-1.5 py-0.5 rounded">⌘K</kbd>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin px-1 pb-4">
          {favorites.length > 0 && (
            <SidebarSection title="Favorites">
              {favorites.map((p) => (
                <PageItem
                  key={p.id}
                  page={p}
                  depth={0}
                  currentPageId={currentPageId}
                  onNavigate={(id) => router.push(`/${id}`)}
                  onContextMenu={handleContextMenu}
                  onCreateChild={async (parentId) => {
                    const sub = await createPage(parentId);
                    if (sub) router.push(`/${sub.id}`);
                  }}
                />
              ))}
            </SidebarSection>
          )}

          {recentPages.length > 0 && (
            <SidebarSection title="Recent">
              {recentPages.map((p) => (
                <PageItem
                  key={p.id}
                  page={p}
                  depth={0}
                  currentPageId={currentPageId}
                  onNavigate={(id) => router.push(`/${id}`)}
                  onContextMenu={handleContextMenu}
                  minimal
                  onCreateChild={async (parentId) => {
                    const sub = await createPage(parentId);
                    if (sub) router.push(`/${sub.id}`);
                  }}
                />
              ))}
            </SidebarSection>
          )}

          <SidebarSection
            title="Pages"
            action={
              <button
                onClick={handleNewPage}
                className="p-0.5 rounded hover:bg-white/10 text-white/40 hover:text-white/70"
              >
                <Plus size={14} />
              </button>
            }
          >
            {pages.filter(p => !p.isTemplate).map((p) => (
              <PageItem
                key={p.id}
                page={p}
                depth={0}
                currentPageId={currentPageId}
                onNavigate={(id) => router.push(`/${id}`)}
                onContextMenu={handleContextMenu}
                onCreateChild={async (parentId) => {
                  const sub = await createPage(parentId);
                  if (sub) router.push(`/${sub.id}`);
                }}
              />
            ))}
            {pages.filter(p => !p.isTemplate).length === 0 && (
              <div className="px-3 py-2 text-xs text-white/30">No pages yet</div>
            )}
          </SidebarSection>
        </div>

        <div className="border-t border-white/[0.06] p-2 space-y-0.5">
          <button
            onClick={handleNewPage}
            className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-white/50 hover:text-white/80 hover:bg-white/[0.06] rounded transition-colors"
          >
            <Plus size={15} />
            <span>New page</span>
          </button>
          <button
            onClick={() => setTemplateGalleryOpen(true)}
            className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-white/50 hover:text-white/80 hover:bg-white/[0.06] rounded transition-colors"
          >
            <Layout size={15} />
            <span>Templates</span>
          </button>
        </div>

        <div className="sidebar-resize-handle" onMouseDown={startResize} />
      </div>

      {contextMenu && (
        <div
          className="dropdown-menu animate-fadeIn"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={(e) => e.stopPropagation()}
        >
          <button className="dropdown-item w-full" onClick={() => handleContextAction('favorite')}>
            <Heart size={14} /> Toggle Favorite
          </button>
          <button className="dropdown-item w-full" onClick={() => handleContextAction('duplicate')}>
            <Copy size={14} /> Duplicate
          </button>
          <button className="dropdown-item w-full" onClick={() => handleContextAction('newSubpage')}>
            <Plus size={14} /> Add subpage
          </button>
          <div className="dropdown-separator" />
          <button className="dropdown-item w-full text-red-400" onClick={() => handleContextAction('delete')}>
            <Trash2 size={14} /> Delete
          </button>
        </div>
      )}
    </>
  );
}

function SidebarSection({
  title,
  children,
  action,
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="mt-3">
      <div className="flex items-center justify-between px-2 mb-0.5 group">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-1 text-[11px] font-medium text-white/40 uppercase tracking-wider hover:text-white/60"
        >
          <ChevronRight
            size={12}
            className={`transition-transform ${collapsed ? '' : 'rotate-90'}`}
          />
          {title}
        </button>
        {action && <div className="opacity-0 group-hover:opacity-100 transition-opacity">{action}</div>}
      </div>
      {!collapsed && <div>{children}</div>}
    </div>
  );
}

function PageItem({
  page,
  depth,
  currentPageId,
  onNavigate,
  onContextMenu,
  onCreateChild,
  minimal = false,
}: {
  page: PageNode;
  depth: number;
  currentPageId: string | null;
  onNavigate: (id: string) => void;
  onContextMenu: (e: React.MouseEvent, id: string) => void;
  onCreateChild: (parentId: string) => void;
  minimal?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = page.children && page.children.length > 0;
  const isActive = currentPageId === page.id;
  const isDb = !!page.database;

  return (
    <div>
      <div
        className={`group flex items-center gap-1 px-1 py-[3px] rounded cursor-pointer transition-colors ${
          isActive ? 'bg-white/[0.08] text-white' : 'text-white/70 hover:bg-white/[0.04]'
        }`}
        style={{ paddingLeft: `${depth * 16 + 4}px` }}
        onClick={() => onNavigate(page.id)}
        onContextMenu={(e) => onContextMenu(e, page.id)}
      >
        {!minimal && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
            className={`p-0.5 rounded hover:bg-white/10 flex-shrink-0 ${hasChildren ? 'visible' : 'invisible'}`}
          >
            <ChevronRight size={12} className={`transition-transform ${expanded ? 'rotate-90' : ''}`} />
          </button>
        )}
        <span className="flex-shrink-0 text-sm w-5 text-center">
          {page.icon || (isDb ? '🗄️' : '📄')}
        </span>
        <span className="text-sm truncate flex-1">{page.title || 'Untitled'}</span>
        {!minimal && (
          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onContextMenu(e, page.id);
              }}
              className="p-0.5 rounded hover:bg-white/10"
            >
              <MoreHorizontal size={14} className="text-white/40" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCreateChild(page.id);
              }}
              className="p-0.5 rounded hover:bg-white/10"
            >
              <Plus size={14} className="text-white/40" />
            </button>
          </div>
        )}
      </div>
      {expanded && hasChildren && (
        <div>
          {page.children!.map((child) => (
            <PageItem
              key={child.id}
              page={child}
              depth={depth + 1}
              currentPageId={currentPageId}
              onNavigate={onNavigate}
              onContextMenu={onContextMenu}
              onCreateChild={onCreateChild}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function findFavorites(pages: PageNode[]): PageNode[] {
  const favs: PageNode[] = [];
  for (const p of pages) {
    if (p.isFavorite) favs.push(p);
    if (p.children) favs.push(...findFavorites(p.children));
  }
  return favs;
}
