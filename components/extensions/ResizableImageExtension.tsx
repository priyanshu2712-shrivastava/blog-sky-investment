'use client';

import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper, NodeViewProps } from '@tiptap/react';
import React, { useRef, useState, useCallback } from 'react';
import { AlignLeft, AlignCenter, AlignRight, Trash2 } from 'lucide-react';

// Declare the commands for TypeScript
declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        resizableImage: {
            setResizableImage: (options: { src: string; alt?: string; title?: string; width?: number; alignment?: string }) => ReturnType;
        };
    }
}

// Image Component with resize handles
const ResizableImageComponent = ({ node, updateAttributes, selected, deleteNode }: NodeViewProps) => {
    const imageRef = useRef<HTMLImageElement>(null);
    const [isResizing, setIsResizing] = useState(false);
    const [showControls, setShowControls] = useState(false);

    const { src, alt, width, alignment } = node.attrs;

    const handleResizeStart = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsResizing(true);

        const startX = e.clientX;
        const startWidth = imageRef.current?.offsetWidth || width || 300;

        const handleMouseMove = (moveEvent: MouseEvent) => {
            const diff = moveEvent.clientX - startX;
            const newWidth = Math.max(100, Math.min(startWidth + diff, 1200));
            updateAttributes({ width: newWidth });
        };

        const handleMouseUp = () => {
            setIsResizing(false);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }, [width, updateAttributes]);

    // Get alignment styles for the wrapper
    const getWrapperStyle = (): React.CSSProperties => {
        return {
            display: 'flex',
            justifyContent: alignment === 'left' ? 'flex-start' : alignment === 'right' ? 'flex-end' : 'center',
            width: '100%',
        };
    };

    return (
        <NodeViewWrapper
            className="relative my-4"
            style={getWrapperStyle()}
        >
            <div
                className="relative inline-block group"
                style={{ width: width ? `${width}px` : 'auto', maxWidth: '100%' }}
                onMouseEnter={() => setShowControls(true)}
                onMouseLeave={() => !isResizing && setShowControls(false)}
            >
                {/* Control Toolbar */}
                {(showControls || selected) && (
                    <div
                        className="absolute -top-10 left-1/2 transform -translate-x-1/2 flex items-center gap-1 bg-white rounded-lg shadow-lg border border-gray-200 p-1 z-10"
                        style={{ whiteSpace: 'nowrap' }}
                    >
                        <button
                            type="button"
                            onClick={() => updateAttributes({ alignment: 'left' })}
                            className={`p-1.5 rounded hover:bg-gray-100 transition-colors ${alignment === 'left' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
                            title="Align Left"
                        >
                            <AlignLeft size={16} />
                        </button>
                        <button
                            type="button"
                            onClick={() => updateAttributes({ alignment: 'center' })}
                            className={`p-1.5 rounded hover:bg-gray-100 transition-colors ${alignment === 'center' || !alignment ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
                            title="Align Center"
                        >
                            <AlignCenter size={16} />
                        </button>
                        <button
                            type="button"
                            onClick={() => updateAttributes({ alignment: 'right' })}
                            className={`p-1.5 rounded hover:bg-gray-100 transition-colors ${alignment === 'right' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
                            title="Align Right"
                        >
                            <AlignRight size={16} />
                        </button>
                        <div className="w-px h-5 bg-gray-200 mx-1" />
                        <button
                            type="button"
                            onClick={deleteNode}
                            className="p-1.5 rounded hover:bg-red-100 text-red-600 transition-colors"
                            title="Delete Image"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                )}

                {/* Image */}
                <img
                    ref={imageRef}
                    src={src}
                    alt={alt || ''}
                    className={`block max-w-full h-auto rounded-lg ${selected ? 'ring-2 ring-blue-500' : ''} ${isResizing ? 'select-none' : ''}`}
                    style={{ width: '100%' }}
                    draggable={false}
                />

                {/* Resize Handle */}
                {(showControls || selected) && (
                    <div
                        onMouseDown={handleResizeStart}
                        className="absolute right-0 top-0 bottom-0 w-4 cursor-ew-resize flex items-center justify-center"
                        style={{ background: 'linear-gradient(to left, rgba(59, 130, 246, 0.3), transparent)' }}
                    >
                        <div className="w-1 h-10 bg-blue-500 rounded-full opacity-70" />
                    </div>
                )}
            </div>
        </NodeViewWrapper>
    );
};

// The Extension
export const ResizableImage = Node.create({
    name: 'resizableImage',

    group: 'block',

    atom: true,

    addAttributes() {
        return {
            src: {
                default: null,
            },
            alt: {
                default: null,
            },
            title: {
                default: null,
            },
            width: {
                default: null,
            },
            alignment: {
                default: 'center',
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'figure[data-resizable-image]',
                getAttrs: (dom) => {
                    const element = dom as HTMLElement;
                    const img = element.querySelector('img');
                    return {
                        src: img?.getAttribute('src'),
                        alt: img?.getAttribute('alt'),
                        width: img?.getAttribute('width') ? parseInt(img.getAttribute('width')!) : null,
                        alignment: element.getAttribute('data-alignment') || 'center',
                    };
                },
            },
            {
                tag: 'img[src]',
                getAttrs: (dom) => {
                    const element = dom as HTMLImageElement;
                    return {
                        src: element.getAttribute('src'),
                        alt: element.getAttribute('alt'),
                        width: element.getAttribute('width') ? parseInt(element.getAttribute('width')!) : null,
                    };
                },
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        const { src, alt, width, alignment } = HTMLAttributes;

        const justifyContent = alignment === 'left' ? 'flex-start' : alignment === 'right' ? 'flex-end' : 'center';

        return [
            'figure',
            {
                'data-resizable-image': '',
                'data-alignment': alignment,
                style: `display: flex; justify-content: ${justifyContent}; width: 100%;`,
            },
            [
                'img',
                mergeAttributes({
                    src,
                    alt: alt || '',
                    width: width || undefined,
                    style: `max-width: 100%; height: auto; display: block; border-radius: 0.5rem;${width ? ` width: ${width}px;` : ''}`,
                }),
            ],
        ];
    },

    addNodeView() {
        return ReactNodeViewRenderer(ResizableImageComponent);
    },

    addCommands() {
        return {
            setResizableImage:
                (options) =>
                    ({ commands }) => {
                        return commands.insertContent({
                            type: this.name,
                            attrs: options,
                        });
                    },
        };
    },
});

export default ResizableImage;
