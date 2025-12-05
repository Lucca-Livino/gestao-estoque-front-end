import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { RotateCcw } from "lucide-react";

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

  const getPageNumbers = () => {
    const pages: (number | 'ellipsis-start' | 'ellipsis-end')[] = [];
    
    if (totalPages <= 3) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Determina quais 3 páginas mostrar baseado na página atual
    let start: number;
    let end: number;

    if (currentPage === 1) {
      start = 1;
      end = 3;
    } else if (currentPage === totalPages) {
      start = totalPages - 2;
      end = totalPages;
    } else {
      start = currentPage - 1;
      end = currentPage + 1;
    }

    // Adiciona elipse no início se necessário
    if (start > 1) {
      pages.push('ellipsis-start');
    }

    // Adiciona as 3 páginas
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Adiciona elipse no fim se necessário
    if (end < totalPages) {
      pages.push('ellipsis-end');
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

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
        
        {pageNumbers.map((item, index) => {
          if (item === 'ellipsis-start' || item === 'ellipsis-end') {
            return (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }

          const page = item as number;
          const active = page === currentPage;
          
          return (
            <PaginationItem key={page}>
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
                  if (!active) onPageChange(page);
                }}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        {nextDisabled ? (
          <PaginationItem>
            <PaginationLink
              href="#"
              size="icon"
              className="bg-muted/50 hover:bg-blue-100 text-neutral-500"
              onClick={(e: any) => {
                e.preventDefault();
                onPageChange(1);
              }}
            >
              <RotateCcw className="h-4 w-4" />
            </PaginationLink>
          </PaginationItem>
        ) : (
          <PaginationNext
            data-test="btn-proxima-pagina"
            className="w-1 bg-muted/50 hover:bg-blue-100"
            href="#"
            onClick={(e: any) => {
              e.preventDefault();
              onPageChange(currentPage + 1);
            }}
          />
        )}
      </PaginationContent>
    </Pagination>
  );
}
