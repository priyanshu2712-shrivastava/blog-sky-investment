import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Article from '@/models/Article';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { daysInWeek } from 'date-fns/constants';
import { redis } from '@/utils/redisConncection';
// import { redis} from '@/utils/redisConncection';
export async function GET(request: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const isAdmin = searchParams.get('admin') === 'true';
        const title = searchParams.get('q') || '';
        const category = searchParams.get('category')
        const trending = searchParams.get('trending') === 'true';
        const PAGE_SIZE = 10;
        const page = parseInt(searchParams.get('page') || '1', 10);
        const query: any = {};
        if (!isAdmin) {
            query.isPublished = true
        }
        if (title) query.title = { $regex: title, $options: 'i' };
        if (category && category !== 'All') query.category = category;
        if (trending) query.isTrending = trending;
        const total = await Article.countDocuments(query);

        const articles = await Article.find(query)
            .sort({ publishedAt: -1 })
            .select('title slug excerpt publishedAt category isTrending isPublished reads')
            .skip((page - 1) * PAGE_SIZE)
            .limit(PAGE_SIZE)
            .lean();
        return NextResponse.json({
            items: articles.map(article => ({
                ...article,
                _id: article._id.toString(),
                publishedAt: article.publishedAt.toISOString(),
            })),
            total,
            totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
        });

    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const body = await request.json();

        // Basic validation
        if (!body.title || !body.content || !body.slug) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }
        const article = await Article.create({
            ...body,
            author: "Akash Singh",
        });
        // Clear blog showcase cache so new articles appear on home page
        await redis.del('blog:showcase');
        return NextResponse.json(article, { status: 201 });
    } catch (error: any) {
        // Handle duplicate key error for slug
        if (error.code === 11000) {
            return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
        }
        return NextResponse.json({ error: 'Failed to create article' }, { status: 500 });
    }
}
