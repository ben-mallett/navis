'use client';

import { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import FacetedFilterTable from './FilterableTable';
import { Button } from '../ui/button';
import { Bolt, MonitorX } from 'lucide-react';
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

export type DeviceT = {
    id: number;
    ipAddress: string;
    createdAt: Date;
    numSensorReadings: number;
};

export type DeviceTableProps = {
    devices: DeviceT[];
};

export default function DeviceTable(props: DeviceTableProps) {
    const { devices } = props;
    const { toast } = useToast();
    const router = useRouter();

    async function handleDelete(id: number) {
        const { error, message, data } = await deleteDevice(id);
        router.refresh();
        toast({
            title: `Operation ${error ? 'Failed' : 'Succeeded'}`,
            description: message,
        });
    }

    const deviceDataColumns = useMemo<ColumnDef<DeviceT, any>[]>(
        () => [
            {
                accessorKey: 'createdAt',
                id: 'createdAt',
                header: 'Created On',
                cell: ({ getValue }) =>
                    new Date(getValue<string>()).toLocaleDateString(),
            },
            {
                accessorKey: 'id',
                id: 'id',
                header: 'Device ID',
            },
            {
                accessorKey: 'ipAddress',
                id: 'ipAddress',
                header: 'IP Address',
            },
            {
                accessorKey: 'numSensorReadings',
                id: 'numSensorReadings',
                header: '# Observations',
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
                                            className="bg-red-400/60 border border-teal-300"
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
                        </div>
                    );
                },
            },
        ],
        []
    );

    return <FacetedFilterTable data={devices} columns={deviceDataColumns} />;
}
