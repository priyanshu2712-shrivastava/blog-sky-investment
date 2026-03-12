'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { MessageCircle, Send } from 'lucide-react';
import CommentItem from './CommentItem';

interface Comment {
    _id: string;
    articleSlug: string;
    userName: string;
    userImage?: string;
    userEmail: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    parentId?: string | null;
}

interface CommentSectionProps {
    slug: string;
}

export default function CommentSection({ slug }: CommentSectionProps) {
    const { data: session, status } = useSession();
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchComments = useCallback(async () => {
        try {
            const res = await fetch(`/api/comments?slug=${encodeURIComponent(slug)}`);
            if (!res.ok) throw new Error('Failed to fetch comments');
            const data = await res.json();
            setComments(data);
        } catch (err) {
            console.error('Error fetching comments:', err);
            setError('Failed to load comments');
        } finally {
            setIsLoading(false);
        }
    }, [slug]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || !session?.user) return;

        setIsSubmitting(true);
        setError(null);

        try {
            const res = await fetch('/api/comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    articleSlug: slug,
                    content: newComment.trim(),
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to post comment');
            }

            const comment = await res.json();
            setComments((prev) => [comment, ...prev]);
            setNewComment('');
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to post comment';
            setError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditComment = async (id: string, content: string) => {
        const res = await fetch(`/api/comments/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content }),
        });

        if (!res.ok) {
            const data = await res.json();
            throw new Error(data.error || 'Failed to edit comment');
        }

        const updatedComment = await res.json();
        setComments((prev) =>
            prev.map((c) => (c._id === id ? updatedComment : c))
        );
    };

    const handleDeleteComment = async (id: string) => {
        const res = await fetch(`/api/comments/${id}`, {
            method: 'DELETE',
        });

        if (!res.ok) {
            const data = await res.json();
            throw new Error(data.error || 'Failed to delete comment');
        }

        setComments((prev) => prev.filter((c) => c._id !== id));
    };

    const handleReply = async (parentId: string, content: string) => {
        const res = await fetch('/api/comments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                articleSlug: slug,
                content,
                parentId,
            }),
        });

        if (!res.ok) {
            const data = await res.json();
            throw new Error(data.error || 'Failed to post reply');
        }
    };

    return (
        <section className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800">
            <h2 className="flex items-center gap-2 text-xl font-serif font-bold text-gray-900 dark:text-gray-100 mb-6">
                <MessageCircle size={24} />
                Comments ({comments.length})
            </h2>

            {/* Comment Form or Sign In Prompt */}
            {status === 'loading' ? (
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 mb-6">
                    <div className="animate-pulse h-20 bg-gray-200 dark:bg-gray-800 rounded" />
                </div>
            ) : session?.user ? (
                <form onSubmit={handleSubmit} className="mb-8">
                    <div className="flex gap-3">
                        {session.user.image && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={session.user.image}
                                alt={session.user.name || 'You'}
                                className="w-10 h-10 rounded-full flex-shrink-0"
                            />
                        )}
                        <div className="flex-grow">
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Share your thoughts..."
                                className="w-full px-4 py-3 text-sm border border-gray-200 dark:border-gray-700 rounded-lg 
                                         bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
                                         placeholder-gray-400 dark:placeholder-gray-500
                                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                         resize-none transition-colors"
                                rows={3}
                                maxLength={2000}
                                disabled={isSubmitting}
                            />
                            <div className="flex items-center justify-between mt-2">
                                <span className="text-xs text-gray-400">
                                    {newComment.length}/2000 characters
                                </span>
                                <button
                                    type="submit"
                                    disabled={isSubmitting || !newComment.trim()}
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white 
                                             bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200
                                             rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Send size={16} />
                                    {isSubmitting ? 'Posting...' : 'Post Comment'}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            ) : (
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 mb-8">
                    <button
                        onClick={() => signIn('google')}
                        className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
                    >
                        Login to comment
                    </button>
                </div>
            )}

            {/* Error message */}
            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm p-3 rounded-lg mb-4">
                    {error}
                </div>
            )}

            {/* Comments List */}
            {isLoading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="animate-pulse flex gap-3 py-4">
                            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-full" />
                            <div className="flex-grow space-y-2">
                                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4" />
                                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : comments.length > 0 ? (
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                    {comments.map((comment) => (
                        <CommentItem
                            key={comment._id}
                            comment={comment}
                            currentUserEmail={session?.user?.email || undefined}
                            isLoggedIn={!!session?.user}
                            isAdmin={(session?.user as { role?: string })?.role === 'admin'}
                            articleSlug={slug}
                            onEdit={handleEditComment}
                            onDelete={handleDeleteComment}
                            onReply={handleReply}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <MessageCircle size={40} className="mx-auto mb-3 opacity-50" />
                    <p>No comments yet. Be the first to share your thoughts!</p>
                </div>
            )}
        </section>
    );
}

