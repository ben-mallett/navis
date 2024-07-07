'use server';

import RoleDistributionChart from '@/components/charts/RoleDistributionChart';
import UserRegistrationChart from '@/components/charts/UserRegistrationChart';
import UserTable from '@/components/tables/UserTable';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getAllUsers } from '@/lib/actions/userActions';

export default async function AdminManageUsersPage() {
    const users = await getAllUsers();
    return (
        <ScrollArea className="flex flex-col justify-center items-start p-10 w-full h-[850px]">
            <h2 className="mb-10">Registered Users</h2>
            <UserTable users={users} />
            <h2 className="mt-20 mb-10">Registration Trends</h2>
            <div className="flex justify-between">
                <UserRegistrationChart />
                <RoleDistributionChart />
            </div>
        </ScrollArea>
    );
}
