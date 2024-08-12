'use server';

import { verifySession } from '@/lib/session';
import { getUserById } from '@/lib/actions/userActions';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getDevicesOfUser } from '@/lib/actions/deviceActions';
import AddDeviceButton from '@/components/buttons/AddDeviceButton';
import UserDeviceTable from '@/components/tables/UserDeviceTable';
import UpdateApiKeyButton from '@/components/buttons/UpdateApiKeyButton';

export default async function DashboardAccountPage() {
    const { id, role } = await verifySession();
    const userResponse = await getUserById(id, id);
    if (userResponse?.error) {
        return (
            <div className="flex flex-col items-center justify-start gap-4">
                <h2>Failed to fetch user information. Try refreshing.</h2>
                <p>{userResponse?.message}</p>
            </div>
        );
    }
    const deviceResponse = await getDevicesOfUser(
        userResponse?.data?.id as number,
        id
    );

    return (
        <ScrollArea className="flex flex-col justify-center items-start p-10 w-full h-[850px]">
            <h2 className="mb-10">Personal Information</h2>
            <div className="flex flex-col justify-between items-start gap-2 w-full">
                <div className="flex justify-between w-1/3">
                    <h4>ID:</h4>
                    <h4>{userResponse?.data?.id}</h4>
                </div>
                <div className="flex justify-between w-1/3">
                    <h4>Name:</h4>
                    <h4>{userResponse?.data?.name}</h4>
                </div>
                <div className="flex justify-between w-1/3">
                    <h4>Email:</h4>
                    <h4>{userResponse?.data?.email}</h4>
                </div>
                <div className="flex justify-between w-1/3">
                    <h4>Role:</h4>
                    <h4>{userResponse?.data?.role}</h4>
                </div>
                <div className="flex justify-end mt-4 w-1/3">
                    <UpdateApiKeyButton />
                </div>
            </div>
            <div className="flex justify-between items-center mt-20 mb-10">
                <h2 className="">Owned Devices</h2>
                <AddDeviceButton id={id} />
            </div>
            {deviceResponse.error ? (
                <div className="flex flex-col items-center gap-4">
                    <h2>Failed to fetch device information. Try refreshing.</h2>
                    <p>{deviceResponse?.message}</p>
                </div>
            ) : (
                <UserDeviceTable />
            )}
        </ScrollArea>
    );
}
