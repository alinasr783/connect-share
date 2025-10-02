import {useSearchParams} from "react-router-dom";
import {PAGE_SIZE} from "../constant/const";
import {useEffect} from "react";

function Pagination({count}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const pageCount = Math.ceil(count / PAGE_SIZE);

  useEffect(() => {
    if (Number(searchParams.get("page")) > pageCount) {
      searchParams.set("page", pageCount);
      setSearchParams(searchParams);
    }
  }, [pageCount, searchParams, setSearchParams]);

  const buttonStyle = `
      cursor-pointer hover:bg-gray-200 py-2 px-3 rounded-full
    `;

  const disabledButtonStyle = `
      cursor-not-allowed opacity-50 py-2 px-3 rounded-full
    `;

  const activeButtonStyle = `
      cursor-pointer bg-blue-500 text-white py-2 px-3 rounded-full
    `;

  const pageButtonStyle = `
      cursor-pointer hover:bg-gray-200 py-2 px-3 rounded-full text-gray-600
    `;

  const handlePrevious = () => {
    const previous = currentPage === 1 ? currentPage : currentPage - 1;
    searchParams.set("page", previous);
    setSearchParams(searchParams);
  };

  const handleNext = () => {
    const next = currentPage === pageCount ? currentPage : currentPage + 1;
    searchParams.set("page", next);
    setSearchParams(searchParams);
  };

  const handlePageClick = (page) => {
    searchParams.set("page", page);
    setSearchParams(searchParams);
  };

  if (pageCount <= 1) return null;

  return (
    <div className="mt-8 flex items-center justify-center gap-3">
      <button
        className={currentPage === 1 ? disabledButtonStyle : buttonStyle}
        onClick={handlePrevious}
        disabled={currentPage === 1}>
        <i className="ri-arrow-left-s-line text-2xl"></i>
      </button>

      <div className="flex items-center gap-6">
        {(() => {
          // If total pages <= 4, show all pages
          if (pageCount <= 4) {
            return Array.from({length: pageCount}, (_, index) => {
              const pageNumber = index + 1;
              return (
                <button
                  key={index}
                  className={
                    currentPage === pageNumber
                      ? activeButtonStyle
                      : pageButtonStyle
                  }
                  onClick={() => handlePageClick(pageNumber)}>
                  {pageNumber}
                </button>
              );
            });
          }

          // If total pages > 4, show 4 pages with smart positioning
          return Array.from({length: 4}, (_, index) => {
            let pageNumber;

            if (currentPage <= 2) {
              // Near the beginning: show pages 1-4
              pageNumber = index + 1;
            } else if (currentPage >= pageCount - 1) {
              // Near the end: show last 4 pages
              pageNumber = pageCount - 3 + index;
            } else {
              // In the middle: center around current page
              pageNumber = currentPage - 1 + index;
            }

            // Ensure page number is within valid range
            pageNumber = Math.max(1, Math.min(pageNumber, pageCount));

            return (
              <button
                key={index}
                className={
                  currentPage === pageNumber
                    ? activeButtonStyle
                    : disabledButtonStyle
                }
                disabled={true}
                onClick={() => handlePageClick(pageNumber)}>
                {pageNumber}
              </button>
            );
          });
        })()}
      </div>

      <button
        className={
          currentPage === pageCount ? disabledButtonStyle : buttonStyle
        }
        onClick={handleNext}
        disabled={currentPage === pageCount}>
        <i className="ri-arrow-right-s-line text-2xl"></i>
      </button>
    </div>
  );
}

export default Pagination;
