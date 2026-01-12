'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ResizableImage from './extensions/ResizableImageExtension';
import Placeholder from '@tiptap/extension-placeholder';
import { TaskList } from '@tiptap/extension-task-list';
import { TaskItem } from '@tiptap/extension-task-item';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import {
  Bold, Italic, Strikethrough, Code, Link as LinkIcon, Underline as UnderlineIcon,
  Heading1, Heading2, Heading3, List, ListOrdered, Quote, Image as ImageIcon,
  LayoutGrid, BarChart as BarChartIcon, Undo, Redo, CheckSquare,
  AlignLeft, AlignCenter, AlignRight, AlignJustify, Highlighter,
  Subscript as SubscriptIcon, Superscript as SuperscriptIcon, Plus, ChevronDown, DollarSign
} from 'lucide-react';
import ChartExtension from './extensions/ChartExtension';
import ChartModal from './ChartModal';

import { useCallback, useState, useEffect, useRef } from 'react';

interface EditorProps {
  value: string;
  onChange: (html: string) => void;
}

export default function Editor({ value, onChange }: EditorProps) {
  const [headingMenuOpen, setHeadingMenuOpen] = useState(false);
  const [currencyMenuOpen, setCurrencyMenuOpen] = useState(false);
  const [isChartModalOpen, setIsChartModalOpen] = useState(false);
  const headingMenuRef = useRef<HTMLDivElement>(null);
  const currencyMenuRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder: "Start typing...",
        includeChildren: true,
      }),
      ResizableImage,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: {
          class: 'text-blue-600 underline decoration-blue-400 hover:text-blue-800 transition-colors cursor-pointer',
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Highlight.configure({
        multicolor: true,
      }),
      Subscript,
      Superscript,
      ChartExtension,
    ],
    content: value,
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[350px] prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    immediatelyRender: false,
  });

  // Close heading menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headingMenuRef.current && !headingMenuRef.current.contains(event.target as Node)) {
        setHeadingMenuOpen(false);
      }
      if (currencyMenuRef.current && !currencyMenuRef.current.contains(event.target as Node)) {
        setCurrencyMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    if (!res.ok) throw new Error('Failed to upload image');
    const data = await res.json();
    return data.secure_url;
  };

  const handleAddImage = useCallback(() => {
    if (!editor) return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async () => {
      if (input.files?.length) {
        const file = input.files[0];
        try {
          const url = await uploadImage(file);
          editor.chain().focus().setResizableImage({ src: url, alignment: 'center' }).run();
        } catch (error) {
          console.error(error);
          alert('Error uploading image');
        }
      }
    };
    input.click();
  }, [editor]);

  const handleAddGallery = useCallback(() => {
    if (!editor) return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;
    input.onchange = async () => {
      if (input.files?.length) {
        const files = Array.from(input.files);
        let gridClass = 'grid-cols-1';
        if (files.length === 2) gridClass = 'grid-cols-2';
        else if (files.length === 3) gridClass = 'grid-cols-3';
        else if (files.length >= 4) gridClass = 'grid-cols-2 md:grid-cols-4';
        try {
          const urls = await Promise.all(files.map(file => uploadImage(file)));
          let imagesHtml = '';
          urls.forEach(url => {
            imagesHtml += `<div class="relative aspect-[4/3] w-full overflow-hidden rounded-lg"><img src="${url}" class="object-cover w-full h-full m-0" alt="Gallery Image" /></div>`;
          });
          const gridHtml = `<div class="grid ${gridClass} gap-4 my-8 not-prose">${imagesHtml}</div><p></p>`;
          editor.chain().focus().insertContent(gridHtml).run();
        } catch (error) {
          console.error(error);
          alert('Error uploading images for gallery');
        }
      }
    };
    input.click();
  }, [editor]);


  const handleAddChart = useCallback(() => {
    setIsChartModalOpen(true);
  }, []);

  const handleSaveChart = useCallback((chartData: any) => {
    if (!editor) return;
    editor.chain().focus().insertContent({
      type: 'chart',
      attrs: {
        ...chartData,
        dataKey: 'value',
        xAxisKey: 'name'
      }
    }).run();
  }, [editor]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);
    if (url === null) return;
    if (url === '') { editor.chain().focus().extendMarkRange('link').unsetLink().run(); return; }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  const ToolbarButton = ({ onClick, isActive = false, children, title }: any) => (
    <button
      onMouseDown={(e) => e.preventDefault()}
      onClick={(e) => { e.preventDefault(); onClick(); }}
      className={`p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${isActive ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300'}`}
      type="button"
      title={title}
    >
      {children}
    </button>
  );

  const Divider = ({ className = "" }: { className?: string }) => <div className={`w-px h-5 bg-gray-200 mx-1 ${className}`} />;

  const getActiveHeading = () => {
    if (editor.isActive('heading', { level: 1 })) return 'H1';
    if (editor.isActive('heading', { level: 2 })) return 'H2';
    if (editor.isActive('heading', { level: 3 })) return 'H3';
    return 'P';
  };

  return (
    <>
      <div
        className="border border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-[#111] text-white shadow-sm flex flex-col"
        style={{ maxHeight: 'calc(100vh - 250px)', minHeight: '500px' }}
      >
        {/* Sticky Toolbar */}
        <div className="sticky top-0 z-10 bg-white dark:bg-[#111] border-b border-gray-700 px-2 py-1.5 flex flex-wrap items-center gap-0.5 shadow-sm backdrop-blur-sm bg-black/95">
          {/* Undo / Redo */}
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            title="Undo"
            className="text-gray-300 hover:text-white"
          >
            <Undo size={16} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            title="Redo"
            className="text-gray-300 hover:text-white"
          >
            <Redo size={16} />
          </ToolbarButton>

          <Divider className="border-gray-700" />

          {/* Heading Dropdown */}
          <div className="relative" ref={headingMenuRef}>
            <button
              onClick={(e) => {
                e.preventDefault();
                setHeadingMenuOpen(!headingMenuOpen);
              }}
              className="flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-800 text-gray-300 text-sm font-medium"
              type="button"
            >
              {getActiveHeading()}
              <ChevronDown size={14} />
            </button>
            {headingMenuOpen && (
              <div className="absolute top-full left-0 mt-1 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20 py-1 min-w-[120px]">
                <button
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    setHeadingMenuOpen(false);
                    editor.chain().focus().setParagraph().run();
                  }}
                  className="w-full px-3 py-1.5 text-left text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Paragraph
                </button>
                <button
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    setHeadingMenuOpen(false);
                    editor.chain().focus().setHeading({ level: 1 }).run();
                  }}
                  className="w-full px-3 py-1.5 text-left text-sm font-bold text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Heading 1
                </button>
                <button
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    setHeadingMenuOpen(false);
                    editor.chain().focus().setHeading({ level: 2 }).run();
                  }}
                  className="w-full px-3 py-1.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Heading 2
                </button>
                <button
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    setHeadingMenuOpen(false);
                    editor.chain().focus().setHeading({ level: 3 }).run();
                  }}
                  className="w-full px-3 py-1.5 text-left text-sm font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Heading 3
                </button>
              </div>
            )}
          </div>

          <Divider className="border-gray-700" />

          {/* Lists */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
            title="Bullet List"
            className="text-gray-300 hover:text-white"
          >
            <List size={16} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
            title="Numbered List"
            className="text-gray-300 hover:text-white"
          >
            <ListOrdered size={16} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleTaskList().run()}
            isActive={editor.isActive('taskList')}
            title="Task List"
            className="text-gray-300 hover:text-white"
          >
            <CheckSquare size={16} />
          </ToolbarButton>

          <Divider className="border-gray-700" />

          {/* Text Formatting */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
            title="Bold"
            className="text-gray-300 hover:text-white"
          >
            <Bold size={16} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
            title="Italic"
            className="text-gray-300 hover:text-white"
          >
            <Italic size={16} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive('strike')}
            title="Strikethrough"
            className="text-gray-300 hover:text-white"
          >
            <Strikethrough size={16} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            isActive={editor.isActive('code')}
            title="Code"
            className="text-gray-300 hover:text-white"
          >
            <Code size={16} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive('underline')}
            title="Underline"
            className="text-gray-300 hover:text-white"
          >
            <UnderlineIcon size={16} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            isActive={editor.isActive('highlight')}
            title="Highlight"
            className="text-gray-300 hover:text-white"
          >
            <Highlighter size={16} />
          </ToolbarButton>
          <ToolbarButton
            onClick={setLink}
            isActive={editor.isActive('link')}
            title="Link"
            className="text-gray-300 hover:text-white"
          >
            <LinkIcon size={16} />
          </ToolbarButton>

          <Divider className="border-gray-700" />

          {/* Super/Subscript */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleSuperscript().run()}
            isActive={editor.isActive('superscript')}
            title="Superscript"
            className="text-gray-300 hover:text-white"
          >
            <SuperscriptIcon size={16} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleSubscript().run()}
            isActive={editor.isActive('subscript')}
            title="Subscript"
            className="text-gray-300 hover:text-white"
          >
            <SubscriptIcon size={16} />
          </ToolbarButton>

          <Divider className="border-gray-700" />

          {/* Alignment */}
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            isActive={editor.isActive({ textAlign: 'left' })}
            title="Align Left"
            className="text-gray-300 hover:text-white"
          >
            <AlignLeft size={16} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            isActive={editor.isActive({ textAlign: 'center' })}
            title="Align Center"
            className="text-gray-300 hover:text-white"
          >
            <AlignCenter size={16} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            isActive={editor.isActive({ textAlign: 'right' })}
            title="Align Right"
            className="text-gray-300 hover:text-white"
          >
            <AlignRight size={16} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            isActive={editor.isActive({ textAlign: 'justify' })}
            title="Justify"
            className="text-gray-300 hover:text-white"
          >
            <AlignJustify size={16} />
          </ToolbarButton>

          <Divider className="border-gray-700" />

          {/* Media / Extras */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive('blockquote')}
            title="Quote"
            className="text-gray-300 hover:text-white"
          >
            <Quote size={16} />
          </ToolbarButton>
          <ToolbarButton onClick={handleAddImage} title="Image" className="text-gray-300 hover:text-white">
            <ImageIcon size={16} />
          </ToolbarButton>
          <ToolbarButton onClick={handleAddGallery} title="Gallery" className="text-gray-300 hover:text-white">
            <LayoutGrid size={16} />
          </ToolbarButton>
          <ToolbarButton onClick={handleAddChart} title="Chart" className="text-gray-300 hover:text-white">
            <BarChartIcon size={16} />
          </ToolbarButton>

          {/* Currency Symbol Dropdown */}
          <div className="relative" ref={currencyMenuRef}>
            <button
              onMouseDown={(e) => e.preventDefault()}
              onClick={(e) => {
                e.preventDefault();
                setCurrencyMenuOpen(!currencyMenuOpen);
              }}
              className="flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm font-medium"
              type="button"
              title="Insert Currency Symbol"
            >
              <DollarSign size={14} />
              <ChevronDown size={12} />
            </button>
            {currencyMenuOpen && (
              <div className="absolute top-full left-0 mt-1 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20 py-1 min-w-[140px] max-h-[200px] overflow-y-auto">
                {[
                  { symbol: '₹', name: 'Rupee' },
                  { symbol: '$', name: 'Dollar' },
                  { symbol: '€', name: 'Euro' },
                  { symbol: '£', name: 'Pound' },
                  { symbol: '¥', name: 'Yen' },
                  { symbol: '₩', name: 'Won' },
                  { symbol: '₿', name: 'Bitcoin' },
                  { symbol: '¢', name: 'Cent' },
                  { symbol: '₣', name: 'Franc' },
                  { symbol: '₺', name: 'Lira' },
                  { symbol: '₽', name: 'Ruble' },
                  { symbol: '%', name: 'Percent' },
                ].map(({ symbol, name }) => (
                  <button
                    key={symbol}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      setCurrencyMenuOpen(false);
                      editor.chain().focus().insertContent(symbol).run();
                    }}
                    className="w-full px-3 py-1.5 text-left text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2"
                  >
                    <span className="font-medium w-5">{symbol}</span>
                    <span>{name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Scrollable Editor Content */}
        <div
          className="flex-1 overflow-y-auto p-4 bg-white dark:bg-[#111] text-gray-900 dark:text-white min-h-[400px]"
          onClick={() => editor.chain().focus().run()}
        >
          <EditorContent editor={editor} />
        </div>
      </div>

      {/* Chart Modal */}
      <ChartModal
        isOpen={isChartModalOpen}
        onClose={() => setIsChartModalOpen(false)}
        onSave={handleSaveChart}
      />
    </>
  );
}
