import { create } from 'zustand';
import { PageNode } from './types';

interface AppState {
  pages: PageNode[];
  currentPageId: string | null;
  sidebarOpen: boolean;
  searchOpen: boolean;
  templateGalleryOpen: boolean;
  sidebarWidth: number;
  loading: boolean;

  setPages: (pages: PageNode[]) => void;
  setCurrentPageId: (id: string | null) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  setTemplateGalleryOpen: (open: boolean) => void;
  setSidebarWidth: (w: number) => void;
  setLoading: (loading: boolean) => void;

  fetchPages: () => Promise<void>;
  createPage: (parentId?: string | null) => Promise<PageNode | null>;
  deletePage: (id: string) => Promise<void>;
  duplicatePage: (id: string) => Promise<PageNode | null>;
  toggleFavorite: (id: string) => Promise<void>;
}

export const useStore = create<AppState>((set, get) => ({
  pages: [],
  currentPageId: null,
  sidebarOpen: true,
  searchOpen: false,
  templateGalleryOpen: false,
  sidebarWidth: 260,
  loading: false,

  setPages: (pages) => set({ pages }),
  setCurrentPageId: (id) => set({ currentPageId: id }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setSearchOpen: (open) => set({ searchOpen: open }),
  setTemplateGalleryOpen: (open) => set({ templateGalleryOpen: open }),
  setSidebarWidth: (w) => set({ sidebarWidth: w }),
  setLoading: (loading) => set({ loading }),

  fetchPages: async () => {
    try {
      const res = await fetch('/api/pages');
      const data = await res.json();
      set({ pages: data });
    } catch (e) {
      console.error('Failed to fetch pages', e);
    }
  },

  createPage: async (parentId = null) => {
    try {
      const res = await fetch('/api/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ parentId }),
      });
      const page = await res.json();
      await get().fetchPages();
      return page;
    } catch (e) {
      console.error('Failed to create page', e);
      return null;
    }
  },

  deletePage: async (id) => {
    try {
      await fetch(`/api/pages/${id}`, { method: 'DELETE' });
      await get().fetchPages();
      if (get().currentPageId === id) {
        set({ currentPageId: null });
      }
    } catch (e) {
      console.error('Failed to delete page', e);
    }
  },

  duplicatePage: async (id) => {
    try {
      const res = await fetch(`/api/pages/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'duplicate' }),
      });
      const page = await res.json();
      await get().fetchPages();
      return page;
    } catch (e) {
      console.error('Failed to duplicate page', e);
      return null;
    }
  },

  toggleFavorite: async (id) => {
    try {
      const page = get().pages.find((p) => p.id === id) ||
        findPageInTree(get().pages, id);
      if (!page) return;
      await fetch(`/api/pages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFavorite: !page.isFavorite }),
      });
      await get().fetchPages();
    } catch (e) {
      console.error('Failed to toggle favorite', e);
    }
  },
}));

function findPageInTree(pages: PageNode[], id: string): PageNode | null {
  for (const page of pages) {
    if (page.id === id) return page;
    if (page.children) {
      const found = findPageInTree(page.children, id);
      if (found) return found;
    }
  }
  return null;
}
