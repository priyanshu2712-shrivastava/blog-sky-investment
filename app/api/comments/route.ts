import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Comment from '@/models/Comment';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET /api/comments?slug={articleSlug} - Fetch all comments for an article
export async function GET(request: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const slug = searchParams.get('slug');

        if (!slug) {
            return NextResponse.json({ error: 'Article slug is required' }, { status: 400 });
        }

        const comments = await Comment.find({ articleSlug: slug })
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
    }
}

// POST /api/comments - Create a new comment
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'You must be signed in to comment' }, { status: 401 });
        }

        await dbConnect();
        const body = await request.json();
        const { articleSlug, content } = body;

        if (!articleSlug || !content) {
            return NextResponse.json({ error: 'Article slug and content are required' }, { status: 400 });
        }

        if (content.length > 2000) {
            return NextResponse.json({ error: 'Comment is too long (max 2000 characters)' }, { status: 400 });
        }

        const comment = await Comment.create({
            articleSlug,
            userEmail: session.user.email ?? '',
            userName: session.user.name || 'Anonymous',
            userImage: session.user.image ?? undefined,
            content: content.trim(),
        });

        return NextResponse.json(comment, { status: 201 });
    } catch (error) {
        console.error('Error creating comment:', error);
        return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
    }
}
