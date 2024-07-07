'use client';

import { Role } from '@prisma/client';
import { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import FacetedFilterTable from './FilterableTable';
import { Button } from '../ui/button';
import { DiamondMinus, DiamondPlus, UserRoundX } from 'lucide-react';
import {
    TooltipContent,
    TooltipProvider,
    Tooltip,
    TooltipTrigger,
} from '@radix-ui/react-tooltip';
import {
    handlePermissionChange,
    handleUserDelete,
} from '@/lib/actions/userActions';
import { useToast } from '../ui/use-toast';
import { useRouter } from 'next/navigation';

export type UserT = {
    id: number;
    name: string;
    email: string;
    role: Role;
    createdAt: Date;
};

export type UserTableProps = {
    users: UserT[];
};

export default function UserTable(props: UserTableProps) {
    const { users } = props;
    const { toast } = useToast();
    const router = useRouter();

    async function handleRoleChange(id: number) {
        const { error, message, data } = await handlePermissionChange(id);
        router.refresh();
        toast({
            title: `Operation ${error ? 'Failed' : 'Succeeded'}`,
            description: message,
        });
    }

    async function handleDelete(id: number) {
        const { error, message, data } = await handleUserDelete(id);
        router.refresh();
        toast({
            title: `Operation ${error ? 'Failed' : 'Succeeded'}`,
            description: message,
        });
    }

    const userDataColumns = useMemo<ColumnDef<UserT, any>[]>(
        () => [
            {
                accessorKey: 'createdAt',
                id: 'createdAt',
                header: 'Joined On',
                cell: ({ getValue }) =>
                    new Date(getValue<string>()).toLocaleDateString(),
            },
            {
                accessorKey: 'id',
                id: 'id',
                header: 'User ID',
            },
            {
                accessorKey: 'name',
                id: 'name',
                header: 'Name',
            },
            {
                accessorKey: 'email',
                id: 'email',
                header: 'Email',
            },
            {
                accessorKey: 'role',
                id: 'role',
                header: 'Role',
                meta: {
                    filterVariant: 'select',
                },
            },
            {
                id: 'actions',
                header: 'Actions',
                cell: ({ row }) => {
                    return (
                        <div className="flex space-x-2">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="outline"
                                            onClick={() =>
                                                handleRoleChange(
                                                    row.original.id
                                                )
                                            }
                                            className="bg-blue-400/60 border border-teal-300"
                                        >
                                            {row.original.role === Role.USER ? (
                                                <div className="flex gap-2 items-center">
                                                    <DiamondPlus
                                                        color="rgb(94 234 212)"
                                                        strokeWidth={1.25}
                                                    />
                                                </div>
                                            ) : (
                                                <div className="flex gap-2 items-center">
                                                    <DiamondMinus
                                                        color="rgb(94 234 212)"
                                                        strokeWidth={1.25}
                                                    />
                                                </div>
                                            )}
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <div className="bg-teal-300 text-slate-600 p-2 rounded-md mb-1 border-teal-500">
                                            {row.original.role === Role.USER
                                                ? 'Upgrade'
                                                : 'Downgrade'}{' '}
                                            Permissions
                                        </div>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="outline"
                                            onClick={() =>
                                                handleDelete(row.original.id)
                                            }
                                            className="bg-red-400/60 border border-teal-300"
                                        >
                                            <UserRoundX
                                                color="rgb(94 234 212)"
                                                strokeWidth={1.25}
                                            />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <div className="bg-teal-300 text-slate-600 p-2 rounded-md mb-1">
                                            Delete User
                                        </div>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    );
                },
            },
        ],
        []
    );

    return <FacetedFilterTable data={users} columns={userDataColumns} />;
}
