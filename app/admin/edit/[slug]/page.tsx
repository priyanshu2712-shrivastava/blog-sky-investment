import ArticleForm from '@/components/ArticleForm';
import dbConnect from '@/lib/mongodb';
import Article from '@/models/Article';
import { notFound } from 'next/navigation';

interface EditProps {
    params: Promise<{ slug: string }>;
}

async function getArticle(slug: string) {
    await dbConnect();
    const article = await Article.findOne({ slug }).lean();
    if (!article) return null;

    return {
        ...article,
        _id: article._id.toString(),
        publishedAt: article.publishedAt.toISOString(),
    };
}

export default async function EditArticlePage({ params }: EditProps) {
    const { slug } = await params;
    const article = await getArticle(slug);

    if (!article) {
        notFound();
    }

    return (
        <div>
            <h1 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-8 border-b pb-4">Edit Article</h1>
            <ArticleForm initialData={article} />
        </div>
    );
}
