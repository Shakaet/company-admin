import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, type FormEvent, type JSX } from "react";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface PaginationProps {
  limit: number;
  page: number;
  total: number;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
}

const Pagination = ({
  limit,
  page,
  setPage,
  setLimit,
  total,
}: PaginationProps) => {
  const lastPage = Math.ceil(total / limit);
  const maxPageButtons = 5;

  const [jumpPage, setJumpPage] = useState<string>("");

  const handleRowsChange = (value: string) => {
    setPage(1);
    setLimit(Number(value));
  };

  const handlePageClick = (n: number) => {
    setPage(n);
  };

  const handlePageJump = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const n = Math.max(1, Math.min(lastPage, Number(jumpPage)));

    if (!isNaN(n)) {
      setPage(n);
      setJumpPage("");
    }
  };

  const getPageButtons = () => {
    const buttons: JSX.Element[] = [];

    let startPage = Math.max(1, page - Math.floor(maxPageButtons / 2));
    const endPage = Math.min(lastPage, startPage + maxPageButtons - 1);

    if (endPage - startPage < maxPageButtons - 1) {
      startPage = Math.max(1, endPage - maxPageButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <Button
          key={i}
          onClick={() => handlePageClick(i)}
          variant={page === i ? "default" : "outline"}
          size="sm"
          className="h-8 px-3"
        >
          {i}
        </Button>,
      );
    }

    return buttons;
  };

  return (
    <>
      {total > limit && (
        <div className="my-6 flex flex-wrap justify-end gap-2 sm:text-sm">
          {/* Rows per page */}
          <div className="flex items-center gap-2">
            <span className="font-medium text-muted-foreground">Rows:</span>

            <Select value={String(limit)} onValueChange={handleRowsChange}>
              <SelectTrigger className="h-8 w-20">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="100">100</SelectItem>
                <SelectItem value="500">500</SelectItem>
                <SelectItem value="1000">1000</SelectItem>
                <SelectItem value="1000000">1000000</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Prev */}
          <Button
            onClick={() => page > 1 && setPage(page - 1)}
            disabled={page === 1}
            variant="outline"
            size="sm"
            className="h-8 px-3"
          >
            <ChevronLeft />
          </Button>

          {/* First + Ellipsis */}
          {lastPage > maxPageButtons &&
            page > Math.floor(maxPageButtons / 2) && (
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3"
                onClick={() => setPage(1)}
              >
                1
              </Button>
            )}

          {lastPage > maxPageButtons &&
            page > Math.floor(maxPageButtons / 2) + 1 && (
              <span className="px-2 text-muted-foreground">...</span>
            )}

          {/* Page Numbers */}
          {getPageButtons()}

          {/* Ellipsis + Last */}
          {lastPage > maxPageButtons &&
            page < lastPage - Math.floor(maxPageButtons / 2) && (
              <span className="px-2 text-muted-foreground">...</span>
            )}

          {lastPage > maxPageButtons &&
            page < lastPage - maxPageButtons / 2 && (
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3"
                onClick={() => setPage(lastPage)}
              >
                {lastPage}
              </Button>
            )}

          {/* Next */}
          <Button
            onClick={() => page < lastPage && setPage(page + 1)}
            disabled={page === lastPage}
            variant="outline"
            size="sm"
            className="h-8 px-3"
          >
            <ChevronRight />
          </Button>

          {/* Jump to page */}
          {lastPage > maxPageButtons && (
            <form onSubmit={handlePageJump} className="flex items-center gap-2">
              <span className="font-medium text-muted-foreground">
                Go to page:
              </span>

              <Input
                type="number"
                min={1}
                max={lastPage}
                value={jumpPage}
                onChange={(e) => setJumpPage(e.target.value)}
                className="h-8 w-16"
              />

              <Button type="submit" size="sm" className="h-8 px-3">
                Go
              </Button>
            </form>
          )}
        </div>
      )}
    </>
  );
};

export default Pagination;
