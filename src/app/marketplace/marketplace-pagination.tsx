"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Pagination } from "@/components/shared/pagination";

interface MarketplacePaginationProps {
  currentPage: number;
  totalPages: number;
}

export function MarketplacePagination({
  currentPage,
  totalPages,
}: MarketplacePaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const handlePageChange = (page: number) => {
    const current = new URLSearchParams(searchParams.toString());
    if (page <= 1) {
      current.delete("page");
    } else {
      current.set("page", page.toString());
    }
    router.push(`/marketplace?${current.toString()}`);
  };

  return (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
      className="mt-8"
    />
  );
}
