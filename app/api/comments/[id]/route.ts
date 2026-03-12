import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Comment from '@/models/Comment';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// PUT /api/comments/[id] - Edit a comment (owner only)
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const { id } = await params;
        const body = await request.json();
        const { content } = body;

        if (!content) {
            return NextResponse.json({ error: 'Content is required' }, { status: 400 });
        }

        if (content.length > 2000) {
            return NextResponse.json({ error: 'Comment is too long (max 2000 characters)' }, { status: 400 });
        }

        // Find the comment first
        const comment = await Comment.findById(id);
        if (!comment) {
            return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
        }

        // Check if the user is the owner of the comment
        if (comment.userEmail !== session.user.email) {
            return NextResponse.json({ error: 'You can only edit your own comments' }, { status: 403 });
        }

        // Update the comment
        comment.content = content.trim();
        await comment.save();

        return NextResponse.json(comment);
    } catch (error) {
        console.error('Error updating comment:', error);
        return NextResponse.json({ error: 'Failed to update comment' }, { status: 500 });
    }
}

// DELETE /api/comments/[id] - Delete a comment (owner or admin)
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const { id } = await params;

        // Find the comment first
        const comment = await Comment.findById(id);
        if (!comment) {
            return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
        }

        // Check if the user is the owner or an admin
        const isOwner = comment.userEmail === session.user.email;
        const isAdmin = (session.user as { role?: string }).role === 'admin';

        if (!isOwner && !isAdmin) {
            return NextResponse.json({ error: 'You can only delete your own comments' }, { status: 403 });
        }

        // Delete the comment and all its replies
        await Comment.deleteMany({ $or: [{ _id: id }, { parentId: id }] });

        return NextResponse.json({ message: 'Comment deleted successfully' });
    } catch (error) {
        console.error('Error deleting comment:', error);
        return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 });
    }
}

