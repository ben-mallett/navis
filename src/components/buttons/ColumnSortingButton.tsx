'use client';

import { Button } from '../ui/button';
import { ArrowUpDown } from 'lucide-react';

export type ColumnSortingButtonProps = {
    column: any;
    name: string;
};

export default function ColumnSortingButton(props: ColumnSortingButtonProps) {
    const { column, name } = props;
    return (
        <Button
            variant="ghost"
            onClick={() => {
                column.toggleSorting(column.getIsSorted() === 'asc');
            }}
        >
            {name}
            <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
    );
}
