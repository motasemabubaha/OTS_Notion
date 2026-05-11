'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { DatabaseType, DatabasePropertyType, DatabaseRowType, DatabaseCellType } from '@/lib/types';
import {
  Plus,
  MoreHorizontal,
  Trash2,
  ChevronDown,
  Filter,
  ArrowUpDown,
  LayoutGrid,
  List,
  Kanban,
  Calendar,
  Table as TableIcon,
  Eye,
  EyeOff,
  GripVertical,
  X,
} from 'lucide-react';

interface DatabaseViewProps {
  database: DatabaseType;
  onRefresh: () => void;
}

export default function DatabaseView({ database, onRefresh }: DatabaseViewProps) {
  const [activeView, setActiveView] = useState(database.activeView || 'table');
  const [showViewMenu, setShowViewMenu] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [showSortPanel, setShowSortPanel] = useState(false);
  const [filters, setFilters] = useState<{ propertyId: string; operator: string; value: string }[]>([]);
  const [sorts, setSorts] = useState<{ propertyId: string; direction: 'asc' | 'desc' }[]>([]);
  const [groupBy, setGroupBy] = useState<string | null>(null);

  const addRow = async () => {
    await fetch('/api/database-rows', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ databaseId: database.id }),
    });
    onRefresh();
  };

  const deleteRow = async (rowId: string) => {
    await fetch(`/api/database-rows/${rowId}`, { method: 'DELETE' });
    onRefresh();
  };

  const updateCell = async (cellId: string, value: any) => {
    await fetch(`/api/database-cells/${cellId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value }),
    });
  };

  const addProperty = async (type: string = 'text') => {
    await fetch('/api/database-properties', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ databaseId: database.id, name: 'New Property', type }),
    });
    onRefresh();
  };

  const deleteProperty = async (propId: string) => {
    await fetch(`/api/database-properties/${propId}`, { method: 'DELETE' });
    onRefresh();
  };

  const updateProperty = async (propId: string, data: any) => {
    await fetch(`/api/database-properties/${propId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    onRefresh();
  };

  const changeView = async (type: string) => {
    setActiveView(type);
    setShowViewMenu(false);
    await fetch(`/api/databases/${database.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ activeView: type }),
    });
  };

  const filteredRows = applyFilters(database.rows, database.properties, filters);
  const sortedRows = applySorts(filteredRows, database.properties, sorts);

  const viewIcons: Record<string, React.ReactNode> = {
    table: <TableIcon size={14} />,
    board: <Kanban size={14} />,
    calendar: <Calendar size={14} />,
    gallery: <LayoutGrid size={14} />,
    list: <List size={14} />,
  };

  return (
    <div className="mt-4">
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <div className="relative">
          <button
            onClick={() => setShowViewMenu(!showViewMenu)}
            className="flex items-center gap-1.5 px-2 py-1 text-sm text-white/70 hover:bg-white/[0.06] rounded transition-colors"
          >
            {viewIcons[activeView]}
            <span className="capitalize">{activeView}</span>
            <ChevronDown size={12} />
          </button>
          {showViewMenu && (
            <div className="dropdown-menu absolute top-full left-0 mt-1 animate-fadeIn z-50">
              {['table', 'board', 'calendar', 'gallery', 'list'].map((v) => (
                <button
                  key={v}
                  className={`dropdown-item w-full ${activeView === v ? 'text-accent' : ''}`}
                  onClick={() => changeView(v)}
                >
                  {viewIcons[v]}
                  <span className="capitalize">{v}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => setShowFilterPanel(!showFilterPanel)}
          className={`flex items-center gap-1.5 px-2 py-1 text-sm rounded transition-colors ${
            filters.length > 0 ? 'text-accent bg-accent/10' : 'text-white/50 hover:bg-white/[0.06]'
          }`}
        >
          <Filter size={13} />
          Filter {filters.length > 0 && `(${filters.length})`}
        </button>

        <button
          onClick={() => setShowSortPanel(!showSortPanel)}
          className={`flex items-center gap-1.5 px-2 py-1 text-sm rounded transition-colors ${
            sorts.length > 0 ? 'text-accent bg-accent/10' : 'text-white/50 hover:bg-white/[0.06]'
          }`}
        >
          <ArrowUpDown size={13} />
          Sort {sorts.length > 0 && `(${sorts.length})`}
        </button>

        <button
          onClick={addRow}
          className="flex items-center gap-1.5 px-2 py-1 text-sm text-accent hover:bg-accent/10 rounded transition-colors ml-auto"
        >
          <Plus size={14} />
          New
        </button>
      </div>

      {showFilterPanel && (
        <FilterPanel
          properties={database.properties}
          filters={filters}
          setFilters={setFilters}
          onClose={() => setShowFilterPanel(false)}
        />
      )}

      {showSortPanel && (
        <SortPanel
          properties={database.properties}
          sorts={sorts}
          setSorts={setSorts}
          onClose={() => setShowSortPanel(false)}
        />
      )}

      {activeView === 'table' && (
        <TableView
          properties={database.properties}
          rows={sortedRows}
          onUpdateCell={updateCell}
          onDeleteRow={deleteRow}
          onAddProperty={addProperty}
          onDeleteProperty={deleteProperty}
          onUpdateProperty={updateProperty}
          onAddRow={addRow}
        />
      )}
      {activeView === 'board' && (
        <BoardView
          properties={database.properties}
          rows={sortedRows}
          onUpdateCell={updateCell}
          onDeleteRow={deleteRow}
          onAddRow={addRow}
        />
      )}
      {activeView === 'list' && (
        <ListView
          properties={database.properties}
          rows={sortedRows}
          onUpdateCell={updateCell}
          onDeleteRow={deleteRow}
          onAddRow={addRow}
        />
      )}
      {activeView === 'gallery' && (
        <GalleryView
          properties={database.properties}
          rows={sortedRows}
          onUpdateCell={updateCell}
          onDeleteRow={deleteRow}
        />
      )}
      {activeView === 'calendar' && (
        <CalendarView
          properties={database.properties}
          rows={sortedRows}
          onUpdateCell={updateCell}
        />
      )}
    </div>
  );
}

function FilterPanel({
  properties,
  filters,
  setFilters,
  onClose,
}: {
  properties: DatabasePropertyType[];
  filters: { propertyId: string; operator: string; value: string }[];
  setFilters: (f: any[]) => void;
  onClose: () => void;
}) {
  const addFilter = () => {
    if (properties.length === 0) return;
    setFilters([...filters, { propertyId: properties[0].id, operator: 'contains', value: '' }]);
  };

  return (
    <div className="mb-3 p-3 bg-dark-100 rounded-lg border border-white/[0.08] animate-fadeIn">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-white/50 uppercase">Filters</span>
        <button onClick={onClose} className="p-0.5 hover:bg-white/10 rounded"><X size={14} className="text-white/40" /></button>
      </div>
      {filters.map((f, i) => (
        <div key={i} className="flex items-center gap-2 mb-1.5">
          <select
            value={f.propertyId}
            onChange={(e) => {
              const nf = [...filters];
              nf[i].propertyId = e.target.value;
              setFilters(nf);
            }}
            className="text-xs bg-dark-200 border-white/10 rounded px-2 py-1"
          >
            {properties.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <select
            value={f.operator}
            onChange={(e) => {
              const nf = [...filters];
              nf[i].operator = e.target.value;
              setFilters(nf);
            }}
            className="text-xs bg-dark-200 border-white/10 rounded px-2 py-1"
          >
            <option value="contains">Contains</option>
            <option value="equals">Equals</option>
            <option value="not_equals">Not equals</option>
            <option value="is_empty">Is empty</option>
            <option value="is_not_empty">Is not empty</option>
          </select>
          <input
            value={f.value}
            onChange={(e) => {
              const nf = [...filters];
              nf[i].value = e.target.value;
              setFilters(nf);
            }}
            placeholder="Value..."
            className="text-xs bg-dark-200 border-white/10 rounded px-2 py-1 flex-1"
          />
          <button
            onClick={() => setFilters(filters.filter((_, j) => j !== i))}
            className="p-0.5 hover:bg-white/10 rounded"
          >
            <X size={12} className="text-white/40" />
          </button>
        </div>
      ))}
      <button onClick={addFilter} className="text-xs text-accent hover:underline mt-1">+ Add filter</button>
    </div>
  );
}

function SortPanel({
  properties,
  sorts,
  setSorts,
  onClose,
}: {
  properties: DatabasePropertyType[];
  sorts: { propertyId: string; direction: 'asc' | 'desc' }[];
  setSorts: (s: any[]) => void;
  onClose: () => void;
}) {
  const addSort = () => {
    if (properties.length === 0) return;
    setSorts([...sorts, { propertyId: properties[0].id, direction: 'asc' }]);
  };

  return (
    <div className="mb-3 p-3 bg-dark-100 rounded-lg border border-white/[0.08] animate-fadeIn">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-white/50 uppercase">Sort</span>
        <button onClick={onClose} className="p-0.5 hover:bg-white/10 rounded"><X size={14} className="text-white/40" /></button>
      </div>
      {sorts.map((s, i) => (
        <div key={i} className="flex items-center gap-2 mb-1.5">
          <select
            value={s.propertyId}
            onChange={(e) => {
              const ns = [...sorts];
              ns[i].propertyId = e.target.value;
              setSorts(ns);
            }}
            className="text-xs bg-dark-200 border-white/10 rounded px-2 py-1"
          >
            {properties.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <select
            value={s.direction}
            onChange={(e) => {
              const ns = [...sorts];
              ns[i].direction = e.target.value as 'asc' | 'desc';
              setSorts(ns);
            }}
            className="text-xs bg-dark-200 border-white/10 rounded px-2 py-1"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
          <button
            onClick={() => setSorts(sorts.filter((_, j) => j !== i))}
            className="p-0.5 hover:bg-white/10 rounded"
          >
            <X size={12} className="text-white/40" />
          </button>
        </div>
      ))}
      <button onClick={addSort} className="text-xs text-accent hover:underline mt-1">+ Add sort</button>
    </div>
  );
}

function TableView({
  properties,
  rows,
  onUpdateCell,
  onDeleteRow,
  onAddProperty,
  onDeleteProperty,
  onUpdateProperty,
  onAddRow,
}: {
  properties: DatabasePropertyType[];
  rows: DatabaseRowType[];
  onUpdateCell: (cellId: string, value: any) => void;
  onDeleteRow: (rowId: string) => void;
  onAddProperty: (type?: string) => void;
  onDeleteProperty: (propId: string) => void;
  onUpdateProperty: (propId: string, data: any) => void;
  onAddRow: () => void;
}) {
  const [editingHeader, setEditingHeader] = useState<string | null>(null);
  const [headerMenuId, setHeaderMenuId] = useState<string | null>(null);
  const visibleProps = properties.filter((p) => p.isVisible !== false);

  return (
    <div className="overflow-x-auto border border-white/[0.08] rounded-lg">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/[0.08]">
            {visibleProps.map((prop) => (
              <th
                key={prop.id}
                className="text-left text-xs font-medium text-white/50 px-3 py-2 border-r border-white/[0.06] relative group"
                style={{ width: prop.width || 200, minWidth: 100 }}
              >
                <div className="flex items-center justify-between">
                  {editingHeader === prop.id ? (
                    <input
                      autoFocus
                      defaultValue={prop.name}
                      className="bg-transparent border-none outline-none text-xs p-0 w-full"
                      onBlur={(e) => {
                        onUpdateProperty(prop.id, { name: e.target.value });
                        setEditingHeader(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          onUpdateProperty(prop.id, { name: (e.target as HTMLInputElement).value });
                          setEditingHeader(null);
                        }
                      }}
                    />
                  ) : (
                    <span
                      className="cursor-pointer truncate"
                      onDoubleClick={() => setEditingHeader(prop.id)}
                    >
                      {prop.name}
                    </span>
                  )}
                  <button
                    onClick={() => setHeaderMenuId(headerMenuId === prop.id ? null : prop.id)}
                    className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-white/10 rounded"
                  >
                    <ChevronDown size={12} />
                  </button>
                </div>
                {headerMenuId === prop.id && (
                  <div className="dropdown-menu absolute top-full right-0 mt-1 z-40 animate-fadeIn">
                    <button className="dropdown-item w-full" onClick={() => { setEditingHeader(prop.id); setHeaderMenuId(null); }}>
                      Rename
                    </button>
                    <div className="dropdown-separator" />
                    {['text', 'number', 'checkbox', 'select', 'multi_select', 'date', 'url', 'email', 'status'].map(t => (
                      <button
                        key={t}
                        className={`dropdown-item w-full ${prop.type === t ? 'text-accent' : ''}`}
                        onClick={() => { onUpdateProperty(prop.id, { type: t }); setHeaderMenuId(null); }}
                      >
                        Type: {t.replace('_', '-')}
                      </button>
                    ))}
                    <div className="dropdown-separator" />
                    <button
                      className="dropdown-item w-full text-red-400"
                      onClick={() => { onDeleteProperty(prop.id); setHeaderMenuId(null); }}
                    >
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>
                )}
              </th>
            ))}
            <th className="w-10 px-2">
              <button
                onClick={() => onAddProperty('text')}
                className="p-1 hover:bg-white/[0.06] rounded text-white/30 hover:text-white/60"
              >
                <Plus size={14} />
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] group/row">
              {visibleProps.map((prop) => {
                const cell = row.cells.find((c) => c.propertyId === prop.id);
                if (!cell) return <td key={prop.id} className="px-3 py-1.5 border-r border-white/[0.06]" />;
                return (
                  <td key={prop.id} className="px-3 py-1.5 border-r border-white/[0.06]">
                    <CellEditor cell={cell} property={prop} onUpdate={onUpdateCell} />
                  </td>
                );
              })}
              <td className="px-2">
                <button
                  onClick={() => onDeleteRow(row.id)}
                  className="opacity-0 group-hover/row:opacity-100 p-1 hover:bg-white/10 rounded text-white/30"
                >
                  <Trash2 size={13} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={onAddRow}
        className="w-full px-3 py-2 text-sm text-white/40 hover:bg-white/[0.04] hover:text-white/60 text-left flex items-center gap-2 transition-colors"
      >
        <Plus size={14} /> New row
      </button>
    </div>
  );
}

function BoardView({
  properties,
  rows,
  onUpdateCell,
  onDeleteRow,
  onAddRow,
}: {
  properties: DatabasePropertyType[];
  rows: DatabaseRowType[];
  onUpdateCell: (cellId: string, value: any) => void;
  onDeleteRow: (rowId: string) => void;
  onAddRow: () => void;
}) {
  const statusProp = properties.find((p) => p.type === 'select' || p.type === 'status');
  if (!statusProp) {
    return (
      <div className="text-sm text-white/40 p-4">
        Add a Select or Status property to use Board view.
      </div>
    );
  }

  const options = (statusProp.config as any)?.options || [];
  const nameProperty = properties.find((p) => p.type === 'text') || properties[0];

  const groups: Record<string, DatabaseRowType[]> = { 'No Status': [] };
  options.forEach((opt: any) => {
    groups[opt.label] = [];
  });

  rows.forEach((row) => {
    const cell = row.cells.find((c) => c.propertyId === statusProp.id);
    const val = (cell?.value as any)?.selected || 'No Status';
    if (!groups[val]) groups[val] = [];
    groups[val].push(row);
  });

  return (
    <div className="flex gap-3 overflow-x-auto pb-4">
      {Object.entries(groups).map(([groupName, groupRows]) => {
        const opt = options.find((o: any) => o.label === groupName);
        return (
          <div key={groupName} className="kanban-column flex-shrink-0">
            <div className="flex items-center justify-between mb-2 px-1">
              <div className="flex items-center gap-2">
                <span
                  className="tag"
                  style={{ background: opt?.color ? `${opt.color}20` : 'rgba(255,255,255,0.1)', color: opt?.color || '#fff' }}
                >
                  {groupName}
                </span>
                <span className="text-xs text-white/30">{groupRows.length}</span>
              </div>
            </div>
            <div className="space-y-2">
              {groupRows.map((row) => {
                const nameCell = row.cells.find((c) => c.propertyId === nameProperty?.id);
                const name = (nameCell?.value as any)?.text || 'Untitled';
                return (
                  <div key={row.id} className="kanban-card group/card">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{name}</span>
                      <button
                        onClick={() => onDeleteRow(row.id)}
                        className="opacity-0 group-hover/card:opacity-100 p-0.5 hover:bg-white/10 rounded"
                      >
                        <Trash2 size={12} className="text-white/30" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            <button
              onClick={onAddRow}
              className="w-full mt-2 p-1.5 text-xs text-white/30 hover:bg-white/[0.06] rounded flex items-center justify-center gap-1"
            >
              <Plus size={12} /> New
            </button>
          </div>
        );
      })}
    </div>
  );
}

function ListView({
  properties,
  rows,
  onUpdateCell,
  onDeleteRow,
  onAddRow,
}: {
  properties: DatabasePropertyType[];
  rows: DatabaseRowType[];
  onUpdateCell: (cellId: string, value: any) => void;
  onDeleteRow: (rowId: string) => void;
  onAddRow: () => void;
}) {
  const nameProperty = properties.find((p) => p.type === 'text') || properties[0];

  return (
    <div className="space-y-1">
      {rows.map((row) => {
        const nameCell = row.cells.find((c) => c.propertyId === nameProperty?.id);
        const name = (nameCell?.value as any)?.text || 'Untitled';
        return (
          <div
            key={row.id}
            className="flex items-center gap-3 px-3 py-2 hover:bg-white/[0.04] rounded group/item"
          >
            <span className="text-sm flex-1">{name}</span>
            {properties.slice(1, 4).map((prop) => {
              const cell = row.cells.find((c) => c.propertyId === prop.id);
              if (!cell) return null;
              return (
                <span key={prop.id} className="text-xs text-white/40">
                  <CellDisplay cell={cell} property={prop} />
                </span>
              );
            })}
            <button
              onClick={() => onDeleteRow(row.id)}
              className="opacity-0 group-hover/item:opacity-100 p-0.5 hover:bg-white/10 rounded"
            >
              <Trash2 size={13} className="text-white/30" />
            </button>
          </div>
        );
      })}
      <button
        onClick={onAddRow}
        className="w-full px-3 py-2 text-sm text-white/30 hover:bg-white/[0.04] rounded flex items-center gap-2"
      >
        <Plus size={14} /> New row
      </button>
    </div>
  );
}

function GalleryView({
  properties,
  rows,
  onUpdateCell,
  onDeleteRow,
}: {
  properties: DatabasePropertyType[];
  rows: DatabaseRowType[];
  onUpdateCell: (cellId: string, value: any) => void;
  onDeleteRow: (rowId: string) => void;
}) {
  const nameProperty = properties.find((p) => p.type === 'text') || properties[0];

  return (
    <div className="gallery-grid">
      {rows.map((row) => {
        const nameCell = row.cells.find((c) => c.propertyId === nameProperty?.id);
        const name = (nameCell?.value as any)?.text || 'Untitled';
        return (
          <div key={row.id} className="gallery-card group/card">
            <div className="h-32 bg-dark-200 flex items-center justify-center text-3xl text-white/10">
              📄
            </div>
            <div className="p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium truncate">{name}</span>
                <button
                  onClick={() => onDeleteRow(row.id)}
                  className="opacity-0 group-hover/card:opacity-100 p-0.5 hover:bg-white/10 rounded"
                >
                  <Trash2 size={12} className="text-white/30" />
                </button>
              </div>
              <div className="mt-1 space-y-0.5">
                {properties.slice(1, 3).map((prop) => {
                  const cell = row.cells.find((c) => c.propertyId === prop.id);
                  if (!cell) return null;
                  return (
                    <div key={prop.id} className="text-xs text-white/40">
                      {prop.name}: <CellDisplay cell={cell} property={prop} />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function CalendarView({
  properties,
  rows,
  onUpdateCell,
}: {
  properties: DatabasePropertyType[];
  rows: DatabaseRowType[];
  onUpdateCell: (cellId: string, value: any) => void;
}) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const dateProp = properties.find((p) => p.type === 'date');
  const nameProperty = properties.find((p) => p.type === 'text') || properties[0];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const getRowsForDay = (day: number) => {
    if (!dateProp) return [];
    return rows.filter((row) => {
      const cell = row.cells.find((c) => c.propertyId === dateProp.id);
      if (!cell) return false;
      const d = new Date((cell.value as any)?.date);
      return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
    });
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
          className="btn btn-ghost text-sm"
        >
          ← Prev
        </button>
        <span className="text-sm font-medium">{monthNames[month]} {year}</span>
        <button
          onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
          className="btn btn-ghost text-sm"
        >
          Next →
        </button>
      </div>
      <div className="grid grid-cols-7 gap-px bg-white/[0.06] rounded-lg overflow-hidden">
        {dayNames.map((d) => (
          <div key={d} className="bg-dark-300 px-2 py-1.5 text-xs text-white/40 text-center font-medium">{d}</div>
        ))}
        {days.map((day, i) => {
          const isToday = day && today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
          const dayRows = day ? getRowsForDay(day) : [];
          return (
            <div
              key={i}
              className={`calendar-cell ${isToday ? 'today' : ''} ${!day ? 'bg-dark-400' : ''}`}
            >
              {day && (
                <>
                  <div className={`text-xs mb-1 ${isToday ? 'text-accent font-bold' : 'text-white/50'}`}>{day}</div>
                  {dayRows.slice(0, 3).map((row) => {
                    const nameCell = row.cells.find((c) => c.propertyId === nameProperty?.id);
                    return (
                      <div key={row.id} className="text-[10px] bg-accent/20 text-accent rounded px-1 py-0.5 mb-0.5 truncate">
                        {(nameCell?.value as any)?.text || 'Untitled'}
                      </div>
                    );
                  })}
                  {dayRows.length > 3 && (
                    <div className="text-[10px] text-white/30">+{dayRows.length - 3} more</div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
      {!dateProp && (
        <div className="text-sm text-white/40 p-4 text-center">Add a Date property to use Calendar view.</div>
      )}
    </div>
  );
}

function CellEditor({
  cell,
  property,
  onUpdate,
}: {
  cell: DatabaseCellType;
  property: DatabasePropertyType;
  onUpdate: (cellId: string, value: any) => void;
}) {
  const value = cell.value as any;
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedUpdate = (val: any) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => onUpdate(cell.id, val), 500);
  };

  switch (property.type) {
    case 'text':
      return (
        <input
          defaultValue={value?.text || ''}
          className="bg-transparent border-none outline-none text-sm w-full p-0"
          onChange={(e) => debouncedUpdate({ text: e.target.value })}
        />
      );
    case 'number':
      return (
        <input
          type="number"
          defaultValue={value?.number ?? ''}
          className="bg-transparent border-none outline-none text-sm w-full p-0"
          onChange={(e) => debouncedUpdate({ number: parseFloat(e.target.value) || 0 })}
        />
      );
    case 'checkbox':
      return (
        <input
          type="checkbox"
          checked={value?.checked || false}
          onChange={(e) => onUpdate(cell.id, { checked: e.target.checked })}
          className="w-4 h-4 accent-accent cursor-pointer"
        />
      );
    case 'select':
    case 'status': {
      const options = (property.config as any)?.options || [];
      return (
        <select
          value={value?.selected || ''}
          onChange={(e) => onUpdate(cell.id, { selected: e.target.value })}
          className="bg-transparent border-none outline-none text-sm p-0 cursor-pointer w-full"
        >
          <option value="">—</option>
          {options.map((opt: any) => (
            <option key={opt.label} value={opt.label}>{opt.label}</option>
          ))}
        </select>
      );
    }
    case 'multi_select':
    case 'tags': {
      const options = (property.config as any)?.options || [];
      const selected: string[] = value?.selected || [];
      return (
        <div className="flex items-center gap-1 flex-wrap">
          {selected.map((s) => (
            <span key={s} className="tag bg-accent/20 text-accent">
              {s}
              <button
                onClick={() => onUpdate(cell.id, { selected: selected.filter((x) => x !== s) })}
                className="ml-1 hover:text-white"
              >
                ×
              </button>
            </span>
          ))}
          <select
            value=""
            onChange={(e) => {
              if (e.target.value && !selected.includes(e.target.value)) {
                onUpdate(cell.id, { selected: [...selected, e.target.value] });
              }
            }}
            className="bg-transparent border-none outline-none text-xs p-0 cursor-pointer text-white/40"
          >
            <option value="">+</option>
            {options.filter((o: any) => !selected.includes(o.label)).map((opt: any) => (
              <option key={opt.label} value={opt.label}>{opt.label}</option>
            ))}
          </select>
        </div>
      );
    }
    case 'date':
      return (
        <input
          type="date"
          defaultValue={value?.date ? new Date(value.date).toISOString().split('T')[0] : ''}
          className="bg-transparent border-none outline-none text-sm p-0 cursor-pointer w-full"
          onChange={(e) => onUpdate(cell.id, { date: e.target.value })}
        />
      );
    case 'url':
      return (
        <input
          type="url"
          defaultValue={value?.url || ''}
          placeholder="https://..."
          className="bg-transparent border-none outline-none text-sm w-full p-0 text-accent"
          onChange={(e) => debouncedUpdate({ url: e.target.value })}
        />
      );
    case 'email':
      return (
        <input
          type="email"
          defaultValue={value?.email || ''}
          placeholder="email@..."
          className="bg-transparent border-none outline-none text-sm w-full p-0"
          onChange={(e) => debouncedUpdate({ email: e.target.value })}
        />
      );
    case 'phone':
      return (
        <input
          type="tel"
          defaultValue={value?.phone || ''}
          className="bg-transparent border-none outline-none text-sm w-full p-0"
          onChange={(e) => debouncedUpdate({ phone: e.target.value })}
        />
      );
    default:
      return (
        <input
          defaultValue={value?.text || ''}
          className="bg-transparent border-none outline-none text-sm w-full p-0"
          onChange={(e) => debouncedUpdate({ text: e.target.value })}
        />
      );
  }
}

function CellDisplay({ cell, property }: { cell: DatabaseCellType; property: DatabasePropertyType }) {
  const value = cell.value as any;
  switch (property.type) {
    case 'checkbox':
      return <span>{value?.checked ? '✓' : '—'}</span>;
    case 'select':
    case 'status':
      return <span>{value?.selected || '—'}</span>;
    case 'date':
      return <span>{value?.date ? new Date(value.date).toLocaleDateString() : '—'}</span>;
    case 'url':
      return <span className="text-accent">{value?.url || '—'}</span>;
    default:
      return <span>{value?.text || value?.number || '—'}</span>;
  }
}

function applyFilters(
  rows: DatabaseRowType[],
  properties: DatabasePropertyType[],
  filters: { propertyId: string; operator: string; value: string }[]
): DatabaseRowType[] {
  if (filters.length === 0) return rows;

  return rows.filter((row) => {
    return filters.every((filter) => {
      const cell = row.cells.find((c) => c.propertyId === filter.propertyId);
      if (!cell) return filter.operator === 'is_empty';
      const val = cell.value as any;
      const cellText = val?.text || val?.selected || val?.number?.toString() || val?.date || '';

      switch (filter.operator) {
        case 'contains':
          return cellText.toLowerCase().includes(filter.value.toLowerCase());
        case 'equals':
          return cellText.toLowerCase() === filter.value.toLowerCase();
        case 'not_equals':
          return cellText.toLowerCase() !== filter.value.toLowerCase();
        case 'is_empty':
          return !cellText;
        case 'is_not_empty':
          return !!cellText;
        default:
          return true;
      }
    });
  });
}

function applySorts(
  rows: DatabaseRowType[],
  properties: DatabasePropertyType[],
  sorts: { propertyId: string; direction: 'asc' | 'desc' }[]
): DatabaseRowType[] {
  if (sorts.length === 0) return rows;

  return [...rows].sort((a, b) => {
    for (const sort of sorts) {
      const cellA = a.cells.find((c) => c.propertyId === sort.propertyId);
      const cellB = b.cells.find((c) => c.propertyId === sort.propertyId);
      const valA = (cellA?.value as any)?.text || (cellA?.value as any)?.number?.toString() || '';
      const valB = (cellB?.value as any)?.text || (cellB?.value as any)?.number?.toString() || '';
      const cmp = valA.localeCompare(valB);
      if (cmp !== 0) return sort.direction === 'asc' ? cmp : -cmp;
    }
    return 0;
  });
}
