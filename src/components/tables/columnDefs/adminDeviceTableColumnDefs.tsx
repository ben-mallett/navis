'use client';

import { ColumnDef } from '@tanstack/react-table';
import ColumnSortingButton from '@/components/buttons/ColumnSortingButton';
import AdminDeviceActions from '@/components/dashboard/admin/AdminDeviceActions';

export type DeviceT = {
    id: number;
    name: string;
    balenaId: string;
    ipAddress: string;
    createdAt: Date;
    userId: number;
};

export const columns: ColumnDef<DeviceT>[] = [
    {
        accessorKey: 'id',
        id: 'id',
        header: ({ column }) => {
            return <ColumnSortingButton column={column} name={'Device ID'} />;
        },
    },
    {
        accessorKey: 'name',
        id: 'name',
        header: ({ column }) => {
            return <ColumnSortingButton column={column} name={'Name'} />;
        },
    },
    {
        accessorKey: 'balenaId',
        id: 'balenaId',
        header: ({ column }) => {
            return <ColumnSortingButton column={column} name={'Balena ID'} />;
        },
    },
    {
        accessorKey: 'ipAddress',
        id: 'ipAddress',
        header: ({ column }) => {
            return <ColumnSortingButton column={column} name={'IP Address'} />;
        },
    },
    {
        accessorKey: 'userId',
        id: 'userId',
        header: ({ column }) => {
            return <ColumnSortingButton column={column} name={'User ID'} />;
        },
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
            return <AdminDeviceActions row={row} />;
        },
    },
];
