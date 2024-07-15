'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Button } from '../../ui/button';
import {
    Tooltip,
    TooltipProvider,
    TooltipTrigger,
    TooltipContent,
} from '../../ui/tooltip';
import { Role } from '@prisma/client';
import { DiamondMinus, DiamondPlus, UserRoundX } from 'lucide-react';
import {
    handlePermissionChange,
    handleUserDelete,
} from '@/lib/actions/userActions';
import { useToast } from '../../ui/use-toast';
import { useRouter } from 'next/navigation';
import { verifySession } from '@/lib/session';

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
            const router = useRouter();
            const { toast } = useToast();
            return (
                <div className="flex space-x-2">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="outline"
                                    onClick={async () => {
                                        const { id: userId, role } =
                                            await verifySession();
                                        const { error, message, data } =
                                            await handlePermissionChange(
                                                row.original.id,
                                                userId
                                            );
                                        router.refresh();
                                        toast({
                                            title: `Operation ${error ? 'Failed' : 'Succeeded'}`,
                                            description: message,
                                        });
                                    }}
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
                                    onClick={async () => {
                                        const { id: userId, role } =
                                            await verifySession();
                                        const { error, message, data } =
                                            await handleUserDelete(id, userId);
                                        router.refresh();
                                        toast({
                                            title: `Operation ${error ? 'Failed' : 'Succeeded'}`,
                                            description: message,
                                        });
                                    }}
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
];
