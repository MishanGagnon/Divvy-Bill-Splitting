"use client";

import { useState, useEffect } from "react";
import { usePaginatedQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import Link from "next/link";

export function PaginatedReceiptList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(0); // Reset to first page on search change
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { results, status, loadMore } = usePaginatedQuery(
    api.receipt.listUserReceipts,
    { searchTerm: debouncedSearchTerm || undefined },
    { initialNumItems: itemsPerPage }
  );

  const totalResultsCount = results.length;
  const startIndex = currentPage * itemsPerPage;
  const pageResults = results.slice(startIndex, startIndex + itemsPerPage);

  const canGoNext =
    status === "CanLoadMore" || startIndex + itemsPerPage < totalResultsCount;
  const canGoPrev = currentPage > 0;

  const handleNext = () => {
    if (startIndex + itemsPerPage >= totalResultsCount && status === "CanLoadMore") {
      loadMore(itemsPerPage);
    }
    setCurrentPage((prev) => prev + 1);
  };

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header with Title and Search */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <div className="flex-1 border-t border-ink/20 border-dashed"></div>
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-center whitespace-nowrap opacity-70">
            Recent Transactions
          </h3>
          <div className="flex-1 border-t border-ink/20 border-dashed"></div>
        </div>

        {/* Receipt-styled Search Bar */}
        <div className="relative group">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="[ SEARCH BY MERCHANT ]"
            className="w-full bg-paper border-2 border-ink py-2 px-3 text-[10px] font-bold uppercase tracking-widest placeholder:opacity-20 focus:outline-none focus:ring-2 focus:ring-ink/20 transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold opacity-30 hover:opacity-100"
            >
              [ X ]
            </button>
          )}
        </div>
      </div>

      {/* Results List */}
      {pageResults.length === 0 && (status === "Exhausted" || status === "CanLoadMore") ? (
        <p className="text-[10px] uppercase opacity-40 text-center italic py-4">
          {debouncedSearchTerm ? "No matching transactions" : "No transactions detected"}
        </p>
      ) : (
        <div className="flex flex-col gap-4 min-h-[200px]">
          {pageResults.map((receipt) => (
            <Link
              key={receipt._id}
              href={`/receipts/${receipt._id}`}
              className="flex flex-col gap-1 group overflow-hidden"
            >
              <div className="flex justify-between items-baseline gap-2">
                <span className="text-xs font-bold uppercase group-hover:underline truncate flex-1">
                  {receipt.merchantName}
                </span>
                <span className="text-xs opacity-70 flex-shrink-0">
                  ${((receipt.totalCents || 0) / 100).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center text-[9px] uppercase tracking-tighter opacity-50">
                <div className="flex gap-2">
                  <span>
                    {receipt.date ||
                      new Date(receipt.createdAt).toLocaleDateString()}
                  </span>
                  <span
                    className={`font-bold whitespace-nowrap ${
                      receipt.isUploadedByMe ? "text-ink" : "text-ink/60"
                    }`}
                  >
                    {receipt.isUploadedByMe && receipt.isClaimedByMe
                      ? "[ HOST + CLAIMED ]"
                      : receipt.isUploadedByMe
                        ? "[ HOST ]"
                        : receipt.isParticipantByMe
                          ? "[ PARTICIPANT ]"
                          : receipt.isClaimedByMe
                            ? "[ CLAIMED ]"
                            : "[ JOINED ]"}
                  </span>
                </div>
                <span className="group-hover:translate-x-1 transition-transform">
                  VIEW RECEIPT {">>"}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <div className="flex-1 border-t border-ink/10 border-dashed"></div>
          <div className="flex items-center gap-4">
            <button
              disabled={!canGoPrev}
              onClick={handlePrev}
              className="text-[10px] font-bold uppercase tracking-widest disabled:opacity-10 hover:opacity-100 transition-opacity"
            >
              {"<< PREV"}
            </button>
            
            <span className="text-[10px] font-bold opacity-40">
              PAGE {currentPage + 1}
            </span>

            <button
              disabled={!canGoNext}
              onClick={handleNext}
              className="text-[10px] font-bold uppercase tracking-widest disabled:opacity-10 hover:opacity-100 transition-opacity"
            >
              {"NEXT >>"}
            </button>
          </div>
          <div className="flex-1 border-t border-ink/10 border-dashed"></div>
        </div>
      </div>

      {/* Loading States */}
      {(status === "LoadingFirstPage" || status === "LoadingMore") && (
        <div className="flex flex-col items-center gap-4 py-2 animate-pulse">
          <p className="text-[10px] uppercase font-bold opacity-50">
            {status === "LoadingFirstPage" ? "Retrieving Receipts..." : "Retrieving More..."}
          </p>
        </div>
      )}
    </div>
  );
}
