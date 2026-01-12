import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import ChartComponent from '../ChartComponent';
import { NodeViewWrapper } from '@tiptap/react';

const ChartNodeView = ({ node }: any) => {
    return (
        <NodeViewWrapper className="chart-component">
            <ChartComponent {...node.attrs} />
        </NodeViewWrapper>
    );
};

export default Node.create({
    name: 'chart',

    group: 'block',

    atom: true,

    addAttributes() {
        return {
            type: {
                default: 'bar',
                parseHTML: (element) => element.getAttribute('data-chart-type'),
                renderHTML: (attributes) => ({ 'data-chart-type': attributes.type }),
            },
            data: {
                default: [],
                parseHTML: (element) => {
                    const data = element.getAttribute('data-chart-data');
                    try {
                        return data ? JSON.parse(data) : [];
                    } catch (e) { return []; }
                },
                renderHTML: (attributes) => ({ 'data-chart-data': JSON.stringify(attributes.data) }),
            },
            dataKey: {
                default: 'value',
                parseHTML: (element) => element.getAttribute('data-chart-datakey'),
                renderHTML: (attributes) => ({ 'data-chart-datakey': attributes.dataKey }),
            },
            xAxisKey: {
                default: 'name',
                parseHTML: (element) => element.getAttribute('data-chart-xaxiskey'),
                renderHTML: (attributes) => ({ 'data-chart-xaxiskey': attributes.xAxisKey }),
            },
            title: {
                default: '',
                parseHTML: (element) => element.getAttribute('data-chart-title'),
                renderHTML: (attributes) => ({ 'data-chart-title': attributes.title }),
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'div[data-type="chart"]',
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'chart' })];
    },

    addNodeView() {
        return ReactNodeViewRenderer(ChartNodeView);
    },
});
