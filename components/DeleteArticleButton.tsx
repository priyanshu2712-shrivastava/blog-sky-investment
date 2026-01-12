'use client';

import { Trash2 } from 'lucide-react';
import { useTransition } from 'react';
import { deleteArticleAction } from '@/app/admin/actions';

export default function DeleteArticleButton({ slug }: { slug: string }) {
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this article? This action cannot be undone.')) {
            startTransition(async () => {
                try {
                    await deleteArticleAction(slug);
                } catch (error) {
                    alert('Failed to delete article');
                    console.error(error);
                }
            });
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isPending}
            className={`text-red-500 hover:text-red-700 transition-colors ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
            title="Delete Article"
        >
            <Trash2 size={18} />
        </button>
    );
}
