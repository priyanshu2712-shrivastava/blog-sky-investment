'use client';

import { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { Edit2, Trash2, X, Check, MessageCircle, Send, ChevronDown, ChevronUp } from 'lucide-react';

interface Reply {
    _id: string;
    userName: string;
    userImage?: string;
    userEmail: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    parentId: string;
}

interface CommentItemProps {
    comment: {
        _id: string;
        userName: string;
        userImage?: string;
        userEmail: string;
        content: string;
        createdAt: string;
        updatedAt: string;
    };
    currentUserEmail?: string;
    isLoggedIn?: boolean;
    isAdmin?: boolean;
    articleSlug: string;
    onEdit: (id: string, content: string) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
    onReply: (parentId: string, content: string) => Promise<void>;
}

export default function CommentItem({
    comment,
    currentUserEmail,
    isLoggedIn,
    isAdmin,
    articleSlug,
    onEdit,
    onDelete,
    onReply
}: CommentItemProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(comment.content);
    const [isLoading, setIsLoading] = useState(false);

    // Reply states
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    const [isSubmittingReply, setIsSubmittingReply] = useState(false);
    const [replies, setReplies] = useState<Reply[]>([]);
    const [showReplies, setShowReplies] = useState(false);
    const [isLoadingReplies, setIsLoadingReplies] = useState(false);
    const [replyCount, setReplyCount] = useState(0);

    // Reply edit states
    const [editingReplyId, setEditingReplyId] = useState<string | null>(null);
    const [editingReplyContent, setEditingReplyContent] = useState('');

    const isOwner = currentUserEmail && comment.userEmail === currentUserEmail;
    const isEdited = comment.createdAt !== comment.updatedAt;

    // Fetch replies when toggled
    const fetchReplies = useCallback(async () => {
        if (replies.length > 0) return; // Already fetched

        setIsLoadingReplies(true);
        try {
            const res = await fetch(`/api/comments/${comment._id}/replies`);
            if (res.ok) {
                const data = await res.json();
                setReplies(data);
                setReplyCount(data.length);
            }
        } catch (error) {
            console.error('Error fetching replies:', error);
        } finally {
            setIsLoadingReplies(false);
        }
    }, [comment._id, replies.length]);

    // Check reply count on mount
    useEffect(() => {
        const checkReplyCount = async () => {
            try {
                const res = await fetch(`/api/comments/${comment._id}/replies`);
                if (res.ok) {
                    const data = await res.json();
                    setReplyCount(data.length);
                }
            } catch (error) {
                console.error('Error checking reply count:', error);
            }
        };
        checkReplyCount();
    }, [comment._id]);

    const handleToggleReplies = async () => {
        if (!showReplies) {
            await fetchReplies();
        }
        setShowReplies(!showReplies);
    };

    const handleEdit = async () => {
        if (!editContent.trim() || editContent === comment.content) {
            setIsEditing(false);
            setEditContent(comment.content);
            return;
        }

        setIsLoading(true);
        try {
            await onEdit(comment._id, editContent);
            setIsEditing(false);
        } catch (error) {
            console.error('Failed to edit comment:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this comment?')) return;

        setIsLoading(true);
        try {
            await onDelete(comment._id);
        } catch (error) {
            console.error('Failed to delete comment:', error);
            setIsLoading(false);
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditContent(comment.content);
    };

    const handleSubmitReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyContent.trim()) return;

        setIsSubmittingReply(true);
        try {
            await onReply(comment._id, replyContent.trim());
            setReplyContent('');
            setShowReplyForm(false);
            // Refresh replies
            const res = await fetch(`/api/comments/${comment._id}/replies`);
            if (res.ok) {
                const data = await res.json();
                setReplies(data);
                setReplyCount(data.length);
                setShowReplies(true);
            }
        } catch (error) {
            console.error('Failed to post reply:', error);
        } finally {
            setIsSubmittingReply(false);
        }
    };

    const handleDeleteReply = async (replyId: string) => {
        if (!confirm('Are you sure you want to delete this reply?')) return;

        try {
            const res = await fetch(`/api/comments/${replyId}`, { method: 'DELETE' });
            if (res.ok) {
                setReplies(prev => prev.filter(r => r._id !== replyId));
                setReplyCount(prev => prev - 1);
            }
        } catch (error) {
            console.error('Failed to delete reply:', error);
        }
    };

    const handleEditReply = async (replyId: string) => {
        if (!editingReplyContent.trim()) return;

        try {
            const res = await fetch(`/api/comments/${replyId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: editingReplyContent.trim() }),
            });
            if (res.ok) {
                const updatedReply = await res.json();
                setReplies(prev => prev.map(r => r._id === replyId ? updatedReply : r));
                setEditingReplyId(null);
                setEditingReplyContent('');
            }
        } catch (error) {
            console.error('Failed to edit reply:', error);
        }
    };

    const startEditingReply = (reply: Reply) => {
        setEditingReplyId(reply._id);
        setEditingReplyContent(reply.content);
    };

    const cancelEditingReply = () => {
        setEditingReplyId(null);
        setEditingReplyContent('');
    };

    return (
        <div className="py-4 border-b border-gray-100 dark:border-gray-800 last:border-b-0">
            <div className="flex gap-3">
                {/* Avatar */}
                <div className="flex-shrink-0">
                    {comment.userImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={comment.userImage}
                            alt={comment.userName}
                            className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                            <span className="text-white text-sm font-medium">
                                {comment.userName.charAt(0).toUpperCase()}
                            </span>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-grow min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                            {comment.userName}
                        </span>
                        <span className="text-gray-400 dark:text-gray-500 text-xs">
                            {format(new Date(comment.createdAt), 'MMM d, yyyy • h:mm a')}
                        </span>
                        {isEdited && (
                            <span className="text-gray-400 dark:text-gray-500 text-xs italic">
                                (edited)
                            </span>
                        )}
                    </div>

                    {isEditing ? (
                        <div className="mt-2">
                            <textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg 
                                         bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                         resize-none"
                                rows={3}
                                maxLength={2000}
                                disabled={isLoading}
                            />
                            <div className="flex items-center gap-2 mt-2">
                                <button
                                    onClick={handleEdit}
                                    disabled={isLoading || !editContent.trim()}
                                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white 
                                             bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors
                                             disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Check size={14} />
                                    Save
                                </button>
                                <button
                                    onClick={handleCancelEdit}
                                    disabled={isLoading}
                                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium 
                                             text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 
                                             rounded-lg transition-colors"
                                >
                                    <X size={14} />
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p className="mt-1 text-gray-700 dark:text-gray-300 text-sm whitespace-pre-wrap break-words">
                            {comment.content}
                        </p>
                    )}

                    {/* Actions */}
                    {!isEditing && (
                        <div className="flex items-center gap-3 mt-2">
                            {/* Reply button - visible to all logged in users */}
                            {isLoggedIn && (
                                <button
                                    onClick={() => setShowReplyForm(!showReplyForm)}
                                    className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600 
                                             dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                                >
                                    <MessageCircle size={14} />
                                    Reply
                                </button>
                            )}

                            {/* Show replies toggle */}
                            {replyCount > 0 && (
                                <button
                                    onClick={handleToggleReplies}
                                    className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 
                                             dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                                >
                                    {showReplies ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                    {replyCount} {replyCount === 1 ? 'reply' : 'replies'}
                                </button>
                            )}

                            {/* Owner actions - Edit */}
                            {isOwner && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    disabled={isLoading}
                                    className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600 
                                             dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                                >
                                    <Edit2 size={14} />
                                    Edit
                                </button>
                            )}

                            {/* Delete - visible to owner OR admin */}
                            {(isOwner || isAdmin) && (
                                <button
                                    onClick={handleDelete}
                                    disabled={isLoading}
                                    className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-600 
                                             dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                                >
                                    <Trash2 size={14} />
                                    Delete
                                </button>
                            )}
                        </div>
                    )}

                    {/* Reply Form */}
                    {showReplyForm && (
                        <form onSubmit={handleSubmitReply} className="mt-3 pl-2 border-l-2 border-gray-200 dark:border-gray-700">
                            <textarea
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                placeholder="Write a reply..."
                                className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg 
                                         bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
                                         placeholder-gray-400 dark:placeholder-gray-500
                                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                         resize-none"
                                rows={2}
                                maxLength={2000}
                                disabled={isSubmittingReply}
                            />
                            <div className="flex items-center gap-2 mt-2">
                                <button
                                    type="submit"
                                    disabled={isSubmittingReply || !replyContent.trim()}
                                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white 
                                             bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200
                                             rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Send size={12} />
                                    {isSubmittingReply ? 'Posting...' : 'Reply'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowReplyForm(false);
                                        setReplyContent('');
                                    }}
                                    className="px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 
                                             hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Replies List */}
                    {showReplies && (
                        <div className="mt-3 pl-4 border-l-2 border-gray-200 dark:border-gray-700 space-y-3">
                            {isLoadingReplies ? (
                                <div className="animate-pulse flex gap-2 py-2">
                                    <div className="w-8 h-8 bg-gray-200 dark:bg-gray-800 rounded-full" />
                                    <div className="flex-grow space-y-2">
                                        <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/4" />
                                        <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
                                    </div>
                                </div>
                            ) : (
                                replies.map((reply) => {
                                    const isReplyOwner = currentUserEmail && reply.userEmail === currentUserEmail;
                                    const isEditingThisReply = editingReplyId === reply._id;

                                    return (
                                        <div key={reply._id} className="flex gap-2 py-2">
                                            <div className="flex-shrink-0">
                                                {reply.userImage ? (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img
                                                        src={reply.userImage}
                                                        alt={reply.userName}
                                                        className="w-8 h-8 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                                                    />
                                                ) : (
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                                        <span className="text-white text-xs font-medium">
                                                            {reply.userName.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-grow min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="font-medium text-gray-900 dark:text-gray-100 text-xs">
                                                        {reply.userName}
                                                    </span>
                                                    <span className="text-gray-400 dark:text-gray-500 text-xs">
                                                        {format(new Date(reply.createdAt), 'MMM d, yyyy • h:mm a')}
                                                    </span>
                                                    {reply.createdAt !== reply.updatedAt && (
                                                        <span className="text-gray-400 dark:text-gray-500 text-xs italic">
                                                            (edited)
                                                        </span>
                                                    )}
                                                </div>

                                                {isEditingThisReply ? (
                                                    <div className="mt-2">
                                                        <textarea
                                                            value={editingReplyContent}
                                                            onChange={(e) => setEditingReplyContent(e.target.value)}
                                                            className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg 
                                                                     bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                                                                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                                                     resize-none"
                                                            rows={2}
                                                            maxLength={2000}
                                                        />
                                                        <div className="flex items-center gap-2 mt-2">
                                                            <button
                                                                onClick={() => handleEditReply(reply._id)}
                                                                disabled={!editingReplyContent.trim()}
                                                                className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-white 
                                                                         bg-blue-600 hover:bg-blue-700 rounded transition-colors
                                                                         disabled:opacity-50 disabled:cursor-not-allowed"
                                                            >
                                                                <Check size={12} />
                                                                Save
                                                            </button>
                                                            <button
                                                                onClick={cancelEditingReply}
                                                                className="flex items-center gap-1 px-2 py-1 text-xs font-medium 
                                                                         text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 
                                                                         rounded transition-colors"
                                                            >
                                                                <X size={12} />
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <p className="mt-1 text-gray-700 dark:text-gray-300 text-sm whitespace-pre-wrap break-words">
                                                        {reply.content}
                                                    </p>
                                                )}

                                                {/* Actions for reply - Edit and Delete */}
                                                {!isEditingThisReply && (
                                                    <div className="flex items-center gap-2 mt-1">
                                                        {isReplyOwner && (
                                                            <button
                                                                onClick={() => startEditingReply(reply)}
                                                                className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600 
                                                                         dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                                                            >
                                                                <Edit2 size={12} />
                                                                Edit
                                                            </button>
                                                        )}
                                                        {(isReplyOwner || isAdmin) && (
                                                            <button
                                                                onClick={() => handleDeleteReply(reply._id)}
                                                                className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-600 
                                                                         dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                                                            >
                                                                <Trash2 size={12} />
                                                                Delete
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

