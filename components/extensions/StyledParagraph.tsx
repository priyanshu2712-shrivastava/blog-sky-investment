'use client';

import Paragraph from '@tiptap/extension-paragraph';

/**
 * Extended Paragraph extension that supports inline styles
 * This allows for line-height and other CSS properties to be applied
 * and preserved in the HTML output
 */
const StyledParagraph = Paragraph.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            style: {
                default: null,
                parseHTML: element => element.getAttribute('style'),
                renderHTML: attributes => {
                    if (!attributes.style) {
                        return {};
                    }
                    return { style: attributes.style };
                },
            },
        };
    },
});

export default StyledParagraph;
