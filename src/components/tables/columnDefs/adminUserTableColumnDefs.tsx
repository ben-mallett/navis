'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Role } from '@prisma/client';
import ColumnSortingButton from '@/components/buttons/ColumnSortingButton';
import AdminUserActions from '@/components/dashboard/admin/AdminUserActions';

export type UserT = {
    id: number;
    name: string;
    email: string;
    role: Role;
    createdAt: Date;
};

export const columns: ColumnDef<UserT>[] = [
    {
        accessorKey: 'createdAt',
        id: 'createdAt',
        header: ({ column }) => {
            return <ColumnSortingButton column={column} name={'Created At'} />;
        },
        cell: ({ getValue }) =>
            new Date(getValue<string>()).toLocaleDateString(),
    },
    {
        accessorKey: 'id',
        id: 'id',
        header: ({ column }) => {
            return <ColumnSortingButton column={column} name={'User ID'} />;
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
        accessorKey: 'email',
        id: 'email',
        header: ({ column }) => {
            return <ColumnSortingButton column={column} name={'Email'} />;
        },
    },
    {
        accessorKey: 'role',
        id: 'role',
        header: ({ column }) => {
            return <ColumnSortingButton column={column} name={'Role'} />;
        },
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
            return <AdminUserActions row={row} />;
        },
    },
];
