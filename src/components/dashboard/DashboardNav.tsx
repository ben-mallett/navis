'use server';

import {
    Tv,
    User,
    LineChart,
    UserCog,
    SquareDot,
    Calendar,
    Cpu,
} from 'lucide-react';
import DashboardNavEntry from './DashboardNavEntry';
import { verifySession } from '@/lib/session';
import { Role } from '@prisma/client';
import { getDevicesOfUser } from '@/lib/actions/deviceActions';

export default async function DashboardNav() {
    const { id, role } = await verifySession();
    const { error, message, data: devices } = await getDevicesOfUser(id, id);

    return (
        <div className="sticky top-0 flex flex-col items-center justify-start w-[75px] border-r border-teal-300 min-h-screen">
            <DashboardNavEntry
                path="/"
                ChildIcon={
                    <SquareDot color="rgb(94 234 212)" strokeWidth={1.25} />
                }
                tooltipMessage="Home"
            />
            <DashboardNavEntry
                path="/dashboard/account"
                ChildIcon={<User color="rgb(94 234 212)" strokeWidth={1.25} />}
                tooltipMessage="Account Settings"
            />
            {devices && devices.length > 0 && (
                <DashboardNavEntry
                    path="/dashboard"
                    ChildIcon={
                        <LineChart color="rgb(94 234 212)" strokeWidth={1.25} />
                    }
                    tooltipMessage="View Dashboard"
                />
            )}
            {devices && devices.length > 0 && (
                <DashboardNavEntry
                    path="/dashboard/streaming"
                    ChildIcon={
                        <Tv color="rgb(94 234 212)" strokeWidth={1.25} />
                    }
                    tooltipMessage="View Streams"
                />
            )}
            {devices && devices.length > 0 && (
                <DashboardNavEntry
                    path="/dashboard/scheduling"
                    ChildIcon={
                        <Calendar color="rgb(94 234 212)" strokeWidth={1.25} />
                    }
                    tooltipMessage="Manage Scheduling"
                />
            )}
            {role !== undefined && role === Role.ADMIN && (
                <DashboardNavEntry
                    path="/dashboard/admin/users"
                    ChildIcon={
                        <UserCog color="rgb(94 234 212)" strokeWidth={1.25} />
                    }
                    tooltipMessage="Manage Users"
                />
            )}
            {role !== undefined && role === Role.ADMIN && (
                <DashboardNavEntry
                    path="/dashboard/admin/devices"
                    ChildIcon={
                        <Cpu color="rgb(94 234 212)" strokeWidth={1.25} />
                    }
                    tooltipMessage="Manage Devices"
                />
            )}
        </div>
    );
}
