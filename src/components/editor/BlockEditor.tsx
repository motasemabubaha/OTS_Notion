'use client';

import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import Typography from '@tiptap/extension-typography';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Link as LinkIcon,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  Minus,
  Table as TableIcon,
  ImageIcon,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Highlighter,
  FileCode,
  ToggleLeft,
  AlertCircle,
  Calculator,
  Bookmark,
} from 'lucide-react';

const lowlight = createLowlight(common);

interface BlockEditorProps {
  content: any;
  onUpdate: (content: any) => void;
  editable?: boolean;
}

const slashCommands = [
  { id: 'text', label: 'Text', description: 'Plain text block', icon: <Type size={18} />, command: 'paragraph' },
  { id: 'h1', label: 'Heading 1', description: 'Large heading', icon: <Heading1 size={18} />, command: 'heading1' },
  { id: 'h2', label: 'Heading 2', description: 'Medium heading', icon: <Heading2 size={18} />, command: 'heading2' },
  { id: 'h3', label: 'Heading 3', description: 'Small heading', icon: <Heading3 size={18} />, command: 'heading3' },
  { id: 'bullet', label: 'Bullet List', description: 'Unordered list', icon: <List size={18} />, command: 'bulletList' },
  { id: 'numbered', label: 'Numbered List', description: 'Ordered list', icon: <ListOrdered size={18} />, command: 'orderedList' },
  { id: 'todo', label: 'To-Do List', description: 'Checklist', icon: <CheckSquare size={18} />, command: 'taskList' },
  { id: 'quote', label: 'Quote', description: 'Block quote', icon: <Quote size={18} />, command: 'blockquote' },
  { id: 'divider', label: 'Divider', description: 'Horizontal line', icon: <Minus size={18} />, command: 'horizontalRule' },
  { id: 'code', label: 'Code Block', description: 'Code snippet', icon: <FileCode size={18} />, command: 'codeBlock' },
  { id: 'table', label: 'Table', description: 'Table block', icon: <TableIcon size={18} />, command: 'table' },
  { id: 'image', label: 'Image', description: 'Upload or embed', icon: <ImageIcon size={18} />, command: 'image' },
  { id: 'callout', label: 'Callout', description: 'Highlighted info', icon: <AlertCircle size={18} />, command: 'callout' },
];

