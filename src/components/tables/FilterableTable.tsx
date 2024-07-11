'use client';

import { useRef, useState, useEffect, useMemo } from 'react';
import {
    Column,
    ColumnDef,
    ColumnFiltersState,
    RowData,
    flexRender,
    getCoreRowModel,
    getFacetedMinMaxValues,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import DebouncedInput from '../inputs/DebouncedInput';
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
    TableCell,
} from '../ui/table';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger } from '../ui/select';
import { ArrowDownWideNarrow, ArrowDownNarrowWide } from 'lucide-react';

declare module '@tanstack/react-table' {
    interface ColumnMeta<TData extends RowData, TValue> {
        filterVariant?: 'text' | 'range' | 'select';
    }
}

export type FacetedFilterTableProps = {
    columns: ColumnDef<any, unknown>[];
    data: any[];
};

export default function FacetedFilterTable(props: FacetedFilterTableProps) {
    const memoizedColumns = useMemo(() => props.columns, []);
    const memoizedData = useMemo(() => props.data, []);

    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const table = useReactTable({
        data: memoizedData,
        columns: memoizedColumns,
        state: {
            columnFilters,
        },
        initialState: {
            pagination: {
                pageIndex: 0,
                pageSize: 5,
            },
        },
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        getFacetedMinMaxValues: getFacetedMinMaxValues(),
        debugTable: true,
        debugHeaders: true,
        debugColumns: false,
    });

    return (
        <div className="w-full">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead
                                        key={header.id}
                                        colSpan={header.colSpan}
                                        className="text-teal-300"
                                    >
                                        {header.isPlaceholder ? null : (
                                            <div className="flex items-start flex-col justify-center w-full gap-2 mb-2">
                                                <div
                                                    {...{
                                                        className: `flex items-center justify-between gap-2 w-2/3 ${
                                                            header.column.getCanSort()
                                                                ? 'cursor-pointer select-none'
                                                                : ''
                                                        }`,
                                                        onClick:
                                                            header.column.getToggleSortingHandler(),
                                                    }}
                                                >
                                                    <div>
                                                        {flexRender(
                                                            header.column
                                                                .columnDef
                                                                .header,
                                                            header.getContext()
                                                        )}
                                                    </div>
                                                    <div>
                                                        {{
                                                            asc: (
                                                                <ArrowDownNarrowWide
                                                                    color="rgb(94 234 212)"
                                                                    strokeWidth={
                                                                        1.25
                                                                    }
                                                                />
                                                            ),
                                                            desc: (
                                                                <ArrowDownWideNarrow
                                                                    color="rgb(94 234 212)"
                                                                    strokeWidth={
                                                                        1.25
                                                                    }
                                                                />
                                                            ),
                                                        }[
                                                            header.column.getIsSorted() as string
                                                        ] ??
                                                            (header.column.getCanSort() ? (
                                                                <div>Sort</div>
                                                            ) : (
                                                                <></>
                                                            ))}
                                                    </div>
                                                </div>
                                                {header.column.getCanFilter() ? (
                                                    <div className="w-full">
                                                        <Filter
                                                            column={
                                                                header.column
                                                            }
                                                        />
                                                    </div>
                                                ) : null}
                                            </div>
                                        )}
                                    </TableHead>
                                );
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows.map((row) => {
                        return (
                            <TableRow key={row.id}>
                                {row.getVisibleCells().map((cell) => {
                                    return (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
            <div className="h-2" />
            <div className="flex justify-between items-center gap-2 w-full p-2">
                <div className="flex items-center gap-2 w-1/3">
                    <Button
                        className="bg-white/10 border border-teal-300 rounded-md text-teal-300"
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}
                    >
                        {'<<'}
                    </Button>
                    <Button
                        className="bg-white/10 border border-teal-300 rounded-md text-teal-300"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        {'<'}
                    </Button>
                    <Button
                        className="bg-white/10 border border-teal-300 rounded-md text-teal-300"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        {'>'}
                    </Button>
                    <Button
                        className="bg-white/10 border border-teal-300 rounded-md text-teal-300"
                        onClick={() =>
                            table.setPageIndex(table.getPageCount() - 1)
                        }
                        disabled={!table.getCanNextPage()}
                    >
                        {'>>'}
                    </Button>
                </div>
                <div className="flex justify-end items-center gap-2 w-2/3">
                    <span className="flex items-center gap-1">
                        <div>Page</div>
                        <strong>
                            {table.getState().pagination.pageIndex + 1} of{' '}
                            {table.getPageCount()}
                        </strong>
                    </span>
                    <span className="flex items-center gap-2">
                        | Go to page
                        <Input
                            type="number"
                            defaultValue={
                                table.getState().pagination.pageIndex + 1
                            }
                            onChange={(e) => {
                                const page = e.target.value
                                    ? Number(e.target.value) - 1
                                    : 0;
                                table.setPageIndex(page);
                            }}
                            className="bg-white/10 border border-teal-300 text-teal-300 rounded-md w-16"
                        />
                    </span>
                    <Select
                        value={`${table.getState().pagination.pageSize}`}
                        onValueChange={(val) => {
                            table.setPageSize(Number(val));
                        }}
                    >
                        <SelectTrigger className="bg-white/10 border border-teal-300 rounded-md w-32">
                            {`Show ${table.getState().pagination.pageSize}`}
                        </SelectTrigger>
                        <SelectContent>
                            {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                                <SelectItem
                                    key={pageSize}
                                    value={`${pageSize}`}
                                >
                                    Show {pageSize}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
}

export function Filter({ column }: { column: Column<any, unknown> }) {
    const { filterVariant } = column.columnDef.meta ?? {};

    const columnFilterValue = column.getFilterValue();

    const sortedUniqueValues = useMemo(
        () =>
            filterVariant === 'range'
                ? []
                : Array.from(column.getFacetedUniqueValues().keys()).sort(),
        [column.getFacetedUniqueValues(), filterVariant, column]
    );

    return filterVariant === 'range' ? (
        <div className="w-full">
            <div className="flex space-x-2 w-full">
                <DebouncedInput
                    type="number"
                    min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
                    max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
                    value={(columnFilterValue as [number, number])?.[0] ?? ''}
                    onChange={(value) =>
                        column.setFilterValue((old: [number, number]) => [
                            value,
                            old?.[1],
                        ])
                    }
                    placeholder={`Min ${
                        column.getFacetedMinMaxValues()?.[0] !== undefined
                            ? `(${column.getFacetedMinMaxValues()?.[0]})`
                            : ''
                    }`}
                    className="w-40"
                />
                <DebouncedInput
                    type="number"
                    min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
                    max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
                    value={(columnFilterValue as [number, number])?.[1] ?? ''}
                    onChange={(value) =>
                        column.setFilterValue((old: [number, number]) => [
                            old?.[0],
                            value,
                        ])
                    }
                    placeholder={`Max ${
                        column.getFacetedMinMaxValues()?.[1]
                            ? `(${column.getFacetedMinMaxValues()?.[1]})`
                            : ''
                    }`}
                    className="w-40"
                />
            </div>
            <div className="h-1" />
        </div>
    ) : filterVariant === 'select' ? (
        <Select
            onValueChange={(val) => {
                let filterVal = val;
                if (val === 'All') {
                    filterVal = '';
                }
                column.setFilterValue(filterVal);
            }}
            value={
                columnFilterValue?.toString() !== ''
                    ? columnFilterValue?.toString()
                    : 'All'
            }
        >
            <SelectTrigger className="bg-white/10 border border-teal-300 rounded-md w-40">
                Sort By{' '}
                {columnFilterValue?.toString()
                    ? columnFilterValue?.toString()
                    : ''}
            </SelectTrigger>
            <SelectContent className="bg-teal-300 border border-teal-300 rounded-md w-40">
                <SelectItem value="All">All</SelectItem>
                {sortedUniqueValues.map((value) => (
                    <SelectItem value={value} key={value}>
                        {value}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    ) : (
        <>
            <datalist id={column.id + 'list'}>
                {sortedUniqueValues.map((value: any, i) => (
                    <option value={value} key={i} />
                ))}
            </datalist>
            <DebouncedInput
                type="text"
                value={(columnFilterValue ?? '') as string}
                onChange={(value) => column.setFilterValue(value)}
                placeholder={`Search... (${column.getFacetedUniqueValues().size})`}
                className="w-40 bg-white/10 border-teal-300 placeholder:text-teal-300 text-teal-300"
                list={column.id + 'list'}
            />
            <div className="h-1" />
        </>
    );
}
