'use server';

import RoleDistributionChart from '@/components/charts/RoleDistributionChart';
import UserRegistrationChart from '@/components/charts/UserRegistrationChart';
import AdminUserTable from '@/components/tables/AdminUserTable';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getAllUsers } from '@/lib/actions/userActions';
import { verifySession } from '@/lib/session';

export default async function AdminManageUsersPage() {
    const { id, role } = await verifySession();
    const { error, message, data: users } = await getAllUsers(id);
    if (error) return <h2>Failed to get users: {message}</h2>;
    return (
        <ScrollArea className="flex flex-col justify-center items-start p-10 w-full h-[850px]">
            <h2 className="mb-10">Registered Users</h2>
            <AdminUserTable />
            <h2 className="mt-20 mb-10">Registration Trends</h2>
            <div className="flex justify-between">
                <UserRegistrationChart />
                <RoleDistributionChart />
            </div>
        </ScrollArea>
    );
}
