'use server';

import { verifySession } from '@/lib/session';
import { getUserById } from '@/lib/actions/userActions';
import DeviceTable from '@/components/tables/DeviceTable';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getDevicesOfUser } from '@/lib/actions/deviceActions';
import { DeviceT } from '@/components/tables/DeviceTable';

export default async function DashboardAccountPage() {
    const { id, role } = await verifySession();
    const userResponse = await getUserById(id);
    if (userResponse?.error) {
        return (
            <div className="flex flex-col items-center gap-4">
                <h2>Failed to fetch user information. Try refreshing.</h2>
                <p>{userResponse?.message}</p>
            </div>
        );
    }
    const deviceResponse = await getDevicesOfUser(
        userResponse?.data?.id as number
    );

    return (
        <ScrollArea className="flex flex-col justify-center items-start p-10 w-full h-[850px]">
            <h2 className="mb-10">Personal Information</h2>
            <div className="flex flex-col justify-between items-start gap-2 w-full">
                <div className="flex justify-between w-1/3">
                    <h4>Name:</h4>
                    <h4>{userResponse?.data?.id}</h4>
                </div>
                <div className="flex justify-between w-1/3">
                    <h4>Email:</h4>
                    <h4>{userResponse?.data?.email}</h4>
                </div>
                <div className="flex justify-between w-1/3">
                    <h4>Role:</h4>
                    <h4>{userResponse?.data?.role}</h4>
                </div>
            </div>
            <h2 className="mt-20 mb-10">Owned Devices</h2>
            {deviceResponse?.error === true ? (
                <div className="flex flex-col items-center gap-4">
                    <h2>Failed to fetch device information. Try refreshing.</h2>
                    <p>{deviceResponse?.message}</p>
                </div>
            ) : (
                <DeviceTable devices={deviceResponse?.data as DeviceT[]} />
            )}
        </ScrollArea>
    );
}
