import React, { useState } from 'react';

export default function Pagination({
  currentPage,
  totalPages,
  totalItems = 0,
  itemsPerPage = 12,
  onPageChange,
}) {
  const [inputPage, setInputPage] = useState('');

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageJump = (e) => {
    if (e.key === 'Enter') {
      const pageNum = parseInt(inputPage, 10);
      if (pageNum >= 1 && pageNum <= totalPages) {
        onPageChange(pageNum);
        setInputPage('');
      } else {
        setInputPage('');
      }
    }
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col items-center gap-4 py-8">
      {/* Page Information */}
      <div className="text-sm text-gray-600">
        <p className="font-medium">Page {currentPage} of {totalPages}</p>
        {totalItems > 0 && (
          <p className="text-xs text-gray-500">
            (Showing products {startItem}-{endItem} of {totalItems})
          </p>
        )}
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center gap-3">
        {/* Previous Button */}
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>

        {/* Page Jump Input */}
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="1"
            max={totalPages}
            value={inputPage}
            onChange={(e) => setInputPage(e.target.value)}
            onKeyPress={handlePageJump}
            placeholder="Go to"
            className="w-16 border border-gray-300 rounded-md px-2 py-2 text-center text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <span className="text-xs text-gray-500">/ {totalPages}</span>
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}
