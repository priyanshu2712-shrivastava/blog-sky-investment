import ArticleCard from '@/components/ArticleCard';
import ArticleSearch from '@/components/ArticleSearch';
import Pagination from '@/components/Pagination';
export const revalidate = 60;
const CATEGORIES = [
  'Market Analysis & Trends',
  'IPO & Listing Insights',
  'Sector Deep Dives',
  'Growth Companies',
  'Personal Finance & Wealth Creation',
  'Commodities & Alternative Assets',
  'Geopolitics & Macroeconomics',
  'Financial Literacy & Basics',
];

async function getArticles(query: string = '', category?: string, trending?: boolean, page: number = 1) {
  try {
    const getRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/articles?q=${encodeURIComponent(query)}&${category ? "category=" + encodeURIComponent(category) : ""}&trending=${trending ? 'true' : 'false'}&page=${page}`, {
    })
    const data = await getRes.json();
    return data;
  } catch (error) {
    console.error('Error fetching articles:', error);
    return { items: [], total: 0, totalPages: 1 };
  }
}
export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; trending?: string; page?: string }>;
}) {
  const params = await searchParams;
  const query = params.q || '';
  const category = params.category || 'All';
  const trending = params.trending === 'true';
  const currentPage = Math.max(1, parseInt(params.page || '1', 10));
  const { items: articles, totalPages } = await getArticles(
    query,
    category,
    trending,
    currentPage
  );

  const categoryTabs = ['All', ...CATEGORIES, 'Trending'];

  const buildHref = (cat: string) => {
    const qs = new URLSearchParams();
    if (query) qs.set('q', query);
    if (cat === 'Trending') {
      qs.set('trending', 'true');
    } else {
      if (cat && cat !== 'All') qs.set('category', cat);
    }
    qs.set('page', '1');
    return `/articles${qs.toString() ? `?${qs.toString()}` : ''}`;
  };

  const isActive = (cat: string) => {
    if (cat === 'Trending') return trending;
    if (cat === 'All') return !trending && (category === 'All' || !category);
    return !trending && category === cat;
  };

  const buildPageHref = (page: number) => {
    const qs = new URLSearchParams();
    if (query) qs.set('q', query);
    if (category && category !== 'All') qs.set('category', category);
    if (trending) qs.set('trending', 'true');
    qs.set('page', String(page));
    return `/articles${qs.toString() ? `?${qs.toString()}` : ''}`;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-8">
          <ArticleSearch />
        </div>

        <div className="flex overflow-x-auto scrollbar-hidden gap-2 pb-4 -mx-2 px-2 mb-8 border-b border-gray-100 dark:border-gray-800">
          {categoryTabs.map((cat) => (
            <a
              key={cat}
              href={buildHref(cat)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-full text-sm border transition-colors ${isActive(cat)
                ? 'bg-black text-white border-black shadow-sm dark:bg-gray-900 dark:text-white dark:border-gray-900'
                : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 dark:bg-black dark:text-gray-300 dark:border-gray-800 dark:hover:border-gray-600'
                }`}
            >
              {cat}
            </a>
          ))}
        </div>

        {articles.length > 0 ? (
          articles.map((article: any) => (
            <ArticleCard
              key={article._id}
              title={article.title}
              slug={article.slug}
              excerpt={article.excerpt}
              publishedAt={article.publishedAt}
              category={article.category}
              isTrending={article.isTrending}
            />
          ))
        ) : (
          <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg dark:bg-black dark:text-gray-400">
            <p>No investment insights published yet.</p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-10">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              buildPageHref={buildPageHref}
            />
          </div>
        )}
      </div>
    </div>

  );
}
