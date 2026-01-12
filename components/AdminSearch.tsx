'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { Search } from 'lucide-react';

export default function     AdminSearch() {
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
        // Reset to page 1 when searching
        params.set('page', '1');
        replace(`${pathname}?${params.toString()}`);
    }, 300);

    return (
       <div className="relative">
  <label htmlFor="admin-search" className="sr-only">
    Search articles
  </label>
  <input
    id="admin-search"
                className="peer block w-full rounded-lg border-2
border-gray-300 dark:border-gray-600
bg-white dark:bg-black
py-2.5 pl-10 pr-4 text-sm
text-gray-900 dark:text-gray-200
placeholder:text-gray-400 dark:placeholder:text-gray-500
focus:border-gray-900 dark:focus:border-white
focus:outline-none focus:ring-1
focus:ring-gray-900 dark:focus:ring-white"

    placeholder="Search articles by title, slug, or excerpt..."
    onChange={(e) => handleSearch(e.target.value)}
    defaultValue={searchParams.get('q')?.toString()}
  />
  <Search
  className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2
  pointer-events-none z-10
  text-gray-500 dark:text-gray-400
  peer-focus:text-gray-700 dark:peer-focus:text-gray-300"
/>
</div>

    );
}

