'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    PieChart,
    Pie,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell
} from 'recharts';

interface ChartComponentProps {
    type: 'bar' | 'line' | 'pie' | 'area';
    data: any[];
    dataKey: string;
    xAxisKey: string;
    title?: string;
    colors?: string[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export default function ChartComponent({
    type,
    data,
    dataKey,
    xAxisKey,
    title,
    colors = COLORS
}: ChartComponentProps) {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!data || data.length === 0) return <div className="text-gray-700 dark:text-gray-300">No data for chart</div>;

    // Theme-aware colors
    const isDark = mounted && resolvedTheme === 'dark';
    const gridColor = isDark ? '#374151' : '#e5e7eb';
    const axisColor = isDark ? '#9ca3af' : '#6b7280';
    const tooltipBg = isDark ? '#1f2937' : '#ffffff';
    const tooltipBorder = isDark ? '#374151' : '#e5e7eb';
    const legendColor = isDark ? '#d1d5db' : '#374151';

    const renderChart = () => {
        const commonAxisProps = {
            stroke: axisColor,
            tick: { fill: axisColor },
        };

        const commonTooltipProps = {
            contentStyle: {
                backgroundColor: tooltipBg,
                border: `1px solid ${tooltipBorder}`,
                borderRadius: '8px',
                color: isDark ? '#f3f4f6' : '#1f2937',
            },
        };

        const commonLegendProps = {
            wrapperStyle: { color: legendColor },
        };

        switch (type) {
            case 'bar':
                return (
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                        <XAxis dataKey={xAxisKey} {...commonAxisProps} />
                        <YAxis {...commonAxisProps} />
                        <Tooltip {...commonTooltipProps} />
                        <Legend {...commonLegendProps} />
                        <Bar dataKey={dataKey} fill={colors[0]} />
                    </BarChart>
                );
            case 'line':
                return (
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                        <XAxis dataKey={xAxisKey} {...commonAxisProps} />
                        <YAxis {...commonAxisProps} />
                        <Tooltip {...commonTooltipProps} />
                        <Legend {...commonLegendProps} />
                        <Line type="monotone" dataKey={dataKey} stroke={colors[0]} />
                    </LineChart>
                );
            case 'area':
                return (
                    <AreaChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                        <XAxis dataKey={xAxisKey} {...commonAxisProps} />
                        <YAxis {...commonAxisProps} />
                        <Tooltip {...commonTooltipProps} />
                        <Legend {...commonLegendProps} />
                        <Area type="monotone" dataKey={dataKey} stroke={colors[0]} fill={colors[0]} />
                    </AreaChart>
                );
            case 'pie':
                return (
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey={dataKey}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                            ))}
                        </Pie>
                        <Tooltip {...commonTooltipProps} />
                        <Legend {...commonLegendProps} />
                    </PieChart>
                );
            default:
                return <div className="text-gray-700 dark:text-gray-300">Unsupported chart type</div>;
        }
    };

    return (
        <div className="w-full h-[400px] my-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
            {title && <h3 className="text-center text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">{title}</h3>}
            <ResponsiveContainer width="100%" height="100%">
                {renderChart()}
            </ResponsiveContainer>
        </div>
    );
}
