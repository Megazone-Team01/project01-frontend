// PageNation.jsx
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

function PageNation({ currentPage, totalPages, hasNext, hasPrevious, onPageChange }) {

    const handlePageClick = (e, page) => {
        e.preventDefault();
        onPageChange(page);
    };

    // 데이터가 없으면 렌더링하지 않음
    if (!totalPages || totalPages === 0) {
        return null;
    }

    return (
        <Pagination>
            <PaginationContent>
                {/* 이전 버튼 */}
                <PaginationItem>
                    <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                            if (hasPrevious) {
                                handlePageClick(e, currentPage - 1);
                            } else {
                                e.preventDefault();
                            }
                        }}
                        className={!hasPrevious ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                </PaginationItem>

                {/* 첫 페이지 */}
                {currentPage > 1 && (
                    <PaginationItem>
                        <PaginationLink
                            href="#"
                            onClick={(e) => handlePageClick(e, 0)}
                        >
                            1
                        </PaginationLink>
                    </PaginationItem>
                )}

                {/* 앞쪽 생략 표시 */}
                {currentPage > 2 && (
                    <PaginationItem>
                        <PaginationEllipsis />
                    </PaginationItem>
                )}

                {/* 이전 페이지 */}
                {currentPage > 0 && (
                    <PaginationItem>
                        <PaginationLink
                            href="#"
                            onClick={(e) => handlePageClick(e, currentPage - 1)}
                        >
                            {currentPage}
                        </PaginationLink>
                    </PaginationItem>
                )}

                {/* 현재 페이지 */}
                <PaginationItem>
                    <PaginationLink
                        href="#"
                        isActive
                        onClick={(e) => e.preventDefault()}
                    >
                        {currentPage + 1}
                    </PaginationLink>
                </PaginationItem>

                {/* 다음 페이지 */}
                {currentPage < totalPages - 1 && (
                    <PaginationItem>
                        <PaginationLink
                            href="#"
                            onClick={(e) => handlePageClick(e, currentPage + 1)}
                        >
                            {currentPage + 2}
                        </PaginationLink>
                    </PaginationItem>
                )}

                {/* 뒤쪽 생략 표시 */}
                {currentPage < totalPages - 3 && (
                    <PaginationItem>
                        <PaginationEllipsis />
                    </PaginationItem>
                )}

                {/* 마지막 페이지 */}
                {currentPage < totalPages - 2 && totalPages > 1 && (
                    <PaginationItem>
                        <PaginationLink
                            href="#"
                            onClick={(e) => handlePageClick(e, totalPages - 1)}
                        >
                            {totalPages}
                        </PaginationLink>
                    </PaginationItem>
                )}

                {/* 다음 버튼 */}
                <PaginationItem>
                    <PaginationNext
                        href="#"
                        onClick={(e) => {
                            if (hasNext) {
                                handlePageClick(e, currentPage + 1);
                            } else {
                                e.preventDefault();
                            }
                        }}
                        className={!hasNext ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}

export default PageNation;