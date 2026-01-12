import ArticleForm from '@/components/ArticleForm';

export default function NewArticlePage() {
    return (
        <div>
            <h1 className="text-2xl font-serif font-bold text-gray-900  dark:text-white mb-8 border-b pb-4">Create New Article</h1>
            <ArticleForm />
        </div>
    );
}