export default function BlockEditor({ content, onUpdate, editable = true }: BlockEditorProps) {
  const [slashMenuOpen, setSlashMenuOpen] = useState(false);
  const [slashMenuPos, setSlashMenuPos] = useState({ x: 0, y: 0 });
  const [slashFilter, setSlashFilter] = useState('');
  const [slashIndex, setSlashIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
        heading: { levels: [1, 2, 3] },
      }),
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === 'heading') {
            const level = node.attrs.level;
            return `Heading ${level}`;
          }
          return "Type '/' for commands...";
        },
      }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
      Image.configure({ inline: false, allowBase64: true }),
      Link.configure({ openOnClick: false }),
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Highlight.configure({ multicolor: true }),
      Typography,
      CodeBlockLowlight.configure({ lowlight }),
    ],
    content: content || { type: 'doc', content: [{ type: 'paragraph' }] },
    editable,
    onUpdate: ({ editor }) => {
      onUpdate(editor.getJSON());
    },
    editorProps: {
      attributes: {
        class: 'ProseMirror',
      },
      handleKeyDown: (view, event) => {
        if (event.key === '/' && !slashMenuOpen) {
          const { from } = view.state.selection;
          const coords = view.coordsAtPos(from);
          setSlashMenuPos({ x: coords.left, y: coords.bottom + 4 });
          setSlashMenuOpen(true);
          setSlashFilter('');
          setSlashIndex(0);
          return false;
        }

        if (slashMenuOpen) {
          if (event.key === 'Escape') {
            setSlashMenuOpen(false);
            return true;
          }
          if (event.key === 'ArrowDown') {
            event.preventDefault();
            setSlashIndex((prev) => (prev + 1) % filteredCommands.length);
            return true;
          }
          if (event.key === 'ArrowUp') {
            event.preventDefault();
            setSlashIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
            return true;
          }
          if (event.key === 'Enter') {
            event.preventDefault();
            if (filteredCommands[slashIndex]) {
              executeSlashCommand(filteredCommands[slashIndex].command);
            }
            return true;
          }
        }
        return false;
      },
    },
  });

  const filteredCommands = slashCommands.filter(
    (cmd) =>
      cmd.label.toLowerCase().includes(slashFilter.toLowerCase()) ||
      cmd.description.toLowerCase().includes(slashFilter.toLowerCase())
  );

  useEffect(() => {
    if (!editor || !slashMenuOpen) return;

    const handler = () => {
      const { from } = editor.state.selection;
      const textBefore = editor.state.doc.textBetween(
        Math.max(0, from - 20),
        from,
        ' '
      );
      const slashPos = textBefore.lastIndexOf('/');
      if (slashPos === -1) {
        setSlashMenuOpen(false);
        return;
      }
      const filter = textBefore.slice(slashPos + 1);
      setSlashFilter(filter);
      setSlashIndex(0);
    };

    editor.on('update', handler);
    return () => {
      editor.off('update', handler);
    };
  }, [editor, slashMenuOpen]);

  const deleteSlashText = useCallback(() => {
    if (!editor) return;
    const { from } = editor.state.selection;
    const textBefore = editor.state.doc.textBetween(
      Math.max(0, from - 20),
      from,
      ' '
    );
    const slashPos = textBefore.lastIndexOf('/');
    if (slashPos >= 0) {
      const deleteFrom = from - (textBefore.length - slashPos);
      editor.chain().focus().deleteRange({ from: deleteFrom, to: from }).run();
    }
  }, [editor]);

  const executeSlashCommand = useCallback(
    (command: string) => {
      if (!editor) return;
      setSlashMenuOpen(false);
      deleteSlashText();

      setTimeout(() => {
        switch (command) {
          case 'paragraph':
            editor.chain().focus().setParagraph().run();
            break;
          case 'heading1':
            editor.chain().focus().toggleHeading({ level: 1 }).run();
            break;
          case 'heading2':
            editor.chain().focus().toggleHeading({ level: 2 }).run();
            break;
          case 'heading3':
            editor.chain().focus().toggleHeading({ level: 3 }).run();
            break;
          case 'bulletList':
            editor.chain().focus().toggleBulletList().run();
            break;
          case 'orderedList':
            editor.chain().focus().toggleOrderedList().run();
            break;
          case 'taskList':
            editor.chain().focus().toggleTaskList().run();
            break;
          case 'blockquote':
            editor.chain().focus().toggleBlockquote().run();
            break;
          case 'horizontalRule':
            editor.chain().focus().setHorizontalRule().run();
            break;
          case 'codeBlock':
            editor.chain().focus().toggleCodeBlock().run();
            break;
          case 'table':
            editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
            break;
          case 'image':
            fileInputRef.current?.click();
            break;
          case 'callout':
            editor
              .chain()
              .focus()
              .insertContent({
                type: 'blockquote',
                content: [{ type: 'paragraph', content: [{ type: 'text', text: '💡 ' }] }],
              })
              .run();
            break;
        }
      }, 10);
    },
    [editor, deleteSlashText]
  );

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.url) {
        editor.chain().focus().setImage({ src: data.url }).run();
      }
    } catch (err) {
      console.error('Upload failed', err);
    }

    e.target.value = '';
  };

  if (!editor) return null;

  return (
    <div className="relative">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
      />

      {editor && (
        <BubbleMenu
          editor={editor}
          tippyOptions={{ duration: 100, placement: 'top' }}
          className="flex items-center gap-0.5 bg-dark-100 border border-white/10 rounded-lg p-1 shadow-xl"
        >
          <ToolbarButton
            active={editor.isActive('bold')}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <Bold size={15} />
          </ToolbarButton>
          <ToolbarButton
            active={editor.isActive('italic')}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <Italic size={15} />
          </ToolbarButton>
          <ToolbarButton
            active={editor.isActive('underline')}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          >
            <UnderlineIcon size={15} />
          </ToolbarButton>
          <ToolbarButton
            active={editor.isActive('strike')}
            onClick={() => editor.chain().focus().toggleStrike().run()}
          >
            <Strikethrough size={15} />
          </ToolbarButton>
          <ToolbarButton
            active={editor.isActive('code')}
            onClick={() => editor.chain().focus().toggleCode().run()}
          >
            <Code size={15} />
          </ToolbarButton>
          <ToolbarButton
            active={editor.isActive('highlight')}
            onClick={() => editor.chain().focus().toggleHighlight().run()}
          >
            <Highlighter size={15} />
          </ToolbarButton>
          <div className="w-px h-5 bg-white/10 mx-0.5" />
          <ToolbarButton
            active={editor.isActive({ textAlign: 'left' })}
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
          >
            <AlignLeft size={15} />
          </ToolbarButton>
          <ToolbarButton
            active={editor.isActive({ textAlign: 'center' })}
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
          >
            <AlignCenter size={15} />
          </ToolbarButton>
          <ToolbarButton
            active={editor.isActive({ textAlign: 'right' })}
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
          >
            <AlignRight size={15} />
          </ToolbarButton>
          <div className="w-px h-5 bg-white/10 mx-0.5" />
          <ToolbarButton
            active={editor.isActive('link')}
            onClick={() => {
              const url = prompt('Enter URL:');
              if (url) {
                editor.chain().focus().setLink({ href: url }).run();
              }
            }}
          >
            <LinkIcon size={15} />
          </ToolbarButton>
        </BubbleMenu>
      )}

      <EditorContent editor={editor} />

      {slashMenuOpen && filteredCommands.length > 0 && (
        <div
          className="slash-command-menu animate-fadeIn"
          style={{ left: slashMenuPos.x, top: slashMenuPos.y }}
        >
          {filteredCommands.map((cmd, i) => (
            <div
              key={cmd.id}
              className={`slash-command-item ${i === slashIndex ? 'active' : ''}`}
              onClick={() => executeSlashCommand(cmd.command)}
              onMouseEnter={() => setSlashIndex(i)}
            >
              <div className="slash-command-item-icon">{cmd.icon}</div>
              <div>
                <div className="text-sm text-white/90">{cmd.label}</div>
                <div className="text-xs text-white/40">{cmd.description}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ToolbarButton({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`p-1.5 rounded transition-colors ${
        active ? 'bg-white/15 text-white' : 'text-white/60 hover:bg-white/10 hover:text-white/80'
      }`}
    >
      {children}
    </button>
  );
}
