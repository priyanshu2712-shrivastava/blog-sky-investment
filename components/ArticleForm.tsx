'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Editor from './Editor';

interface ArticleFormProps {
    initialData?: any;
}

export default function ArticleForm({ initialData }: ArticleFormProps) {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [localFileName, setLocalFileName] = useState('');

    const categoryOptions = [
        'Market Analysis & Trends',
        'IPO & Listing Insights',
        'Sector Deep Dives',
        'Growth Companies',
        'Personal Finance & Wealth Creation',
        'Commodities & Alternative Assets',
        'Geopolitics & Macroeconomics',
        'Financial Literacy & Basics',
    ];

    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        slug: initialData?.slug || '',
        excerpt: initialData?.excerpt || '',
        content: initialData?.content || '',
        coverImage: initialData?.coverImage || '',
        category: initialData?.category || categoryOptions[0],
        isTrending: initialData?.isTrending ?? false,
        isPublished: initialData?.isPublished ?? false, // Default false
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (name === 'coverImage') {
            setLocalFileName(''); // Clear local filename when manual input occurs
            setFormData(prev => ({ ...prev, coverImage: value }));
        } else {
            const isCheckbox = type === 'checkbox';
            const val = isCheckbox ? (e.target as HTMLInputElement).checked : value;
            setFormData(prev => ({ ...prev, [name]: val }));
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const uploadData = new FormData();
        uploadData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: uploadData,
            });

            if (!res.ok) throw new Error('Upload failed');

            const data = await res.json();
            setFormData(prev => ({ ...prev, coverImage: data.secure_url }));
            setLocalFileName(file.name); // Show filename in the input
        } catch (error) {
            console.error('Upload error:', error);
            alert('Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    const generateSlug = () => {
        const slug = formData.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
        setFormData(prev => ({ ...prev, slug }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const url = initialData
                ? `/api/articles/${initialData.slug}`
                : '/api/articles';

            const method = initialData ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || 'Something went wrong');
            }

            router.push('/admin');
            router.refresh();
        } catch (error) {
            console.error(error);
            alert('Failed to save article');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-1">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            onBlur={!initialData ? generateSlug : undefined}
                            className="w-full px-3 py-2 border dark:text-gray-100 border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 dark:bg-gray-700"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-1">Slug</label>
                        <input
                            type="text"
                            name="slug"
                            value={formData.slug}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-300"
                            required
                            disabled={!!initialData}
                        />
                    </div>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-1">Category</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white dark:bg-gray-700 dark:text-gray-100"
                            required
                        >
                            {categoryOptions.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-1">Cover Image</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                name="coverImage"
                                value={localFileName || formData.coverImage}
                                onChange={handleChange}
                                placeholder="https://... or upload local image"
                                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 dark:bg-gray-700 dark:text-gray-100"
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-100 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium whitespace-nowrap"
                            >
                                {uploading ? 'Uploading...' : 'Browse'}
                            </button>
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            className="hidden"
                        />
                        {formData.coverImage && (
                            <div className="mt-2 relative aspect-video w-full max-w-xs rounded overflow-hidden border border-gray-200 dark:border-gray-600">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={formData.coverImage}
                                    alt="Cover Preview"
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setFormData(prev => ({ ...prev, coverImage: '' }));
                                        setLocalFileName('');
                                    }}
                                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors shadow-md"
                                    title="Remove Image"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-6 pt-2">
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="isTrending"
                                name="isTrending"
                                checked={formData.isTrending}
                                onChange={(e) => setFormData(prev => ({ ...prev, isTrending: e.target.checked }))}
                                className="h-4 w-4 text-gray-900 border-gray-300 dark:border-gray-600 rounded focus:ring-gray-900"
                            />
                            <label htmlFor="isTrending" className="text-sm font-medium text-gray-700 dark:text-gray-100 select-none">
                                Trending
                            </label>
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="isPublished"
                                name="isPublished"
                                checked={formData.isPublished}
                                onChange={(e) => setFormData(prev => ({ ...prev, isPublished: e.target.checked }))}
                                className="h-4 w-4 text-gray-900 border-gray-300 dark:border-gray-600 rounded focus:ring-gray-900"
                            />
                            <label htmlFor="isPublished" className="text-sm font-medium text-gray-700 dark:text-gray-100 select-none">
                                Publish immediately?
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-1">Excerpt (Short description)</label>
                <textarea
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 dark:bg-gray-700 dark:text-gray-100"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-1">Content</label>
                <div className="min-h-[400px]">
                    <Editor value={formData.content} onChange={(html) => setFormData(prev => ({ ...prev, content: html }))} />
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-gray-900 text-white px-6 py-2 rounded hover:bg-gray-800 transition-colors font-medium disabled:opacity-50"
                >
                    {loading ? 'Saving...' : initialData ? 'Update Article' : 'Create Article'}
                </button>
            </div>
        </form>
    );
}
