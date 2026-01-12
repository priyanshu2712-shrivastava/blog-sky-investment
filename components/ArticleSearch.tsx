'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { Search } from 'lucide-react';

export default function ArticleSearch() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set('q', term);
        } else {
            params.delete('q');
        }
        replace(`${pathname}?${params.toString()}`);
    }, 300);

    return (
        <div className="relative max-w-md mx-auto mb-12">
  <label htmlFor="search" className="sr-only">
    Search
  </label>
  <input
    id="search"
    className="peer block w-full rounded-md py-[9px] pl-10 text-sm border-2 border-neutral-400 placeholder:text-gray-500
               bg-white text-gray-900
               dark:bg-black dark:border-gray-700 dark:placeholder:text-gray-400 dark:text-gray-200
               focus:border-black dark:focus:border-white focus:outline-none transition-colors"
    placeholder="Search articles..."
    onChange={(e) => handleSearch(e.target.value)}
    defaultValue={searchParams.get('q')?.toString()}
  />
  <Search className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900 dark:text-gray-400 dark:peer-focus:text-white transition-colors" />
</div>

    );
}
