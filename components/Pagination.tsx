import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    buildPageHref: (page: number) => string;
}

/**
 * Generate an array of page numbers and ellipsis markers to display
 * Always shows: first page, last page, and pages around current page
 * Uses '...' as ellipsis marker
 */
function getPageNumbers(currentPage: number, totalPages: number): (number | string)[] {
    const pages: (number | string)[] = [];

    // If 7 or fewer pages, show all
    if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }
        return pages;
    }

    // Always include page 1
    pages.push(1);

    // Calculate the range around current page
    let rangeStart = Math.max(2, currentPage - 1);
    let rangeEnd = Math.min(totalPages - 1, currentPage + 1);

    // Adjust range to always show at least 3 pages in the middle
    if (currentPage <= 3) {
        rangeStart = 2;
        rangeEnd = 4;
    } else if (currentPage >= totalPages - 2) {
        rangeStart = totalPages - 3;
        rangeEnd = totalPages - 1;
    }

    // Add ellipsis before range if needed
    if (rangeStart > 2) {
        pages.push('...');
    }

    // Add the range
    for (let i = rangeStart; i <= rangeEnd; i++) {
        pages.push(i);
    }

    // Add ellipsis after range if needed
    if (rangeEnd < totalPages - 1) {
        pages.push('...');
    }

    // Always include last page
    pages.push(totalPages);

    return pages;
}

export default function Pagination({ currentPage, totalPages, buildPageHref }: PaginationProps) {
    if (totalPages <= 1) return null;

    const pageNumbers = getPageNumbers(currentPage, totalPages);

    const baseButtonStyles = `
    inline-flex items-center justify-center min-w-[40px] h-10 px-3
    text-sm font-medium rounded-lg border
    transition-all duration-200 ease-in-out
  `;

    const activeStyles = `
    bg-sky-500 text-white border-sky-500
    shadow-md shadow-sky-500/25
    dark:bg-sky-600 dark:border-sky-600
  `;

    const inactiveStyles = `
    bg-white text-slate-700 border-slate-200
    hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900
    dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700
    dark:hover:bg-zinc-700 dark:hover:border-zinc-600 dark:hover:text-white
  `;

    const disabledStyles = `
    bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed pointer-events-none
    dark:bg-zinc-900 dark:text-zinc-600 dark:border-zinc-800
  `;

    const ellipsisStyles = `
    inline-flex items-center justify-center min-w-[40px] h-10 px-2
    text-slate-500 dark:text-zinc-500 select-none
  `;

    return (
        <nav aria-label="Pagination" className="flex items-center justify-center gap-1.5 flex-wrap">
            {/* Previous Button */}
            <Link
                href={buildPageHref(Math.max(1, currentPage - 1))}
                className={`${baseButtonStyles} ${currentPage === 1 ? disabledStyles : inactiveStyles} gap-1`}
                aria-disabled={currentPage === 1}
                tabIndex={currentPage === 1 ? -1 : undefined}
            >
                <ChevronLeft size={16} />
                <span className="hidden sm:inline">Previous</span>
            </Link>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
                {pageNumbers.map((page, index) => {
                    if (page === '...') {
                        return (
                            <span key={`ellipsis-${index}`} className={ellipsisStyles}>
                                ···
                            </span>
                        );
                    }

                    const pageNum = page as number;
                    const isActive = pageNum === currentPage;

                    return (
                        <Link
                            key={pageNum}
                            href={buildPageHref(pageNum)}
                            className={`${baseButtonStyles} ${isActive ? activeStyles : inactiveStyles}`}
                            aria-current={isActive ? 'page' : undefined}
                        >
                            {pageNum}
                        </Link>
                    );
                })}
            </div>

            {/* Next Button */}
            <Link
                href={buildPageHref(Math.min(totalPages, currentPage + 1))}
                className={`${baseButtonStyles} ${currentPage === totalPages ? disabledStyles : inactiveStyles} gap-1`}
                aria-disabled={currentPage === totalPages}
                tabIndex={currentPage === totalPages ? -1 : undefined}
            >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight size={16} />
            </Link>
        </nav>
    );
}
