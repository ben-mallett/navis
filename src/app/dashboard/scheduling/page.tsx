'use server';

import { getDevicesOfUser } from '@/lib/actions/deviceActions';
import { verifySession } from '@/lib/session';
import { CronSetter } from '@/components/dashboard/CronSetter';
import { ScrollArea } from '@/components/ui/scroll-area';

export default async function DashboardSchedulingPage() {
    const { id, role } = await verifySession();
    const { error, message, data: devices } = await getDevicesOfUser(id, id);
    return (
        <ScrollArea className="flex flex-col justify-start items-start p-10 w-full h-[850px]">
            <h2 className="mb-10">Scheduling Center</h2>
            <div className="grid grid-cols-2 gap-6 w-full p-10">
                {devices.map((device: any, i: number) => {
                    return (
                        <div
                            key={i}
                            className="flex flex-col justify-between items-center w-full bg-white/10 border border-teal-300 rounded-md p-6 gap-4"
                        >
                            <div className="flex justify-between items-center w-full">
                                <h4 className="text-center">
                                    {device.name} - {device.balenaId}
                                </h4>
                                <h4 className="text-center">
                                    {device.ipAddress}
                                </h4>
                            </div>
                            <p className="self-start">
                                Update the Cron for your device.
                            </p>
                            <CronSetter
                                balenaId={device.balenaId}
                                initialValue="1 1 * * 1"
                            />
                        </div>
                    );
                })}
            </div>
        </ScrollArea>
    );
}
