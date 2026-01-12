import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Article from '@/models/Article';
import dbConnect from '@/lib/mongodb';
import { format } from 'date-fns';
import { Edit2, Trash2, Plus } from 'lucide-react';

import DeleteArticleButton from '@/components/DeleteArticleButton';
import AdminSearch from '@/components/AdminSearch';
import Pagination from '@/components/Pagination';
const PAGE_SIZE = 10;

async function getArticles(query: string = '', page: number = 1) {
  try {
    // const isAdmin = true; // Since this is admin dashboard
    const getRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/articles?admin=true&q=${encodeURIComponent(query)}&page=${page}`, {
    })
    const data = await getRes.json();
    return data;
  } catch (error) {
    console.error('Error fetching articles:', error);
    return { items: [], total: 0, totalPages: 1 };
  }
}

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  await dbConnect();
  const params = await searchParams;
  const query = params.q || '';
  const currentPage = Math.max(1, parseInt(params.page || '1', 10));

  const { items: articles, total, totalPages } = await getArticles(query, currentPage);

  // Get all articles for stats (not paginated)
  const allArticles = await Article.find({}).lean();
  const totalArticles = allArticles.length;
  const publishedCount = allArticles.filter((a: any) => a.isPublished).length;
  const draftCount = totalArticles - publishedCount;
  const trendingCount = allArticles.filter((a: any) => a.isTrending).length;
  function util() {
    articles.map((article: any) => console.log(article.isPublished))
  }
  const buildPageHref = (page: number) => {
    const qs = new URLSearchParams();
    if (query) qs.set('q', query);
    qs.set('page', String(page));
    return `/admin${qs.toString() ? `?${qs.toString()}` : ''}`;
  };
  util();
  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        {/* Action Buttons */}
        <div className="flex justify-end gap-3 flex-wrap mb-8">
          {/* <Link
          href="/admin/import"
          className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          Import PDF
      </Link> */}
          <Link
            href="/admin/new"
            className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm font-semibold shadow-sm"
          >
            <Plus size={16} />
            New Article
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Articles', value: totalArticles, tone: 'text-slate-900 dark:text-gray-200', bg: 'bg-slate-50 dark:bg-neutral-900' },
            { label: 'Published', value: publishedCount, tone: 'text-emerald-800 dark:text-emerald-400', bg: 'bg-emerald-50  dark:bg-gradient-to-br dark:from-emerald-200 dark:to-transparent' },
            { label: 'Drafts', value: draftCount, tone: 'text-amber-800 dark:text-amber-400', bg: 'bg-amber-50  dark:bg-gradient-to-br dark:from-amber-100 dark:to-transparent' },
            { label: 'Trending', value: trendingCount, tone: 'text-indigo-800 dark:text-indigo-400', bg: 'bg-indigo-50  dark:bg-gradient-to-br dark:from-indigo-200 dark:to-transparent' },
          ].map((item) => (
            <div
              key={item.label}
              className={`rounded-xl border border-gray-200 dark:border-gray-700 ${item.bg} p-4 shadow-sm`}
            >
              <p className="text-sm text-gray-500 dark:text-gray-400">{item.label}</p>
              <p className={`text-2xl font-semibold mt-1 ${item.tone}`}>{item.value}</p>
            </div>
          ))}
        </div>

        {/* Search Bar */}
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 mb-8">
          <AdminSearch />
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-neutral-900 hidden md:block rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Articles</h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {query ? `${total} found` : `${totalArticles} total`}
              {query && ` (${totalArticles} total)`}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left bg-white dark:bg-neutral-900">
              <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs uppercase font-medium">
                <tr>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Trending</th>
                  <th className="px-6 py-4">Reads</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700 border-t border-gray-100 dark:border-gray-700">
                {articles.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                      {query ? 'No articles found matching your search.' : 'No articles found.'}
                    </td>
                  </tr>
                ) : (
                  articles.map((article: any) => (
                    <tr key={article._id.toString()} className="hover:bg-gray-50/60 dark:hover:bg-white/10 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-200">
                        {article.title}
                        <div className="text-xs text-gray-400 dark:text-gray-500 font-normal mt-0.5 truncate max-w-xs">{article.slug}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${article.isPublished ? 'bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-400' : 'bg-amber-50 text-amber-700 dark:bg-amber-900 dark:text-amber-400'}`}>
                          {article.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {article.isTrending ? (
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-indigo-50 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-400">
                            Trending
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400 dark:text-gray-500">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-400 text-sm">
                        {article.reads || 0}
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-400 text-sm">
                        {format(new Date(article.publishedAt), 'MMM d, yyyy')}
                      </td>
                      <td className="px-6 py-4 text-right flex items-center justify-end gap-3">
                        <Link href={`/admin/edit/${article.slug}`} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-600">
                          <Edit2 size={18} />
                        </Link>
                        <DeleteArticleButton slug={article.slug} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing {(currentPage - 1) * PAGE_SIZE + 1} to {Math.min(currentPage * PAGE_SIZE, total)} of {total} articles
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                buildPageHref={buildPageHref}
              />
            </div>
          )}
        </div>

        {/* Mobile list */}
        <div className="md:hidden space-y-4 w-full h-fit">
          {/* Mobile header with count */}
          <div className="flex items-center justify-between px-2">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Articles</h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {query ? `${total} found` : `${totalArticles} total`}
            </span>
          </div>

          {articles.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
              No articles found.
            </div>
          ) : (
            articles.map((article: any) => (
              <div
                key={article._id.toString()}
                className="bg-white dark:bg-neutral-900 rounded-lg border border-gray-100 dark:border-gray-700 p-4 shadow-sm"
              >
                <div className="font-semibold text-gray-900 dark:text-gray-200">
                  {article.title}
                </div>

                <div className="text-xs text-gray-400 dark:text-gray-500 truncate mt-1">
                  {article.slug}
                </div>

                <div className="flex items-center justify-between mt-3 text-sm">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${article.isPublished
                    ? 'bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-400'
                    : 'bg-yellow-50 text-yellow-700 dark:bg-amber-900 dark:text-amber-400'
                    }`}>
                    {article.isPublished ? 'Published' : 'Draft'}
                  </span>

                  <span className="text-gray-500 dark:text-gray-400">
                    {format(new Date(article.publishedAt), 'MMM d, yyyy')}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Reads: {article.reads || 0}
                  </span>

                  <div className="flex items-center gap-4">
                    <Link
                      href={`/admin/edit/${article.slug}`}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-600"
                    >
                      <Edit2 size={18} />
                    </Link>
                    <DeleteArticleButton slug={article.slug} />
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Mobile Pagination */}
          {totalPages > 1 && (
            <div className="pt-4 pb-2 flex flex-col gap-3">
              <div className="text-sm text-gray-600 dark:text-gray-400 text-center">
                Showing {(currentPage - 1) * PAGE_SIZE + 1} to {Math.min(currentPage * PAGE_SIZE, total)} of {total} articles
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                buildPageHref={buildPageHref}
              />
            </div>
          )}
        </div>
      </div>
    </div>

  );
}
