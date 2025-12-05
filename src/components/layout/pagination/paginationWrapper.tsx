import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function CustomPagination({
  totalPages,
  currentPage,
  onPageChange,
}: PaginationProps) {
  const prevDisabled = currentPage === 1;
  const nextDisabled = currentPage === totalPages;

  const getVisiblePages = () => {
    const delta = 1; 
    const range = [];
    const rangeWithDots = [];

    range.push(1);

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (totalPages > 1) {
      range.push(totalPages);
    }

    let l;
    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();

  return (
    <Pagination>
      <PaginationContent className="text-neutral-500">
        <PaginationItem>
          <PaginationPrevious
            data-test="btn-pagina-anterior"
            className={`w-1 ${
              prevDisabled
                ? "opacity-50 pointer-events-none"
                : "bg-muted/50 hover:bg-blue-100"
            }`}
            href="#"
            onClick={(e: any) => {
              e.preventDefault();
              if (!prevDisabled) onPageChange(currentPage - 1);
            }}
          />
        </PaginationItem>
        
        {visiblePages.map((page, index) => {
          if (page === '...') {
            return (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }
          
          const pageNum = page as number;
          const active = pageNum === currentPage;
          
          return (
            <PaginationItem key={pageNum}>
              <PaginationLink
                href="#"
                className={`
                  ${
                    active
                      ? "bg-blue-600 text-white hover:bg-blue-700 hover:text-white"
                      : "text-neutral-500 hover:bg-blue-50"
                  }
                  `}
                aria-current={active ? "page" : undefined}
                onClick={(e: any) => {
                  e.preventDefault();
                  if (!active) onPageChange(pageNum);
                }}
              >
                {pageNum}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        <PaginationNext
          data-test="btn-proxima-pagina"
          className={`w-1 ${
            nextDisabled
              ? "opacity-50 pointer-events-none"
              : "bg-muted/50 hover:bg-blue-100"
          }`}
          href="#"
          onClick={(e: any) => {
            e.preventDefault();
            if (!nextDisabled) onPageChange(currentPage + 1);
          }}
        />
      </PaginationContent>
    </Pagination>
  );
}
