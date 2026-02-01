'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Edit2, Trash2, X, Check } from 'lucide-react';

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
    onEdit: (id: string, content: string) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
}

export default function CommentItem({ comment, currentUserEmail, onEdit, onDelete }: CommentItemProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(comment.content);
    const [isLoading, setIsLoading] = useState(false);

    const isOwner = currentUserEmail && comment.userEmail === currentUserEmail;
    const isEdited = comment.createdAt !== comment.updatedAt;

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

    return (
        <div className="flex gap-3 py-4 border-b border-gray-100 dark:border-gray-800 last:border-b-0">
            {/* Avatar */}
            <div className="flex-shrink-0">
                {comment.userImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={comment.userImage}
                        alt={comment.userName}
                        className="w-10 h-10 rounded-full"
                    />
                ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <span className="text-gray-600 dark:text-gray-300 text-sm font-medium">
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

                {/* Actions for owner */}
                {isOwner && !isEditing && (
                    <div className="flex items-center gap-3 mt-2">
                        <button
                            onClick={() => setIsEditing(true)}
                            disabled={isLoading}
                            className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600 
                                     dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                        >
                            <Edit2 size={14} />
                            Edit
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={isLoading}
                            className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-600 
                                     dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                        >
                            <Trash2 size={14} />
                            Delete
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
