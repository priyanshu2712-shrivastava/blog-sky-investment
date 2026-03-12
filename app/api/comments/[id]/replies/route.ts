import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Comment from '@/models/Comment';

// GET /api/comments/[id]/replies - Fetch all replies for a specific comment
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;

        const replies = await Comment.find({ parentId: id })
            .sort({ createdAt: 1 }) // Oldest first for chronological order
            .lean();

        return NextResponse.json(replies);
    } catch (error) {
        console.error('Error fetching replies:', error);
        return NextResponse.json({ error: 'Failed to fetch replies' }, { status: 500 });
    }
}
