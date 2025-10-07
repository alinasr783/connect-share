import {useSearchParams} from "react-router-dom";
import {useEffect} from "react";

function TablePagination({children, totalCount, pageSize, className = ""}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const pageCount = Math.ceil(totalCount / pageSize);

  useEffect(() => {
    if (Number(searchParams.get("page")) > pageCount && pageCount > 0) {
      searchParams.set("page", pageCount);
      setSearchParams(searchParams);
    }
  }, [pageCount, searchParams, setSearchParams]);

  const handlePageChange = (page) => {
    searchParams.set("page", page);
    setSearchParams(searchParams);
  };

  const contextValue = {
    currentPage,
    pageCount,
    totalCount,
    pageSize,
    onPageChange: handlePageChange,
  };

  return (
    <div className={`flex items-center justify-between ${className}`}>
      {children(contextValue)}
    </div>
  );
}

function Info({
  currentPage,
  pageSize,
  totalCount,
  className = "",
  itemName = "items",
}) {
  const startItem = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalCount);

  return (
    <div className={`text-sm text-gray-600 ${className}`}>
      Showing {startItem} to {endItem} of {totalCount} {itemName}
    </div>
  );
}

function Navigation({currentPage, pageCount, onPageChange, className = ""}) {
  const isPreviousDisabled = currentPage === 1;
  const isNextDisabled = currentPage === pageCount || pageCount === 0;

  const buttonStyle = `
    flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md
    transition-colors duration-200
  `;

  const enabledButtonStyle = `
    ${buttonStyle}
    text-gray-700 bg-white border border-gray-300
    hover:bg-gray-50 hover:text-gray-900
    focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
  `;

  const disabledButtonStyle = `
    ${buttonStyle}
    text-gray-500 bg-gray-100 border border-gray-300
    cursor-not-allowed
  `;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        className={
          isPreviousDisabled ? disabledButtonStyle : enabledButtonStyle
        }
        onClick={() => !isPreviousDisabled && onPageChange(currentPage - 1)}
        disabled={isPreviousDisabled}
        aria-label="Previous page">
        <i className="ri-arrow-left-s-line text-lg"></i>
        Previous
      </button>

      <button
        className={isNextDisabled ? disabledButtonStyle : enabledButtonStyle}
        onClick={() => !isNextDisabled && onPageChange(currentPage + 1)}
        disabled={isNextDisabled}
        aria-label="Next page">
        Next
        <i className="ri-arrow-right-s-line text-lg"></i>
      </button>
    </div>
  );
}

function PageNumbers({
  currentPage,
  pageCount,
  onPageChange,
  maxVisible = 5,
  className = "",
}) {
  if (pageCount <= 1) return null;

  const getVisiblePages = () => {
    const pages = [];
    const half = Math.floor(maxVisible / 2);

    let start = Math.max(1, currentPage - half);
    let end = Math.min(pageCount, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {visiblePages.map((page) => (
        <button
          key={page}
          className={`
            px-3 py-2 text-sm font-medium rounded-md 
              transition-colors duration-200
            ${
              page === currentPage
                ? "bg-primary text-white"
                : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
            }
            focus:outline-none focus:ring-2 
              focus:ring-primary focus:ring-offset-2
          `}
          onClick={() => onPageChange(page)}
          aria-label={`Go to page ${page}`}
          aria-current={page === currentPage ? "page" : undefined}>
          {page}
        </button>
      ))}
    </div>
  );
}

TablePagination.Info = Info;
TablePagination.Navigation = Navigation;
TablePagination.PageNumbers = PageNumbers;

export default TablePagination;
