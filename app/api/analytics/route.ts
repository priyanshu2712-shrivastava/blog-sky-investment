import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Article from '@/models/Article';

export async function POST(request: Request) {
    try {
        await dbConnect();
        const { slug, type } = await request.json();

        if (!slug || !type) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const updateField = type === 'view' ? 'views' : 'reads';

        // Use $inc for atomic increment
        const article = await Article.findOneAndUpdate(
            { slug },
            { $inc: { [updateField]: 1 } },
            { new: true }
        );

        if (!article) {
            return NextResponse.json({ error: 'Article not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, [updateField]: article[updateField] });
    } catch (error) {
        console.error('Analytics error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
