import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Article from '@/models/Article';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redis } from '@/utils/redisConncection';
export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        await dbConnect();
        const { slug } = await params;
        const cacheKey = `article:${slug}`;
        const cached = await redis.get(cacheKey);
        if (cached) {
            console.log("Returning cached article for slug:", slug);
            return NextResponse.json(cached);
        }
        const article = await Article.findOne({ slug });
        await redis.set(cacheKey, article, {
            ex: 7 * 24 * 60 * 60,
        });
        if (!article) {
            return NextResponse.json({ error: 'Article not found' }, { status: 404 });
        }

        return NextResponse.json(article);
    } catch (error) {
        console.error("Error fetching article:", error);
        return NextResponse.json({ error: 'Failed to fetch article' }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const { slug } = await params;
        const body = await request.json();

        const article = await Article.findOneAndUpdate({ slug }, body, {
            new: true,
            runValidators: true,
        });
        // Clear both article cache and blog showcase cache
        await redis.del(`article:${slug}`);
        await redis.del('blog:showcase');
        if (!article) {
            return NextResponse.json({ error: 'Article not found' }, { status: 404 });
        }

        return NextResponse.json(article);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update article' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const { slug } = await params;
        const article = await Article.findOneAndDelete({ slug });
        // Clear both article cache and blog showcase cache
        await redis.del(`article:${slug}`);
        await redis.del('blog:showcase');
        if (!article) {
            return NextResponse.json({ error: 'Article not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Article deleted' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete article' }, { status: 500 });
    }
}
