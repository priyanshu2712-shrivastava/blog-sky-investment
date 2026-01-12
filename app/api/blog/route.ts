import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Article from '@/models/Article';
import { redis } from '@/utils/redisConncection';
export async function GET(request: Request) {
    try {
        await dbConnect();
        const query: any = {};
        query.isPublished = true;
        const cacheKey= `blog:showcase`;
        const cached = await redis.get(cacheKey);
            if(cached){
               console.log("Returning cached blog articles");
               return NextResponse.json(cached);
            }
        const articles = await Article.find(query)
            .sort({ publishedAt: -1 })
            .select('title slug excerpt coverImage publishedAt category isTrending ')
            .limit(3)
            .lean();
        await redis.set(cacheKey,articles, {
            ex: 24*60*60,
        });
        return NextResponse.json(articles);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch blog articles' }, { status: 500 });
    }
}