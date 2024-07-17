'use client';

import { ColumnDef } from '@tanstack/react-table';
import ColumnSortingButton from '@/components/buttons/ColumnSortingButton';
import { UserDeviceActions } from '@/components/dashboard/account/DeviceActions';

export type UserDeviceT = {
    id: number;
    name: string;
    balenaId: string;
    ipAddress: string;
    createdAt: Date;
    userId: number;
};

export const columns: ColumnDef<UserDeviceT>[] = [
    {
        accessorKey: 'id',
        id: 'id',
        header: ({ column }) => {
            return <ColumnSortingButton column={column} name="ID" />;
        },
    },
    {
        accessorKey: 'name',
        id: 'name',
        header: ({ column }) => {
            return <ColumnSortingButton column={column} name="Name" />;
        },
    },
    {
        accessorKey: 'balenaId',
        id: 'balenaId',
        header: ({ column }) => {
            return <ColumnSortingButton column={column} name="Balena ID" />;
        },
    },
    {
        accessorKey: 'ipAddress',
        id: 'ipAddress',
        header: ({ column }) => {
            return <ColumnSortingButton column={column} name="IP Address" />;
        },
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
            return <UserDeviceActions row={row} />;
        },
    },
];
