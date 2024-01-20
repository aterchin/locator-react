import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';

// https://tailwindui.com/components/application-ui/navigation/pagination
export default function PaginationLinks({ meta, onPageClick }) {
    function onClick(e, link) {
        e.preventDefault();
        if (!link.url) {
            return;
        }
        onPageClick(link);
    }

    const renderPrev = (
        <>
            <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            <span className="sr-only">Prev</span>
        </>
    );

    const renderNext = (
        <>
            <span className="sr-only">Next</span>
            <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
        </>
    );

    return (
        <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6 mt-4">
            <div className="flex flex-1 justify-between sm:hidden">
                <a
                    href="#"
                    onClick={(e) => onClick(e, meta.links[0])}
                    className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                    Prev
                </a>
                <a
                    href="#"
                    onClick={(e) => onClick(e, meta.links[meta.links.length - 1])}
                    className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                    Next
                </a>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{meta.from}</span> to{' '}
                        <span className="font-medium">{meta.to}</span> of &nbsp;
                        <span className="font-medium">{meta.total}</span> results
                    </p>
                </div>
                <div>
                    {meta.total > meta.per_page && (
                        <nav
                            className="isolate inline-flex -space-x-px rounded-md"
                            aria-label="Pagination"
                        >
                            {meta.links &&
                                meta.links.map((link, index) => {
                                    const prev = index === 0 ? true : false;
                                    const next = index === meta.links.length - 1 ? true : false;
                                    return (
                                        <a
                                            href="#"
                                            onClick={(e) => onClick(e, link)}
                                            key={index}
                                            aria-current="page"
                                            className={
                                                'relative z-10 inline-flex items-center px-4 py-2 text-sm font-medium hover:bg-gray-100 text-gray-500 ' +
                                                (prev ? 'rounded-l-md ' : '') +
                                                (next ? 'rounded-r-md ' : '') +
                                                (link.active ? 'text-xeomin-blue ' : '') +
                                                (link.url === null ? 'pointer-events-none ' : '')
                                            }
                                        >
                                            {prev
                                                ? renderPrev
                                                : next
                                                ? renderNext
                                                : index.toString()}
                                        </a>
                                    );
                                })}
                        </nav>
                    )}
                </div>
            </div>
        </div>
    );
}
