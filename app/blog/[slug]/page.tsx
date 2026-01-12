import dbConnect from '@/lib/mongodb';
import Article from '@/models/Article';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { Metadata } from 'next';
import ReadingProgress from '@/components/ReadingProgress';
import ReadTracker from '@/components/ReadTracker';
import parse, { DOMNode, Element } from 'html-react-parser';
import ChartComponent from '@/components/ChartComponent';

interface PageProps {
    params: Promise<{ slug: string }>;
}
async function getArticle(slug: string) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/articles/${slug}`, { cache: 'no-store' });
        const article = await res.json();
        return {
            ...article,
            _id: article._id.toString(),
            publishedAt: article.publishedAt,
        };
    }
    catch (error) {
        console.error("Error in getArticle:", error);
        return null;
    }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const article = await getArticle(slug);

    if (!article) {
        return {
            title: 'Article Not Found',
        };
    }

    return {
        title: `${article.title} | Sky Investment`,
        description: article.excerpt,
    };
}

export default async function BlogPost({ params }: PageProps) {
    const { slug } = await params;
    const article: any = await getArticle(slug);
    if (!article) {
        notFound();
    }

    const parseOptions = {
        replace: (domNode: DOMNode) => {
            if (domNode instanceof Element && domNode.attribs && domNode.attribs['data-type'] === 'chart') {
                try {
                    const data = JSON.parse(domNode.attribs['data-chart-data'] || '[]');
                    const props = {
                        type: domNode.attribs['data-chart-type'] as any,
                        data: data,
                        dataKey: domNode.attribs['data-chart-datakey'],
                        xAxisKey: domNode.attribs['data-chart-xaxiskey'],
                        title: domNode.attribs['data-chart-title'],
                    };
                    return <ChartComponent {...props} />;
                } catch (e) {
                    console.error('Failed to parse chart data', e);
                    return null;
                }
            }
        }
    };

    return (
        <>
            <ReadingProgress slug={slug} />
            <ReadTracker slug={slug} />
            <article className="max-w-3xl mx-auto px-6 py-20">
                <header className="mb-14 text-center">
                    <div className="text-gray-500 dark:text-gray-100 text-sm font-medium mb-4">
                        {format(new Date(article.publishedAt), 'MMMM d, yyyy')} • By {article.author}
                    </div>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold  dark:text-gray-100 text-gray-900 leading-tight mb-8">
                        {article.title}
                    </h1>
                    <p className="text-xl text-gray-600  dark:text-gray-100 font-serif italic max-w-2xl mx-auto leading-relaxed">
                        {article.excerpt}
                    </p>
                </header>

                {article.coverImage && (
                    <div className="mb-14 -mx-6 md:mx-0 rounded-lg overflow-hidden shadow-sm">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={article.coverImage}
                            alt={article.title}
                            className="w-full h-auto object-cover max-h-[500px]"
                        />
                    </div>
                )}

                <div className="prose prose-lg prose-slate prose-headings:font-serif prose-headings:font-bold max-w-none  dark:text-gray-100 text-gray-800">
                    {parse(article.content, parseOptions)}
                </div>
            </article>
        </>
    );
}
