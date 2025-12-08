import { DataTableViewOptions } from "@/components/data-table/column-vsibility";
import { DataTablePagination } from "@/components/data-table/pagination";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { useState } from "react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  return (
    <div>
      {/* Mobile-friendly filter and options */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2 p-4">
        <Input
          placeholder="Filter names..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="w-full sm:max-w-sm"
        />
        <DataTableViewOptions table={table} />
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-2 p-4">
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => {
            // Build visible cells excluding `id`
            const visibleCells = row
              .getVisibleCells()
              .filter((cell) => cell.column.id !== "id");

            // Use the first visible cell as the card title
            const [titleCell, ...detailCells] = visibleCells;

            return (
              <Card
                key={row.id}
                className="p-0 sm:p-0 space-y-0 transition-shadow duration-150 bg-background"
              >
                {/* Title */}
                {titleCell ? (
                  <CardHeader className="flex items-start p-4 py-2 sm:p-4 text-lg font-semibold leading-tight break-words">
                    {flexRender(
                      titleCell.column.columnDef.cell,
                      titleCell.getContext(),
                    )}
                  </CardHeader>
                ) : null}

                {/* Details */}
                {detailCells.length > 0 && (
                  <CardContent className="p-4 py-0">
                    <div className=" divide-y divide-border">
                      {detailCells.map((cell) => {
                        const header = cell.column.columnDef.header;
                        const headerText =
                          typeof header === "string" ? header : "";
                        return (
                          <div key={cell.id} className="flex py-3 sm:px-6">
                            <span className="text-sm font-medium w-28 sm:w-36 shrink-0">
                              {headerText || cell.column.id}
                            </span>
                            <span className="text-sm text-right flex-1 break-words">
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext(),
                              )}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })
        ) : (
          <Card className="rounded-lg border bg-card">
            <CardContent className="p-8 text-center">No results.</CardContent>
          </Card>
        )}
      </div>

      <DataTablePagination table={table} />
    </div>
  );
}
