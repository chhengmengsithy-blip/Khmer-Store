"use client";

import { useState } from "react";
import { Search, ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Pagination } from "./pagination";

export interface Column<T> {
  key: string;
  header: string;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  pagination?: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
  selectable?: boolean;
  onSelectionChange?: (selectedItems: T[]) => void;
  keyExtractor: (item: T) => string;
  className?: string;
}

export function DataTable<T>({
  columns,
  data,
  searchPlaceholder = "Search...",
  onSearch,
  pagination,
  selectable = false,
  onSelectionChange,
  keyExtractor,
  className,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const handleSelectAll = () => {
    if (selectedKeys.size === data.length) {
      setSelectedKeys(new Set());
      onSelectionChange?.([]);
    } else {
      const allKeys = new Set(data.map(keyExtractor));
      setSelectedKeys(allKeys);
      onSelectionChange?.(data);
    }
  };

  const handleSelect = (item: T) => {
    const key = keyExtractor(item);
    const newSelected = new Set(selectedKeys);
    if (newSelected.has(key)) {
      newSelected.delete(key);
    } else {
      newSelected.add(key);
    }
    setSelectedKeys(newSelected);
    onSelectionChange?.(data.filter((d) => newSelected.has(keyExtractor(d))));
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearch?.(value);
  };

  const SortIcon = ({ columnKey }: { columnKey: string }) => {
    if (sortKey !== columnKey) {
      return <ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground/50" />;
    }
    return sortDirection === "asc" ? (
      <ChevronUp className="h-3.5 w-3.5 text-accent-gold" />
    ) : (
      <ChevronDown className="h-3.5 w-3.5 text-accent-gold" />
    );
  };

  return (
    <div className={cn("space-y-4", className)}>
      {onSearch && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9 border-white/10 bg-white/5 text-soft-white placeholder:text-muted-foreground/60 focus:border-accent-gold focus:ring-accent-gold/20"
          />
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-white/[0.06]">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.06] bg-elevated/50">
              {selectable && (
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedKeys.size === data.length && data.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-white/20 bg-white/5"
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground",
                    col.className
                  )}
                >
                  {col.sortable ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort(col.key)}
                      className="h-auto -ml-2 px-2 py-0 text-xs font-medium uppercase tracking-wider text-muted-foreground hover:text-soft-white hover:bg-transparent"
                    >
                      {col.header}
                      <SortIcon columnKey={col.key} />
                    </Button>
                  ) : (
                    col.header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="px-4 py-8 text-center text-sm text-muted-foreground"
                >
                  No data found
                </td>
              </tr>
            ) : (
              data.map((item) => {
                const key = keyExtractor(item);
                return (
                  <tr
                    key={key}
                    className="border-b border-white/[0.04] transition-colors hover:bg-elevated/30"
                  >
                    {selectable && (
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedKeys.has(key)}
                          onChange={() => handleSelect(item)}
                          className="rounded border-white/20 bg-white/5"
                        />
                      </td>
                    )}
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={cn(
                          "px-4 py-3 text-sm text-soft-white",
                          col.className
                        )}
                      >
                        {col.render
                          ? col.render(item)
                          : String(
                              (item as Record<string, unknown>)[col.key] ?? ""
                            )}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {pagination && pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={pagination.onPageChange}
        />
      )}
    </div>
  );
}
