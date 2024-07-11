'use client';

import { useMemo, memo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import FacetedFilterTable from './FilterableTable';
import { Button } from '../ui/button';
import { Bolt, MonitorX, SendToBack, Info } from 'lucide-react';
import {
    TooltipContent,
    TooltipProvider,
    Tooltip,
    TooltipTrigger,
} from '@radix-ui/react-tooltip';
import { useToast } from '../ui/use-toast';
import { useRouter } from 'next/navigation';
import IpUpdateForm from '../forms/IpUpdateForm';
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogTitle,
} from '../ui/dialog';
import { deleteDevice } from '@/lib/actions/deviceActions';
import { verifySession } from '@/lib/session';

export type DeviceT = {
    id: number;
    name: string;
    balenaId: string;
    ipAddress: string;
    createdAt: Date;
};

export type DeviceTableProps = {
    devices: DeviceT[];
};

const MemoFacetedFilterTable = memo(FacetedFilterTable);
const devices = [
    {
        id: 1,
        name: 'device 1',
        ipAddress: '192.168.1.1',
        balenaId: 'uu1341',
        createdAt: new Date(),
    },
    {
        id: 1,
        name: 'device 1',
        ipAddress: '192.168.1.1',
        balenaId: 'uu1341',
        createdAt: new Date(),
    },
    {
        id: 1,
        name: 'device 1',
        ipAddress: '192.168.1.1',
        balenaId: 'uu1341',
        createdAt: new Date(),
    },
    {
        id: 1,
        name: 'device 1',
        ipAddress: '192.168.1.1',
        balenaId: 'uu1341',
        createdAt: new Date(),
    },
    {
        id: 1,
        name: 'device 1',
        ipAddress: '192.168.1.1',
        balenaId: 'uu1341',
        createdAt: new Date(),
    },
    {
        id: 1,
        name: 'device 1',
        ipAddress: '192.168.1.1',
        balenaId: 'uu1341',
        createdAt: new Date(),
    },
    {
        id: 1,
        name: 'device 1',
        ipAddress: '192.168.1.1',
        balenaId: 'uu1341',
        createdAt: new Date(),
    },
    {
        id: 1,
        name: 'device 1',
        ipAddress: '192.168.1.1',
        balenaId: 'uu1341',
        createdAt: new Date(),
    },
    {
        id: 1,
        name: 'device 1',
        ipAddress: '192.168.1.1',
        balenaId: 'uu1341',
        createdAt: new Date(),
    },
    {
        id: 1,
        name: 'device 1',
        ipAddress: '192.168.1.1',
        balenaId: 'uu1341',
        createdAt: new Date(),
    },
    {
        id: 1,
        name: 'device 1',
        ipAddress: '192.168.1.1',
        balenaId: 'uu1341',
        createdAt: new Date(),
    },
    {
        id: 1,
        name: 'device 1',
        ipAddress: '192.168.1.1',
        balenaId: 'uu1341',
        createdAt: new Date(),
    },
];

export default function DeviceTable(props: DeviceTableProps) {
    const { toast } = useToast();
    const router = useRouter();

    async function handleDelete(id: number) {
        const { id: userId, role } = await verifySession();
        const { error, message, data } = await deleteDevice(id, userId);
        router.refresh();
        toast({
            title: `Operation ${error ? 'Failed' : 'Succeeded'}`,
            description: message,
        });
    }

    async function syncIp(ipAddress: string) {
        console.log(`Attempting to sync device at IP ${ipAddress}`);
    }

    const deviceDataColumns = useMemo<ColumnDef<DeviceT, any>[]>(
        () => [
            {
                accessorKey: 'id',
                id: 'id',
                header: 'ID',
            },
            {
                accessorKey: 'createdAt',
                id: 'createdAt',
                header: 'Created On',
                cell: ({ getValue }) =>
                    new Date(getValue<string>()).toLocaleDateString(),
            },
            {
                accessorKey: 'name',
                id: 'name',
                header: 'Name',
            },
            {
                accessorKey: 'balenaId',
                id: 'balenaId',
                header: 'Balena ID',
            },
            {
                accessorKey: 'ipAddress',
                id: 'ipAddress',
                header: 'IP',
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
                                        <Dialog>
                                            <DialogTrigger>
                                                <div className="bg-blue-400/60 border-teal-300 border rounded-md hover:cursor-pointer hover:bg-blue-300/60 h-10 px-4 py-2">
                                                    <Bolt
                                                        color="rgb(94 234 212)"
                                                        strokeWidth={1.25}
                                                        className="w-full h-full"
                                                    />
                                                </div>
                                            </DialogTrigger>
                                            <DialogContent className="text-slate-600">
                                                <DialogTitle>
                                                    Update IP
                                                </DialogTitle>
                                                <IpUpdateForm
                                                    deviceId={row.original.id}
                                                />
                                            </DialogContent>
                                        </Dialog>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <div className="bg-teal-300 text-slate-600 p-2 rounded-md mb-1 border-teal-500">
                                            Update IP
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
                                            className="bg-red-400/60 border border-teal-300 hover:bg-red-300/60"
                                        >
                                            <MonitorX
                                                color="rgb(94 234 212)"
                                                strokeWidth={1.25}
                                            />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <div className="bg-teal-300 text-slate-600 p-2 rounded-md mb-1">
                                            Delete Device
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
                                                syncIp(row.original.ipAddress)
                                            }
                                            className="bg-yellow-400/60 border border-teal-300 hover:bg-yellow-300/60"
                                        >
                                            <SendToBack
                                                color="rgb(94 234 212)"
                                                strokeWidth={1.25}
                                            />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <div className="bg-teal-300 text-slate-600 p-2 rounded-md mb-1">
                                            Sync Device Config
                                        </div>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className="flex justify-center items-center hover:cursor-pointer">
                                            <Info
                                                color="rgb(94 234 212)"
                                                strokeWidth={1.25}
                                            />
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <div className="bg-teal-300 text-slate-600 p-2 rounded-md mb-1 w-[250px] text-justify">
                                            Syncing the device config will
                                            update the device via balena. Ensure
                                            the device is plugged in and
                                            connected to internet.
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

    return (
        <MemoFacetedFilterTable data={devices} columns={deviceDataColumns} />
    );
}
