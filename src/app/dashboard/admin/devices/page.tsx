'use server';

import DeviceCreationTimelineChart from '@/components/charts/DeviceCreationTimelineChart';
import AdminDeviceTable from '@/components/tables/AdminDeviceTable';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getAllDevices } from '@/lib/actions/deviceActions';
import { verifySession } from '@/lib/session';

export default async function AdminManageDevicesPage() {
    const { id, role } = await verifySession();
    const { error, message, data: devices } = await getAllDevices(id);
    if (error) return <h2>Failed to get devices: {message}</h2>;
    return (
        <ScrollArea className="flex flex-col justify-center items-start p-10 w-full h-[850px]">
            <h2 className="mb-10">All Devices</h2>
            <AdminDeviceTable />
            <h2 className="mt-20 mb-10">Device Statistics</h2>
            <div className="flex justify-between">
                <DeviceCreationTimelineChart />
            </div>
        </ScrollArea>
    );
}
