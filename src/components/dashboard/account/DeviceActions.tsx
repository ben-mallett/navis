'use client';

import { Button } from '../../ui/button';
import {
    Tooltip,
    TooltipProvider,
    TooltipTrigger,
    TooltipContent,
} from '../../ui/tooltip';
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogTitle,
} from '../../ui/dialog';
import IpUpdateForm from '../../forms/IpUpdateForm';
import { Bolt, MonitorX, SendToBack, Info, ArrowUpDown } from 'lucide-react';
import { deleteDevice } from '@/lib/actions/deviceActions';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';

export function UserDeviceActions(props: any) {
    const { row } = props;
    const { toast } = useToast();
    const router = useRouter();
    return (
        <div className="flex space-x-2 w-[150px]">
            <Dialog>
                <DialogTrigger>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className="bg-blue-400/60 border-teal-300 border rounded-md hover:cursor-pointer hover:bg-blue-300/60 h-10 px-4 py-2 flex justify-center items-center">
                                    <Bolt
                                        color="rgb(94 234 212)"
                                        strokeWidth={1.25}
                                    />
                                </div>
                            </TooltipTrigger>
                            <TooltipContent className="bg-teal-300 text-slate-600 p-2 rounded-md mb-1 border-teal-500">
                                <div>Update</div>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </DialogTrigger>
                <DialogContent className="text-slate-600">
                    <DialogTitle>Update IP</DialogTitle>
                    <IpUpdateForm deviceId={row.original.id} />
                </DialogContent>
            </Dialog>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="outline"
                            onClick={async () => {
                                const { error, message, data } =
                                    await deleteDevice(
                                        row.original.id,
                                        row.original.userId
                                    );
                                toast({
                                    title: error
                                        ? 'Deletion Failed'
                                        : 'Deletion Succeeded',
                                    description: error
                                        ? `Failed to delete device ${data}`
                                        : `Successfully deleted device ${data}`,
                                    variant: error ? 'destructive' : 'default',
                                });
                                if (!error) router.refresh();
                            }}
                            className="bg-red-400/60 border border-teal-300 hover:bg-red-300/60"
                        >
                            <MonitorX
                                color="rgb(94 234 212)"
                                strokeWidth={1.25}
                            />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-teal-300 text-slate-600 p-2 rounded-md mb-1">
                        <div>Delete Device</div>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="outline"
                            onClick={() =>
                                // syncDeviceId(row.original.id)
                                console.log('syncing ip')
                            }
                            className="bg-yellow-400/60 border border-teal-300 hover:bg-yellow-300/60"
                        >
                            <SendToBack
                                color="rgb(94 234 212)"
                                strokeWidth={1.25}
                            />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-teal-300 text-slate-600 p-2 rounded-md mb-1">
                        <div>Sync Device Config</div>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div className="flex justify-center items-center hover:cursor-pointer">
                            <Info color="rgb(94 234 212)" strokeWidth={1.25} />
                        </div>
                    </TooltipTrigger>
                    <TooltipContent className="bg-teal-300 text-slate-600 p-2 rounded-md mb-1 w-[250px] text-justify">
                        <div>
                            Syncing the device config will update the device via
                            balena. Ensure the device is plugged in and
                            connected to internet.
                        </div>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    );
}
