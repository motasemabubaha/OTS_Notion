export interface PageNode {
  id: string;
  title: string;
  icon: string | null;
  cover: string | null;
  parentId: string | null;
  isFavorite: boolean;
  isTemplate: boolean;
  isArchived: boolean;
  templateCat: string | null;
  sortOrder: number;
  content: any;
  createdAt: string;
  updatedAt: string;
  children?: PageNode[];
  database?: DatabaseType | null;
  blocks?: BlockType[];
}

export interface BlockType {
  id: string;
  pageId: string;
  type: string;
  content: any;
  parentId: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface DatabaseType {
  id: string;
  pageId: string;
  name: string;
  activeView: string;
  properties: DatabasePropertyType[];
  rows: DatabaseRowType[];
  views: DatabaseViewType[];
}

export interface DatabasePropertyType {
  id: string;
  databaseId: string;
  name: string;
  type: string;
  config: any;
  sortOrder: number;
  isVisible: boolean;
  width: number;
}

export interface DatabaseRowType {
  id: string;
  databaseId: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  cells: DatabaseCellType[];
}

export interface DatabaseCellType {
  id: string;
  rowId: string;
  propertyId: string;
  value: any;
}

export interface DatabaseViewType {
  id: string;
  databaseId: string;
  name: string;
  type: string;
  config: any;
  sortOrder: number;
}

export type PropertyType =
  | 'text'
  | 'number'
  | 'checkbox'
  | 'select'
  | 'multi_select'
  | 'date'
  | 'relation'
  | 'url'
  | 'email'
  | 'phone'
  | 'tags'
  | 'status'
  | 'people'
  | 'files';

export type ViewType = 'table' | 'board' | 'calendar' | 'gallery' | 'list';

export interface FilterRule {
  propertyId: string;
  operator: string;
  value: any;
}

export interface SortRule {
  propertyId: string;
  direction: 'asc' | 'desc';
}

export interface GroupRule {
  propertyId: string;
}
